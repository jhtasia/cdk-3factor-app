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
  todoUpdate?: Maybe<Todo>;
};


export type MutationTodoCreateArgs = {
  description: Scalars['String']['input'];
  name: Scalars['String']['input'];
  priority?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationTodoUpdateArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<TodoStatus>;
};

export type Query = {
  __typename?: 'Query';
  todo?: Maybe<Todo>;
};


export type QueryTodoArgs = {
  id: Scalars['String']['input'];
};

export type Todo = {
  __typename?: 'Todo';
  created: Scalars['AWSDateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  priority: Scalars['Int']['output'];
  status: TodoStatus;
  updated: Scalars['AWSDateTime']['output'];
};

export enum TodoStatus {
  Done = 'done',
  Pending = 'pending'
}

export type User = {
  __typename?: 'User';
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};
