import { IPipe, ISource, SourceConfig } from "@aws-cdk/aws-pipes-alpha";
import { Duration, IResolvable } from "aws-cdk-lib";
import { IRole } from "aws-cdk-lib/aws-iam";
import { IStream } from "aws-cdk-lib/aws-kinesis";
import { CfnPipe } from "aws-cdk-lib/aws-pipes";

/**
 * Parameters for the SQS source.
 */
export interface StreamSourceParameters {
  /**
   * The maximum number of records to include in each batch.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-batchsize
   * @default 10
   */
  readonly batchSize?: number;

  /**
   * The maximum length of a time to wait for events.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumbatchingwindowinseconds
   * @default 1
   */
  readonly maximumBatchingWindow?: Duration;
  /**
   * Define the target queue to send dead-letter queue events to.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-deadletterconfig
   */
  readonly deadLetterConfig?: CfnPipe.DeadLetterConfigProperty | IResolvable;

  /**
   * Discard records older than the specified age.
   *
   * The default value is -1, which sets the maximum age to infinite. When the value is set to infinite, EventBridge never discards old records.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumrecordageinseconds
   */
  readonly maximumRecordAge?: Duration;
  /**
   * Discard records after the specified number of retries.
   *
   * The default value is -1, which sets the maximum number of retries to infinite. When MaximumRetryAttempts is infinite, EventBridge retries failed records until the record expires in the event source.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-maximumretryattempts
   */
  readonly maximumRetryAttempts?: number;
  /**
   * Define how to handle item process failures.
   *
   * `AUTOMATIC_BISECT` halves each batch and retry each half until all the records are processed or there is one failed message left in the batch.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-onpartialbatchitemfailure
   */
  readonly onPartialBatchItemFailure?: string;
  /**
   * The number of batches to process concurrently from each shard.
   *
   * The default value is 1.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-parallelizationfactor
   */
  readonly parallelizationFactor?: number;
  /**
   * The position in a stream from which to start reading.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingposition
   */
  readonly startingPosition: string;
  /**
   * With `StartingPosition` set to `AT_TIMESTAMP` , the time from which to start reading, in Unix time seconds.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipesourcekinesisstreamparameters.html#cfn-pipes-pipe-pipesourcekinesisstreamparameters-startingpositiontimestamp
   */
  readonly startingPositionTimestamp?: string;
}

/**
 * A source that reads from an SQS queue.
 */
export class StreamSource implements ISource {
  private readonly stream: IStream;
  readonly sourceArn;
  private sourceParameters;

  constructor(stream: IStream, parameters?: StreamSourceParameters) {
    this.stream = stream;
    this.sourceArn = stream.streamArn;
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
        kinesisStreamParameters: {
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
    this.stream.grantRead(grantee);
  }
}
