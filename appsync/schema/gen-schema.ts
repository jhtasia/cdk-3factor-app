import { CodeFirstSchema } from "awscdk-appsync-utils";
import * as fs from "fs";
import { DataSourceMap } from "./types";
import { defineSchema } from "./utils";

const tool = defineSchema(new CodeFirstSchema(), {} as DataSourceMap);
fs.writeFileSync("schema.graphql", tool.getDefinition());
