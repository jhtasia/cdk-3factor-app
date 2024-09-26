import { IPipe, ISource, SourceConfig } from "@aws-cdk/aws-pipes-alpha";
import { Duration, IResolvable } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { IRole } from "aws-cdk-lib/aws-iam";
import { CfnPipe } from "aws-cdk-lib/aws-pipes";

/**
 * Parameters for the SQS source.
 */
export interface DynamoDBStreamSourceSourceParameters {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-batchsize
   */
  readonly batchSize?: number;
  /**
   * Define the target queue to send dead-letter queue events to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-deadletterconfig
   */
  readonly deadLetterConfig?: CfnPipe.DeadLetterConfigProperty | IResolvable;
  /**
   * The maximum length of a time to wait for events.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumbatchingwindowinseconds
   */
  readonly maximumBatchingWindow?: Duration;
  /**
   * Discard records older than the specified age.
   *
   * The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumrecordageinseconds
   */
  readonly maximumRecordAge?: Duration;
  /**
   * Discard records after the specified number of retries.
   *
   * The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-maximumretryattempts
   */
  readonly maximumRetryAttempts?: number;
  /**
   * Define how to handle item process failures.
   *
   * `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-onpartialbatchitemfailure
   */
  readonly onPartialBatchItemFailure?: string;
  /**
   * The number of batches to process concurrently from each shard.
   *
   * The default value is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-parallelizationfactor
   */
  readonly parallelizationFactor?: number;
  /**
   * (Streams only) The position in a stream from which to start reading.
   *
   * *Valid values* : `TRIM_HORIZON | LATEST`
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcedynamodbstreamparameters.html#cfn-pipes-pipe-pipesourcedynamodbstreamparameters-startingposition
   */
  readonly startingPosition: string;
}

/**
 * A source that reads from an SQS queue.
 */
export class DynamoDBStreamSource implements ISource {
  private readonly table: ITable;
  readonly sourceArn;
  private sourceParameters;

  constructor(
    table: ITable,
    parameters?: DynamoDBStreamSourceSourceParameters
  ) {
    this.table = table;
    if (!table.tableStreamArn) {
      throw Error("tableStreamArn not found.");
    }
    this.sourceArn = table.tableStreamArn;
    if (parameters) {
      this.sourceParameters = parameters;
    }
  }

  bind(_pipe: IPipe): SourceConfig {
    if (!this.sourceParameters) {
      return {};
    }

    return {
      sourceParameters: {
        dynamoDbStreamParameters: {
          ...this.sourceParameters,
          batchSize: this.sourceParameters?.batchSize,
          maximumBatchingWindowInSeconds:
            this.sourceParameters?.maximumBatchingWindow?.toSeconds(),
          maximumRecordAgeInSeconds:
            this.sourceParameters?.maximumRecordAge?.toSeconds(),
        },
      },
    };
  }

  grantRead(grantee: IRole): void {
    this.table.grantStreamRead(grantee);
  }
}
