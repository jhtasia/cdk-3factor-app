import { Code, FunctionRuntime } from "aws-cdk-lib/aws-appsync";
import {
  CodeFirstSchema,
  GraphqlType,
  ResolvableField,
} from "awscdk-appsync-utils";
import { bundle } from "cdk-appsync-typescript-resolver/lib/bundler";
import * as path from "path";
import { enumTypeMap } from "./enum-types";
import { objectTypeMap } from "./object-types";
import { DataSourceMap } from "./types";

export const mutation = (dataSourceMap: DataSourceMap) => ({
  todoCreate: new ResolvableField({
    args: {
      name: GraphqlType.string({ isRequired: true }),
      description: GraphqlType.string({ isRequired: true }),
      priority: GraphqlType.int(),
    },
    returnType: objectTypeMap.Todo.attribute(),
    dataSource: dataSourceMap.ddb,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromInline(
      bundle({
        entryPoint: path.join(__dirname, "../resolvers/Mutation.todoCreate.ts"),
        sourceMap: true,
      })
    ),
  }),
  // todoUpdate: new ResolvableField({
  //   args: {
  //     name: GraphqlType.string(),
  //     description: GraphqlType.string(),
  //     priority: GraphqlType.int(),
  //     state: enumTypeMap.TodoStatus.attribute(),
  //   },
  //   returnType: objectTypeMap.Todo.attribute(),
  //   dataSource: dataSourceMap.ddb,
  //   // code: Code.fromInline(""),
  // }),
});
