import { Stack, StackProps } from "aws-cdk-lib";
import { ITable } from "aws-cdk-lib/aws-dynamodb";
import { IEventBus } from "aws-cdk-lib/aws-events";
import { Construct } from "constructs";
import { completeApi } from "../../bin/api/utils";
import {
  DynamoDBState,
  DynamoDBStateProps,
} from "../constructs/3factor-ddb-state-construct";
import {
  EventSystem,
  EventSystemProps,
} from "../constructs/3factor-event-system-construct";
import {
  AppsyncFunctionPropsMap,
  CodeFirstGraphqlApi,
  CodeFirstGraphqlApiProps,
  DataSourceResourceMap,
} from "../constructs/3factor-graphql-api-construct";
import {
  TaskRuleProps,
  Tasks,
  TasksProps,
} from "../constructs/3factor-tasks-construct";
import { valTransform } from "../utils";

export type DynamoDBStateSetting = Omit<DynamoDBStateProps, "eventTarget">;
export type EventSystemSetting = Omit<EventSystemProps, "api">;
export type CodeFirstGraphqlApiSetting<
  TDataSourceResourceMap extends DataSourceResourceMap,
  TAppsyncFunctionPropsMap extends AppsyncFunctionPropsMap
> = CodeFirstGraphqlApiProps<TDataSourceResourceMap, TAppsyncFunctionPropsMap>;
export interface TasksSetting<TTaskRulePropsList extends TaskRuleProps[]>
  extends Omit<TasksProps<TTaskRulePropsList>, "eventBus"> {}

export interface Cdk3FactorAppStackProps<
  TDataSourceResourceMap extends DataSourceResourceMap,
  TAppsyncFunctionPropsMap extends AppsyncFunctionPropsMap,
  TTaskRulePropsList extends TaskRuleProps[]
> extends StackProps {
  stateSetting: DynamoDBStateSetting;
  eventSystemSetting: EventSystemSetting;
  tasksSetting: TasksSetting<TTaskRulePropsList>;
  codeFirstGraphqlApiSetting: CodeFirstGraphqlApiSetting<
    TDataSourceResourceMap,
    TAppsyncFunctionPropsMap
  >;
}

export class Cdk3FactorAppStack<
  TDataSourceResourceMap extends DataSourceResourceMap = DataSourceResourceMap,
  TAppsyncFunctionPropsMap extends AppsyncFunctionPropsMap = AppsyncFunctionPropsMap,
  TTaskRulePropsList extends TaskRuleProps[] = TaskRuleProps[]
> extends Stack {
  readonly codeFirstGraphqlApi: CodeFirstGraphqlApi<
    TDataSourceResourceMap & {
      readonly none: null;
      readonly ddb: ITable;
      readonly eventBus: IEventBus;
    },
    TAppsyncFunctionPropsMap
  >;
  readonly state: DynamoDBState;
  readonly tasks: Tasks<TTaskRulePropsList>;
  readonly eventSystem: EventSystem;

  constructor(
    scope: Construct,
    id: string,
    props: Cdk3FactorAppStackProps<
      TDataSourceResourceMap,
      TAppsyncFunctionPropsMap,
      TTaskRulePropsList
    >
  ) {
    super(scope, id, props);

    const {
      eventSystemSetting,
      stateSetting,
      tasksSetting,
      codeFirstGraphqlApiSetting,
    } = props;

    this.eventSystem = new EventSystem(
      this,
      `${id}EventSystem`,
      eventSystemSetting
    );
    this.state = new DynamoDBState(this, `${id}State`, {
      ...stateSetting,
      eventTarget: this.eventSystem.eventBus,
    });
    this.tasks = new Tasks(this, `${id}Tasks`, {
      ...tasksSetting,
      functions: valTransform(tasksSetting.functions, (name, props) => ({
        ...props,
        grantPermissions: [
          ...props.grantPermissions,
          this.state.table.grantFullAccess.bind(this.state.table),
        ],
      })),
      eventBus: this.eventSystem.eventBus,
    });
    this.codeFirstGraphqlApi = new CodeFirstGraphqlApi(this, `${id}Api`, {
      dataSourceResourceMap: {
        none: null,
        ddb: this.state.table,
        eventBus: this.eventSystem.eventBus,
        ...codeFirstGraphqlApiSetting.dataSourceResourceMap,
      },
      appsyncFunctionPropsMap:
        codeFirstGraphqlApiSetting.appsyncFunctionPropsMap,
    });

    this.eventSystem.bind(this.codeFirstGraphqlApi.api);

    completeApi(this.codeFirstGraphqlApi);
  }
}
