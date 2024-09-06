import { Code } from "aws-cdk-lib/aws-appsync";
import {
  CodeFirstSchema,
  GraphqlType,
  ResolvableField,
} from "awscdk-appsync-utils";
import { enumTypeMap } from "./enum-types";
import { objectTypeMap } from "./object-types";
import { DataSourceMap } from "./types";

const defineSchema = (
  schema: CodeFirstSchema,
  dataSourceMap: DataSourceMap
) => {
  [...Object.values(enumTypeMap), ...Object.values(objectTypeMap)].forEach(
    schema.addType
  );

  schema.addMutation(
    "todoCreate",
    new ResolvableField({
      args: {
        name: GraphqlType.string({ isRequired: true }),
        description: GraphqlType.string({ isRequired: true }),
        priority: GraphqlType.int(),
      },
      returnType: objectTypeMap.Todo.attribute(),
      dataSource: dataSourceMap.ddb,
      code: Code.fromInline(""),
    })
  );

  schema.addMutation(
    "todoUpdate",
    new ResolvableField({
      args: {
        name: GraphqlType.string(),
        description: GraphqlType.string(),
        priority: GraphqlType.int(),
        state: enumTypeMap.TodoStatus.attribute(),
      },
      returnType: objectTypeMap.Todo.attribute(),
      dataSource: dataSourceMap.ddb,
      code: Code.fromInline(""),
    })
  );

  schema.addQuery(
    "todo",
    new ResolvableField({
      args: {
        id: GraphqlType.string({ isRequired: true }),
      },
      returnType: objectTypeMap.Todo.attribute(),
      dataSource: dataSourceMap.ddb,
      code: Code.fromInline(""),
    })
  );
};
