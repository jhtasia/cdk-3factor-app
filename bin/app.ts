import * as cdk from "aws-cdk-lib";
import { Cdk3FactorAppStack } from "../lib/stack/cdk-3factor-app-stack";
import { apiRules } from "./eventSystem/setting";
import {
  enrichmentFuncEntry,
  enrichmentInputTrasformation,
  eventFilters,
  targetInputTrasformation,
} from "./state/setting";
import { functions, rules } from "./task/setting";

const app = new cdk.App();

const stack = new Cdk3FactorAppStack(app, "ThreeFactorApp", {
  codeFirstGraphqlApiSetting: {
    dataSourceResourceMap: {},
    appsyncFunctionPropsMap: {},
  },
  stateSetting: {
    eventFilters,
    enrichmentInputTrasformation,
    enrichmentFuncEntry,
    targetInputTrasformation,
  },
  eventSystemSetting: {
    apiRules,
  },
  tasksSetting: {
    rules,
    functions,
  },
});

app.synth();
