import { IFilterPattern, InputTransformation } from "@aws-cdk/aws-pipes-alpha";
import * as path from "path";

export const eventFilters: IFilterPattern[] = [];
export const enrichmentInputTrasformation: InputTransformation | undefined =
  undefined;
export const enrichmentFuncEntry: string = path.join(
  __dirname,
  "enrichment/index.ts"
);
export const targetInputTrasformation: InputTransformation | undefined =
  InputTransformation.fromObject({ name: "<$.name>", data: "<$.data>" });
