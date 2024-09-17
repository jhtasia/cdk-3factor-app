import { Stack, StackProps } from "aws-cdk-lib";
import { TableBase } from "aws-cdk-lib/aws-dynamodb";
import { FunctionBase } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { defineSchema } from "../appsync/schema/utils";
import { lambdaDsInfoMap, taskInfoMap } from "../lambda";
import { valTransform } from "../utils";
import { DynamoDBState } from "./ddb-state-construct";
import { EventSystem } from "./event-system-construct";
import { CodeFirstGraphqlApi } from "./graphql-api-construct";
import { Tasks } from "./tasks-construct";

export interface Cdk3FactorAppStackProps extends StackProps {}

export class Cdk3FactorAppStack extends Stack {
  readonly codeFirstGraphqlApi: CodeFirstGraphqlApi<
    {
      ddb: TableBase;
    } & {
      [name in keyof typeof lambdaDsInfoMap]: FunctionBase;
    }
  >;
  readonly state: DynamoDBState;
  readonly tasks: Tasks<typeof taskInfoMap>;
  readonly eventSystem: EventSystem<typeof taskInfoMap>;

  constructor(scope: Construct, id: string, props: Cdk3FactorAppStackProps) {
    super(scope, id, props);

    this.state = new DynamoDBState(this, "State");
    this.tasks = new Tasks(this, "Tasks", {
      info: taskInfoMap,
    });
    this.codeFirstGraphqlApi = new CodeFirstGraphqlApi(this, "GraphqlApi", {
      dataSourceMap: {
        ddb: this.state.table,
        ...valTransform(
          lambdaDsInfoMap,
          (k: keyof typeof lambdaDsInfoMap, v: NodejsFunctionProps) =>
            new NodejsFunction(this, k, v)
        ),
      },
    });
    defineSchema(
      this.codeFirstGraphqlApi.apiSchema,
      this.codeFirstGraphqlApi.apiDataSources
    );
    this.codeFirstGraphqlApi.apiSchema;
    this.eventSystem = new EventSystem(this, "EventSystem", {
      apiSetting: {
        api: this.codeFirstGraphqlApi.api,
        eventRules: [],
      },
      tasksSetting: {
        tasks: this.tasks.tasks,
        eventRules: [],
      },
      stateStreamSetting: {
        stream: this.state.stream,
        filters: [],
        transformFuncProps: {},
      },
    });
  }
}
