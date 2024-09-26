import { Resource, ResourceProps } from "aws-cdk-lib";
import {
  AppsyncFunction,
  AppsyncFunctionProps,
  AuthorizationType,
  Definition,
  DynamoDbDataSource,
  EventBridgeDataSource,
  FieldLogLevel,
  GraphqlApi,
  IGraphqlApi,
  LambdaDataSource,
  NoneDataSource,
} from "aws-cdk-lib/aws-appsync";
import { ITable, TableBase } from "aws-cdk-lib/aws-dynamodb";
import { IEventBus } from "aws-cdk-lib/aws-events";
import { FunctionBase, IFunction } from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { CodeFirstSchema } from "awscdk-appsync-utils";
import { Construct } from "constructs";
import { valTransform } from "../utils";

interface NodeJsFunctionProps extends NodejsFunctionProps {
  functionName: string;
  entry: string;
}

const isNodeJsFunctionProps = (obj: any): obj is NodeJsFunctionProps =>
  typeof obj?.functionName === "string" && typeof obj?.entry === "string";

export type DataSourceResource =
  | IFunction
  | ITable
  | IEventBus
  | null
  | NodejsFunctionProps;

type DataSourceType<R extends DataSourceResource> = R extends
  | IFunction
  | NodejsFunctionProps
  ? LambdaDataSource
  : R extends ITable
  ? DynamoDbDataSource
  : R extends IEventBus
  ? EventBridgeDataSource
  : R extends null
  ? NoneDataSource
  : never;

export type DataSourceResourceMap = {
  [name: string]: DataSourceResource;
};

export type AppsyncFunctionPropsMap = {
  [name: string]: AppsyncFunctionProps;
};

export interface CodeFirstGraphqlApiProps<
  TDataSourceResourceMap extends DataSourceResourceMap = DataSourceResourceMap,
  TAppsyncFunctionPropsMap extends AppsyncFunctionPropsMap = AppsyncFunctionPropsMap
> extends ResourceProps {
  dataSourceResourceMap: TDataSourceResourceMap;
  appsyncFunctionPropsMap: TAppsyncFunctionPropsMap;
}

export class CodeFirstGraphqlApi<
  TDataSourceResourceMap extends DataSourceResourceMap = DataSourceResourceMap,
  TAppsyncFunctionPropsMap extends AppsyncFunctionPropsMap = AppsyncFunctionPropsMap
> extends Resource {
  readonly api: IGraphqlApi;
  readonly apiSchema: CodeFirstSchema;
  readonly apiDataSources: {
    readonly [name in keyof TDataSourceResourceMap]: DataSourceType<
      TDataSourceResourceMap[name]
    >;
  };
  readonly apiFunctions: {
    readonly [name in keyof TAppsyncFunctionPropsMap]: AppsyncFunction;
  };

  constructor(
    scope: Construct,
    id: string,
    props: CodeFirstGraphqlApiProps<
      TDataSourceResourceMap,
      TAppsyncFunctionPropsMap
    >
  ) {
    super(scope, id, props);

    const { dataSourceResourceMap, appsyncFunctionPropsMap } = props;

    const dataSourceNames = Object.keys(
      dataSourceResourceMap
    ) as (keyof TDataSourceResourceMap)[];

    this.apiSchema = new CodeFirstSchema();
    this.api = new GraphqlApi(this, `${id}GraphqlApi`, {
      name: `${id}GraphqlApi`,
      definition: Definition.fromSchema(this.apiSchema),
      authorizationConfig: {
        additionalAuthorizationModes: [
          { authorizationType: AuthorizationType.IAM },
        ],
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.INFO,
      },
    });

    this.apiFunctions = valTransform(
      appsyncFunctionPropsMap,
      (name, props) => new AppsyncFunction(this, String(name), props)
    );

    this.apiDataSources = dataSourceNames
      .map(
        (name) =>
          [
            name,
            dataSourceResourceMap[name] === null
              ? this.api.addNoneDataSource(`${String(name)}Ds`)
              : isNodeJsFunctionProps(dataSourceResourceMap[name])
              ? this.api.addLambdaDataSource(
                  `${String(name)}Ds`,
                  new NodejsFunction(
                    this,
                    `${dataSourceResourceMap[name].functionName}`,
                    dataSourceResourceMap[name]
                  )
                )
              : dataSourceResourceMap[name] instanceof FunctionBase
              ? this.api.addLambdaDataSource(
                  `${String(name)}Ds`,
                  dataSourceResourceMap[name]
                )
              : dataSourceResourceMap[name] instanceof TableBase
              ? this.api.addDynamoDbDataSource(
                  `${String(name)}Ds`,
                  dataSourceResourceMap[name]
                )
              : null,
          ] as [string, DataSourceType<DataSourceResource>]
      )
      .filter((entry): entry is [string, DataSourceType<DataSourceResource>] =>
        Boolean(entry[1])
      )
      .reduce(
        (current, [name, ds]) => ({ ...current, [name]: ds }),
        {} as {
          [name in keyof TDataSourceResourceMap]: DataSourceType<
            TDataSourceResourceMap[name]
          >;
        }
      );
  }
}
