import { Resource, ResourceProps } from "aws-cdk-lib";
import { IGraphqlApi } from "aws-cdk-lib/aws-appsync";
import {
  EventBus,
  EventPattern,
  Rule,
  RuleProps,
} from "aws-cdk-lib/aws-events";
import {
  AppSync,
  AppSyncGraphQLApiProps,
} from "aws-cdk-lib/aws-events-targets";
import { Construct } from "constructs";

export interface ApiRule extends AppSyncGraphQLApiProps, RuleProps {
  ruleName: string;
  eventPattern: EventPattern;
}

interface IEventSystem {
  bind: (api: IGraphqlApi) => void;
  addApiRule: (api: IGraphqlApi, apiRule: ApiRule) => Rule;
}

export interface EventSystemProps extends ResourceProps {
  readonly api?: IGraphqlApi;
  readonly apiRules?: ApiRule[];
}

export class EventSystem extends Resource implements IEventSystem {
  readonly eventBus: EventBus;
  readonly apiRules: ApiRule[];

  constructor(scope: Construct, id: string, props: EventSystemProps) {
    super(scope, id, props);

    const { api, apiRules = [] } = props;
    this.apiRules = apiRules;

    // Event Bus
    this.eventBus = new EventBus(this, `${id}EventBus`, {});

    if (api) {
      this.bind(api);
    }
  }

  public bind(api: IGraphqlApi) {
    this.apiRules.map((r) => this.addApiRule(api, r));
  }

  public addApiRule(api: IGraphqlApi, apiRule: ApiRule) {
    const { ruleName } = apiRule;
    const rule = new Rule(this, `${ruleName}`, {
      eventBus: this.eventBus,
      targets: [new AppSync(api, apiRule)],
      ...apiRule,
    });

    return rule;
  }
}
