export interface InputEvent {
  evnetId: string;
  dynamodb: DynamoDBStreamEvent;
  eventName: "INSERT" | "MODIFY" | "REMOVE";
}

export interface DynamoDBStreamEvent {
  ApproximateCreationDateTime: number;
  Keys: {
    sk: {
      S: string;
    };
    pk: {
      S: string;
    };
  };
  NewImage?: {
    created: {
      S: "2024-09-24T10:04:56.588Z";
    };
    name: {
      S: "todo122382";
    };
    sk: {
      S: "TODO#01J8HQVFWCJ71WPBWFVAJW1C7R";
    };
    description: {
      S: "todo";
    };
    id: {
      S: "01J8HQVFWCJ71WPBWFVAJW1C7R";
    };
    pk: {
      S: "TODO#01J8HQVFWCJ71WPBWFVAJW1C7R";
    };
    priority: {
      N: "10";
    };
    updated: {
      S: "2024-09-24T10:04:56.588Z";
    };
    status: {
      S: "pending";
    };
  };
  OldImage?: {
    created: {
      S: "2024-09-24T10:04:56.588Z";
    };
    name: {
      S: "todo12238";
    };
    sk: {
      S: "TODO#01J8HQVFWCJ71WPBWFVAJW1C7R";
    };
    description: {
      S: "todo";
    };
    id: {
      S: "01J8HQVFWCJ71WPBWFVAJW1C7R";
    };
    pk: {
      S: "TODO#01J8HQVFWCJ71WPBWFVAJW1C7R";
    };
    priority: {
      N: "10";
    };
    updated: {
      S: "2024-09-24T10:04:56.588Z";
    };
    status: {
      S: "pending";
    };
  };
  SequenceNumber: string;
  SizeBytes: number;
  StreamViewType: "NEW_AND_OLD_IMAGES";
}
