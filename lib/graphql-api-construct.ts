import { Resource, ResourceProps } from "aws-cdk-lib";
import {
  BaseDataSource,
  Definition,
  GraphqlApi,
  IGraphqlApi,
  NoneDataSource,
} from "aws-cdk-lib/aws-appsync";
import { TableBase } from "aws-cdk-lib/aws-dynamodb";
import { FunctionBase } from "aws-cdk-lib/aws-lambda";
import { CodeFirstSchema } from "awscdk-appsync-utils";
import { Construct } from "constructs";

export type DataSourceResourceMap = {
  [name: string]: FunctionBase | TableBase;
};

export interface CodeFirstGraphqlApiProps<DSRM extends DataSourceResourceMap>
  extends ResourceProps {
  dataSourceMap: DSRM;
}

export class CodeFirstGraphqlApi<
  DSRM extends DataSourceResourceMap
> extends Resource {
  readonly api: IGraphqlApi;
  readonly apiSchema: CodeFirstSchema;
  readonly apiDataSources: { [name in keyof DSRM]: BaseDataSource } & {
    none: NoneDataSource;
  };

  constructor(
    scope: Construct,
    id: string,
    props: CodeFirstGraphqlApiProps<DSRM>
  ) {
    super(scope, id, props);

    const { dataSourceMap } = props;

    const dataSourceNames = Object.keys(dataSourceMap) as (keyof DSRM)[];

    this.apiSchema = new CodeFirstSchema();
    this.api = new GraphqlApi(this, "GraphqlApi", {
      name: "GraphqlApi",
      definition: Definition.fromSchema(this.apiSchema),
    });

    this.apiDataSources = {
      none: this.api.addNoneDataSource("NoneDataSource"),
      ...dataSourceNames
        .map(
          (name) =>
            [
              name,
              dataSourceMap[name] instanceof FunctionBase
                ? this.api.addLambdaDataSource(
                    String(name),
                    dataSourceMap[name]
                  )
                : dataSourceMap[name] instanceof TableBase
                ? this.api.addDynamoDbDataSource(
                    String(name),
                    dataSourceMap[name]
                  )
                : null,
            ] as [string, BaseDataSource | null]
        )
        .filter((entry): entry is [string, BaseDataSource] => Boolean(entry[1]))
        .reduce(
          (current, [name, ds]) => ({ ...current, [name]: ds }),
          {} as { [name in keyof DSRM]: BaseDataSource }
        ),
    };
  }
}
