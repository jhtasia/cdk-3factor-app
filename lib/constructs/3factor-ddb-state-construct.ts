import {
  Filter,
  IFilterPattern,
  InputTransformation,
  Pipe,
} from "@aws-cdk/aws-pipes-alpha";
import { LambdaEnrichment } from "@aws-cdk/aws-pipes-enrichments-alpha";
import { RemovalPolicy, Resource, ResourceProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { EventBus } from "aws-cdk-lib/aws-events";
import { IStream, Stream } from "aws-cdk-lib/aws-kinesis";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { EventBusTarget } from "./event-bus-target";
import { StreamSource } from "./stream-source";

export interface DynamoDBStateProps extends ResourceProps {
  readonly eventFilters: IFilterPattern[];
  readonly eventTransformationInput: InputTransformation;
  readonly eventTransformationEntry: string;
  readonly eventTarget: EventBus;
}

export class DynamoDBState extends Resource {
  readonly table: Table;
  readonly stream: IStream;

  constructor(scope: Construct, id: string, props: DynamoDBStateProps) {
    super(scope, id, props);

    const stream = new Stream(this, `${id}DdbStream`);
    this.table = new Table(this, `${id}DdbTable`, {
      tableName: `${id}DdbTable`,
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      kinesisStream: stream,
      timeToLiveAttribute: "ttl",
      removalPolicy: RemovalPolicy.RETAIN,
    });

    this.table.grantStreamRead;

    const pipe = new Pipe(this, `${id}DdbStreamPipe`, {
      pipeName: `${id}ddbStreamPipe`,
      source: new StreamSource(stream, {
        startingPosition: StartingPosition.TRIM_HORIZON,
      }),
      target: new EventBusTarget(props?.eventTarget, {
        source: "ddb-kinesis-data-stream",
        resources: [this.table.tableArn, stream.streamArn],
      }),
      filter: new Filter(props.eventFilters),
      enrichment: new LambdaEnrichment(
        new NodejsFunction(this, `${id}DdbStreamTransformationFunc`, {
          functionName: "ddbStreamTransformationFunc",
          entry: props.eventTransformationEntry,
        }),
        {
          inputTransformation: props.eventTransformationInput,
        }
      ),
    });
  }
}
