import {
  Filter,
  IFilterPattern,
  InputTransformation,
  Pipe,
} from "@aws-cdk/aws-pipes-alpha";
import { LambdaEnrichment } from "@aws-cdk/aws-pipes-enrichments-alpha";
import { RemovalPolicy, Resource, ResourceProps } from "aws-cdk-lib";
import {
  AttributeType,
  BillingMode,
  StreamViewType,
  Table,
} from "aws-cdk-lib/aws-dynamodb";
import { EventBus } from "aws-cdk-lib/aws-events";
import { IStream, Stream } from "aws-cdk-lib/aws-kinesis";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { DynamoDBStreamSource } from "./ddb-stream-source";
import { EventBusTarget } from "./event-bus-target";

export interface DynamoDBStateProps extends ResourceProps {
  readonly eventFilters: IFilterPattern[];
  readonly enrichmentInputTrasformation?: InputTransformation;
  readonly targetInputTrasformation?: InputTransformation;
  readonly enrichmentFuncEntry: string;
  readonly eventTarget: EventBus;
}

export class DynamoDBState extends Resource {
  readonly table: Table;
  readonly stream: IStream;

  constructor(scope: Construct, id: string, props: DynamoDBStateProps) {
    super(scope, id, props);

    this.table = new Table(this, `${id}DdbTable`, {
      tableName: `${id}DdbTable`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      stream: StreamViewType.NEW_AND_OLD_IMAGES,
      timeToLiveAttribute: "ttl",
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.table.grantStreamRead;

    const pipe = new Pipe(this, `${id}DdbStreamPipe`, {
      pipeName: `${id}ddbStreamPipe`,
      source: new DynamoDBStreamSource(this.table, {
        maximumRetryAttempts: 2,
        startingPosition: StartingPosition.TRIM_HORIZON,
      }),
      filter: new Filter(props.eventFilters),
      enrichment: new LambdaEnrichment(
        new NodejsFunction(this, `${id}DdbStreamTransformationFunc`, {
          functionName: "ddbStreamTransformationFunc",
          entry: props.enrichmentFuncEntry,
        }),
        {
          inputTransformation: props.enrichmentInputTrasformation,
        }
      ),
      target: new EventBusTarget(props?.eventTarget, {
        source: "ddb-stream",
        resources: [this.table.tableArn],
        detailType: "StateChanged",
        inputTransformation: props.targetInputTrasformation,
      }),
    });
  }
}
