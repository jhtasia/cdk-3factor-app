import { Duration, Resource, ResourceProps } from "aws-cdk-lib";
import {
  Architecture,
  IFunction,
  Runtime,
  Tracing,
} from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import { FunctionInfoMap, valTransform } from "../utils";

export type TaskMap<FIM extends FunctionInfoMap> = {
  [name in keyof FIM]: IFunction;
};

interface TasksProps<FIM extends FunctionInfoMap> extends ResourceProps {
  info: FIM;
}

export class Tasks<FIM extends FunctionInfoMap> extends Resource {
  readonly tasks: TaskMap<FIM>;

  constructor(scope: Construct, id: string, props: TasksProps<FIM>) {
    super(scope, id, props);

    const { info } = props;

    this.tasks = valTransform<keyof FIM, NodejsFunctionProps, NodejsFunction>(
      info,
      (k: keyof FIM, v: NodejsFunctionProps) =>
        new NodejsFunction(this, String(k), {
          functionName: String(k),
          runtime: Runtime.NODEJS_20_X,
          architecture: Architecture.X86_64,
          memorySize: 1024,
          tracing: Tracing.ACTIVE,
          timeout: Duration.seconds(6),
          ...v,
        })
    );
  }
}
export { FunctionInfoMap };
