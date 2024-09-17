import { Code, FunctionRuntime } from "aws-cdk-lib/aws-appsync";
import { GraphqlType, ResolvableField } from "awscdk-appsync-utils";
import { bundle } from "cdk-appsync-typescript-resolver/lib/bundler";
import * as path from "path";
import { objectTypeMap } from "./object-types";
import { DataSourceMap } from "./types";

export const query = (dataSourceMap: DataSourceMap) => ({
  todo: new ResolvableField({
    args: {
      id: GraphqlType.string({ isRequired: true }),
    },
    returnType: objectTypeMap.Todo.attribute(),
    dataSource: dataSourceMap.ddb,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromInline(
      bundle({
        entryPoint: path.join(__dirname, "../resolvers/Query.todo.ts"),
        sourceMap: true,
      })
    ),
  }),
});
