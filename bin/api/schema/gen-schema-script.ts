import { CodeFirstSchema } from "awscdk-appsync-utils";
import * as fs from "fs";
import { DataSourceMap, defineSchema, FunctionMap } from "../utils";

fs.writeFileSync(
  "schema.graphql",
  defineSchema(
    new CodeFirstSchema(),
    {} as DataSourceMap,
    {} as FunctionMap
  ).getDefinition()
);
