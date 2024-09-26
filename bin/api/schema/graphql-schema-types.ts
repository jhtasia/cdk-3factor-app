export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSBoolean: { input: boolean; output: boolean; }
  AWSDate: { input: Date; output: Date; }
  AWSDateTime: { input: Date; output: Date; }
  AWSDecimal: { input: number; output: number; }
  AWSID: { input: string; output: string; }
  AWSIPAddress: { input: string; output: string; }
  AWSJSON: { input: object; output: object; }
  AWSTimestamp: { input: number; output: number; }
  AWSURL: { input: string; output: string; }
};

export type Mutation = {
  __typename?: 'Mutation';
  todoCreate?: Maybe<Todo>;
  todoCreatedPublish?: Maybe<Todo>;
  userCreate?: Maybe<User>;
};


export type MutationTodoCreateArgs = {
  input: TodoCreateInput;
};


export type MutationTodoCreatedPublishArgs = {
  input: TodoCreatedPublishInput;
};


export type MutationUserCreateArgs = {
  input: UserCreateInput;
};

export type Query = {
  __typename?: 'Query';
  todo?: Maybe<Todo>;
  user?: Maybe<User>;
};


export type QueryTodoArgs = {
  id: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  todoCreated: Todo;
};

export type Todo = {
  __typename?: 'Todo';
  assignee?: Maybe<User>;
  created: Scalars['AWSDateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  status: TodoStatus;
  updated: Scalars['AWSDateTime']['output'];
};

export type TodoCreateInput = {
  assigneeId?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
};

export type TodoCreatedPublishInput = {
  input: Todo;
};

export type TodoInput = {
  created: Scalars['AWSDateTime']['input'];
  description: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  priority: Scalars['Int']['input'];
  status: TodoStatus;
  updated: Scalars['AWSDateTime']['input'];
};

export enum TodoStatus {
  Done = 'done',
  Pending = 'pending'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
};

export type UserCreateInput = {
  name: Scalars['String']['input'];
};
