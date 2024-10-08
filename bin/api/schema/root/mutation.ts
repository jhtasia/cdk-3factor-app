import { Code, FunctionRuntime } from "aws-cdk-lib/aws-appsync";
import { Directive, ResolvableField } from "awscdk-appsync-utils";
import * as path from "path";
import { bundle } from "../../build";
import { DataSourceMap, FunctionMap } from "../../utils";
import { inputTypeMap } from "../types/input-types";
import { objectTypeMap } from "../types/object-types";

export const mutation = (
  dataSourceMap: DataSourceMap,
  functionMap: FunctionMap
) => ({
  todoCreate: new ResolvableField({
    args: {
      input: inputTypeMap.TodoCreateInput.attribute({ isRequired: true }),
    },
    returnType: objectTypeMap.Todo.attribute(),
    dataSource: dataSourceMap.ddb,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromInline(
      bundle(
        path.join(__dirname, "../../code/resolvers/Mutation.todoCreate.ts")
      )
    ),
  }),
  userCreate: new ResolvableField({
    args: {
      input: inputTypeMap.UserCreateInput.attribute({ isRequired: true }),
    },
    returnType: objectTypeMap.User.attribute(),
    dataSource: dataSourceMap.ddb,
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromInline(
      bundle(
        path.join(__dirname, "../../code/resolvers/Mutation.userCreate.ts")
      )
    ),
  }),
  todoCreatedPublish: new ResolvableField({
    directives: [Directive.apiKey(), Directive.iam()],
    args: {
      message: inputTypeMap.TodoInput.attribute({
        isRequired: true,
      }),
    },
    returnType: objectTypeMap.Todo.attribute(),
    pipelineConfig: [functionMap.publishMessage],
    runtime: FunctionRuntime.JS_1_0_0,
    code: Code.fromInline(
      bundle(
        path.join(
          __dirname,
          "../../code/resolvers/Mutation.todoCreatedPublish.ts"
        )
      )
    ),
  }),
});
