import { IFilterPattern, InputTransformation } from "@aws-cdk/aws-pipes-alpha";
import * as path from "path";

export const eventFilters: IFilterPattern[] = [];
export const eventTransformationInput: InputTransformation =
  InputTransformation.fromEventPath("$.Records");
export const eventTransformationEntry: string = path.join(
  __dirname,
  "eventTransform.ts"
);
