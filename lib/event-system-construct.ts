import { Resource, ResourceProps } from "aws-cdk-lib";
import { IGraphqlApi } from "aws-cdk-lib/aws-appsync";
import {
  EventBus,
  EventPattern,
  Rule,
  RuleTargetInput,
} from "aws-cdk-lib/aws-events";
import {
  AppSync,
  AppSyncGraphQLApiProps,
  LambdaFunction,
} from "aws-cdk-lib/aws-events-targets";
import { IStream } from "aws-cdk-lib/aws-kinesis";
import { StartingPosition } from "aws-cdk-lib/aws-lambda";
import { KinesisEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { FunctionInfoMap } from "../utils";
import { TaskMap } from "./tasks-construct";

interface EventSystemProps<FIM extends FunctionInfoMap> extends ResourceProps {
  apiSetting: {
    api: IGraphqlApi;
    eventRules: {
      name: string;
      eventPattern: EventPattern;
      target: AppSyncGraphQLApiProps;
    }[];
  };
  tasksSetting: {
    tasks: TaskMap<FIM>;
    eventRules: {
      name: string;
      eventPattern: EventPattern;
      targetFunc: keyof FIM;
    }[];
  };
  stateStreamSetting: {
    stream: IStream;
    filters: Array<{
      [key: string]: any;
    }>;
    transformFuncProps: NodejsFunctionProps;
  };
}

export class EventSystem<FIM extends FunctionInfoMap> extends Resource {
  readonly eventBus: EventBus;

  constructor(scope: Construct, id: string, props: EventSystemProps<FIM>) {
    super(scope, id, props);

    const { tasksSetting, apiSetting, stateStreamSetting } = props;

    // Event Bus
    this.eventBus = new EventBus(this, "eventBus", {});
    tasksSetting.eventRules.map(
      (r) =>
        new Rule(this, r.name, {
          eventBus: this.eventBus,
          eventPattern: r.eventPattern,
          targets: [
            new LambdaFunction(tasksSetting.tasks[r.targetFunc], {
              event: RuleTargetInput.fromEventPath("$"),
            }),
          ],
        })
    );

    apiSetting.eventRules.map(
      (r) =>
        new Rule(this, "rule", {
          eventBus: this.eventBus,
          eventPattern: {},
          targets: [new AppSync(apiSetting.api, r.target)],
        })
    );

    if (Object.keys(stateStreamSetting.transformFuncProps).length > 0) {
      const transformFunc = new NodejsFunction(this, "transformFunc", {
        ...stateStreamSetting.transformFuncProps,
        environment: {
          ...stateStreamSetting.transformFuncProps.environment,
          EVENT_BUS_NAME: this.eventBus.eventBusName,
        },
      });

      transformFunc.addEventSource(
        new KinesisEventSource(stateStreamSetting.stream, {
          batchSize: 1,
          startingPosition: StartingPosition.TRIM_HORIZON,
          retryAttempts: 2,
          filters: stateStreamSetting.filters,
        })
      );

      this.eventBus.grantPutEventsTo(transformFunc);
    }
  }
}
