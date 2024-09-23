import { Resource, ResourceProps } from "aws-cdk-lib";
import { EventBus, Rule, RuleProps } from "aws-cdk-lib/aws-events";
import {
  LambdaFunction,
  LambdaFunctionProps,
} from "aws-cdk-lib/aws-events-targets";
import { Grant, IGrantable } from "aws-cdk-lib/aws-iam";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { valTransform } from "../utils";

export interface TaskFunctionProps extends NodejsFunctionProps {
  readonly grantPermissions: ((grantee: IGrantable) => Grant)[];
}

export type TaskFunctionsProps<
  TTaskRulePropsList extends TaskRuleProps[] = TaskRuleProps[]
> = {
  [functionName in TTaskRulePropsList[number]["func"]]: TaskFunctionProps;
};

export interface TaskRuleProps extends RuleProps, LambdaFunctionProps {
  readonly ruleName: string;
  readonly func: string;
}

export interface TasksProps<
  TTaskRulePropsList extends TaskRuleProps[] = TaskRuleProps[]
> extends ResourceProps {
  readonly eventBus: EventBus;
  readonly rules: TTaskRulePropsList;
  readonly functions: TaskFunctionsProps<TTaskRulePropsList>;
}
export class Tasks<
  TTaskRulePropsList extends TaskRuleProps[] = TaskRuleProps[]
> extends Resource {
  readonly functions: {
    [key in TTaskRulePropsList[number]["func"]]: NodejsFunction;
  };

  constructor(
    scope: Construct,
    id: string,
    props: TasksProps<TTaskRulePropsList>
  ) {
    super(scope, id, props);

    const { eventBus, functions, rules } = props;

    this.functions = valTransform(functions, (funcName, funcProps) => {
      const func = new NodejsFunction(this, `${id}${funcName}`, funcProps);

      funcProps.grantPermissions.forEach((grantPermission) =>
        grantPermission(func)
      );

      return func;
    });

    rules.map((ruleProps: TTaskRulePropsList[number]) => {
      const ruleName = ruleProps.ruleName;
      const func = ruleProps.func as TTaskRulePropsList[number]["func"];
      new Rule(this, `${id}${ruleName}`, {
        targets: [new LambdaFunction(this.functions[func], ruleProps)],
        eventBus,
        ...ruleProps,
      });
    });
  }
}
