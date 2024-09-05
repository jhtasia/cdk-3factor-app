import {
  DynamoDbDataSource,
  LambdaDataSource,
  NoneDataSource,
} from "aws-cdk-lib/aws-appsync";
import { lambdaDsInfoMap } from "../lambda";

export type DataSourceMap = {
  ddb: DynamoDbDataSource;
  none: NoneDataSource;
} & {
  [name in keyof typeof lambdaDsInfoMap]: LambdaDataSource;
};
