import {
  CodeFirstSchema,
  Field,
  IIntermediateType,
  ObjectType,
  ResolvableField,
} from "awscdk-appsync-utils";
import { shapeAddition } from "awscdk-appsync-utils/lib/private";
import { enumTypeMap } from "./enum-types";
import { mutation } from "./mutation";
import { objectTypeMap } from "./object-types";
import { query } from "./query";
import { DataSourceMap } from "./types";

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

export const defineSchema = (
  schema: CodeFirstSchema,
  dataSourceMap: DataSourceMap
) => {
  const queryMap = query(dataSourceMap);
  const mutationMap = mutation(dataSourceMap);

  const tool = schemaTool(schema);
  tool.addTypes(enumTypeMap);
  tool.addTypes(objectTypeMap);
  tool.addQuerys(queryMap);
  tool.addMutations(mutationMap);

  return tool;
};

export const genTypeFile = () => {
  defineSchema(new CodeFirstSchema(), {} as DataSourceMap).getDefinition();
};
