import { BaseDataSource, NoneDataSource } from "aws-cdk-lib/aws-appsync";
import { lambdaDsInfoMap } from "../../lambda";

export type DataSourceMap = {
  ddb: BaseDataSource;
  none: NoneDataSource;
} & {
  [name in keyof typeof lambdaDsInfoMap]: BaseDataSource;
};
