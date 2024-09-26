import {
  IInputTransformation,
  IPipe,
  ITarget,
  TargetConfig,
} from "@aws-cdk/aws-pipes-alpha";
import { IEventBus } from "aws-cdk-lib/aws-events";
import { IRole } from "aws-cdk-lib/aws-iam";

/**
 * SQS target properties.
 */
export interface EventBusTargetParameters {
  /**
   * The input transformation to apply to the message before sending it to the target.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargetparameters.html#cfn-pipes-pipe-pipetargetparameters-inputtemplate
   * @default none
   */
  readonly inputTransformation?: IInputTransformation;
  /**
   * A free-form string, with a maximum of 128 characters, used to decide what fields to expect in the event detail.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-detailtype
   */
  readonly detailType?: string;
  /**
   * The URL subdomain of the endpoint.
   *
   * For example, if the URL for Endpoint is https://abcde.veo.endpoints.event.amazonaws.com, then the EndpointId is `abcde.veo` .
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-endpointid
   */
  readonly endpointId?: string;
  /**
   * AWS resources, identified by Amazon Resource Name (ARN), which the event primarily concerns.
   *
   * Any number, including zero, may be present.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-resources
   */
  readonly resources?: Array<string>;
  /**
   * The source of the event.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-source
   */
  readonly source?: string;
  /**
   * The time stamp of the event, per [RFC3339](https://docs.aws.amazon.com/https://www.rfc-editor.org/rfc/rfc3339.txt) . If no time stamp is provided, the time stamp of the [PutEvents](https://docs.aws.amazon.com/eventbridge/latest/APIReference/API_PutEvents.html) call is used.
   *
   * @see http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-pipes-pipe-pipetargeteventbridgeeventbusparameters.html#cfn-pipes-pipe-pipetargeteventbridgeeventbusparameters-time
   */
  readonly time?: string;
}

/**
 * A EventBridge Pipes target that sends event to an event bus.
 */
export class EventBusTarget implements ITarget {
  private eventBus: IEventBus;

  private eventBusParameters?: EventBusTargetParameters;
  public readonly targetArn: string;
  constructor(eventBus: IEventBus, parameters?: EventBusTargetParameters) {
    this.eventBus = eventBus;
    this.targetArn = eventBus.eventBusArn;
    this.eventBusParameters = parameters;
  }
  grantPush(grantee: IRole): void {
    this.eventBus.grantPutEventsTo(grantee);
  }
  bind(pipe: IPipe): TargetConfig {
    if (!this.eventBusParameters) {
      return {
        targetParameters: {},
      };
    }

    return {
      targetParameters: {
        eventBridgeEventBusParameters: this.eventBusParameters,
      },
    };
  }
}
