import {
  AppsyncFunction,
  BaseDataSource,
  Code,
  FunctionRuntime,
  IGraphqlApi,
} from "aws-cdk-lib/aws-appsync";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import {
  CodeFirstSchema,
  Field,
  IIntermediateType,
  ObjectType,
  ResolvableField,
} from "awscdk-appsync-utils";
import { shapeAddition } from "awscdk-appsync-utils/lib/private";
import { IConstruct } from "constructs";
import { CodeFirstGraphqlApi } from "../../lib/constructs/3factor-graphql-api-construct";
import { valTransform } from "../../lib/utils";
import { mutation } from "./schema/root/mutation";
import { query } from "./schema/root/query";
import { subscriptionMap } from "./schema/root/subscription";
import { enumTypeMap } from "./schema/types/enum-types";
import { inputTypeMap } from "./schema/types/input-types";
import { objectTypeMap } from "./schema/types/object-types";
import { addResolvableFields } from "./schema/types/resolvable-fields";
import {
  DataSourceName,
  dataSources,
  ExistsDataSource,
  FunctionName,
  functions,
} from "./setting";

export type DataSourceMap = { [name in DataSourceName]: BaseDataSource };
export type FunctionMap = { [name in FunctionName]: AppsyncFunction };

export const schemaTool = (schema: CodeFirstSchema) => {
  let types: IIntermediateType[] = [];
  let mutation: ObjectType | null = null;
  let query: ObjectType | null = null;
  let subscription: ObjectType | null = null;

  function declareSchema(): string {
    if (!query && !mutation && !subscription) {
      return "";
    }
    type root = "mutation" | "query" | "subscription";
    const list: root[] = ["query", "mutation", "subscription"];
    return (
      shapeAddition({
        prefix: "schema",
        fields: list
          .map((key: root) => {
            const val =
              key === "mutation"
                ? mutation
                : key === "query"
                ? query
                : subscription;
            return val ? `${key}: ${val.name}` : "";
          })
          .filter((field) => field != ""),
      }) + "\n"
    );
  }

  return {
    addTypes: (typeMap: { [typename: string]: IIntermediateType }) =>
      types.push(
        ...Object.keys(typeMap).map((typename) =>
          schema.addType(typeMap[typename as keyof typeof typeMap])
        )
      ),
    addMutations: (mutationMap: { [fieldname: string]: ResolvableField }) => {
      mutation = Object.keys(mutationMap)
        .map((fieldname) =>
          schema.addMutation(
            fieldname,
            mutationMap[fieldname as keyof typeof mutationMap]
          )
        )
        .slice(-1)[0];
      if (mutation) types.push(mutation);
    },
    addQuerys: (queryMap: { [fieldname: string]: ResolvableField }) => {
      query = Object.keys(queryMap)
        .map((fieldname) =>
          schema.addQuery(
            fieldname,
            queryMap[fieldname as keyof typeof queryMap]
          )
        )
        .slice(-1)[0];
      if (query) types.push(query);
    },
    addSubscriptions: (subscriptionMap: { [fieldname: string]: Field }) => {
      subscription = Object.keys(subscriptionMap)
        .map((fieldname) =>
          schema.addSubscription(
            fieldname,
            subscriptionMap[fieldname as keyof typeof subscriptionMap]
          )
        )
        .slice(-1)[0];
      if (subscription) types.push(subscription);
    },
    getDefinition: () =>
      types.reduce(
        (acc, type) => `${acc}${type.toString()}\n`,
        `${declareSchema()}
scalar AWSDateTime
scalar AWSTimestamp
scalar AWSJSON
scalar AWSURL
scalar AWSDate
scalar AWSBoolean
scalar AWSDecimal
scalar AWSID
scalar AWSIPAddress
`
      ),
  };
};

export const addLambdaDataSources = (api: IGraphqlApi) =>
  valTransform(dataSources, (name, props) =>
    api.addLambdaDataSource(
      `${name}Ds`,
      new NodejsFunction(
        api.node.scope as IConstruct,
        `${api.node.id}${name}`,
        {
          functionName: `${api.node.id}${name}`,
          ...props,
        }
      )
    )
  );

export const addFunctions = (api: IGraphqlApi, dataSourceMap: DataSourceMap) =>
  valTransform(
    functions,
    (name, props) =>
      new AppsyncFunction(
        api.node.scope as IConstruct,
        `${name}AppsyncFunction`,
        {
          name,
          api,
          runtime: FunctionRuntime.JS_1_0_0,
          // @ts-ignore
          ...props,
          // @ts-ignore
          dataSource: dataSourceMap[props.dataSource],
          // @ts-ignore
          code: Code.fromInline(props.code),
        }
      )
  );

export const defineSchema = (
  schema: CodeFirstSchema,
  dataSourceMap: DataSourceMap,
  functionMap: FunctionMap
) => {
  const queryMap = query(dataSourceMap, functionMap);
  const mutationMap = mutation(dataSourceMap, functionMap);
  addResolvableFields(dataSourceMap, functionMap);

  const tool = schemaTool(schema);
  tool.addTypes(enumTypeMap);
  tool.addTypes(objectTypeMap);
  tool.addTypes(inputTypeMap);
  tool.addQuerys(queryMap);
  tool.addMutations(mutationMap);
  tool.addSubscriptions(subscriptionMap);

  return tool;
};

export const completeApi = (
  codeFirstGraphqlApi: CodeFirstGraphqlApi<{ [name in ExistsDataSource]: any }>
) => {
  const { api, apiSchema, apiDataSources } = codeFirstGraphqlApi;
  const dataSourceMap = {
    ...apiDataSources,
    ...addLambdaDataSources(api),
  };
  const functionMap = addFunctions(api, dataSourceMap);
  defineSchema(apiSchema, dataSourceMap, functionMap);
};
