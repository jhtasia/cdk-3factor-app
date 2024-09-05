import { RemovalPolicy, Resource, ResourceProps } from "aws-cdk-lib";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { IStream, Stream } from "aws-cdk-lib/aws-kinesis";
import { Construct } from "constructs";

export abstract class State extends Resource {
  abstract stream: IStream;
}

interface DynamoDBStateProps extends ResourceProps {}

export class DynamoDBState extends State {
  readonly table: Table;
  readonly stream: IStream;

  constructor(scope: Construct, id: string, props?: DynamoDBStateProps) {
    super(scope, id, props);

    const stream = new Stream(this, "DynamoDbStream");
    this.table = new Table(this, "ddbTable", {
      billingMode: BillingMode.PAY_PER_REQUEST,
      partitionKey: { name: "pk", type: AttributeType.STRING },
      sortKey: { name: "sk", type: AttributeType.STRING },
      pointInTimeRecovery: true,
      kinesisStream: stream,
      timeToLiveAttribute: "ttl",
      removalPolicy: RemovalPolicy.RETAIN,
    });
  }
}
