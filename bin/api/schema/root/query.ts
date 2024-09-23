import { Code, FunctionRuntime } from "aws-cdk-lib/aws-appsync";
import { GraphqlType, ResolvableField } from "awscdk-appsync-utils";
import * as path from "path";
import { bundle } from "../../build";
import { DataSourceMap, FunctionMap } from "../../utils";
import { objectTypeMap } from "../types/object-types";

export const query = (
  dataSourceMap: DataSourceMap,
  functionMap: FunctionMap
) => ({
  todo: new ResolvableField({
    args: {
      id: GraphqlType.string({ isRequired: true }),
    },
    returnType: objectTypeMap.Todo.attribute(),
    dataSource: dataSourceMap.ddb,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromInline(
      bundle(path.join(__dirname, "../../code/resolvers/Query.todo.ts"))
    ),
  }),
  user: new ResolvableField({
    args: {
      id: GraphqlType.string({ isRequired: true }),
    },
    returnType: objectTypeMap.User.attribute(),
    pipelineConfig: [functionMap.getUser],
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromInline(
      bundle(path.join(__dirname, "../../code/resolvers/Query.user.ts"))
    ),
  }),
});
