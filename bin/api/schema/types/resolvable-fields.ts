import { Code, FunctionRuntime } from "aws-cdk-lib/aws-appsync";
import { ResolvableField } from "awscdk-appsync-utils";
import * as path from "path";
import { bundle } from "../../build";
import { DataSourceMap, FunctionMap } from "../../utils";
import { objectTypeMap } from "./object-types";

export const addResolvableFields = (
  dataSourceMap: DataSourceMap,
  functionMap: FunctionMap
) => {
  objectTypeMap.Todo.addField({
    fieldName: "assignee",
    field: new ResolvableField({
      returnType: objectTypeMap.User.attribute({}),
      runtime: FunctionRuntime.JS_1_0_0,
      code: Code.fromInline(
        bundle(path.join(__dirname, "../../code/resolvers/Todo.assignee.ts"))
      ),
      pipelineConfig: [functionMap.getUser],
    }),
  });
};
