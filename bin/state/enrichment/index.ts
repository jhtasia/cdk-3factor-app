import { unmarshall } from "@aws-sdk/util-dynamodb";
import { InputEvent } from "./types";

/**
 * State event transformation function
 * @param event state event
 */
export const handler = async (events: InputEvent[]) => {
  const result = events.map((event) => {
    const { eventName, dynamodb } = event;
    const { NewImage, OldImage } = dynamodb;
    const newImage = unmarshall(NewImage ?? {});
    const oldImage = unmarshall(OldImage ?? {});
    const _type = newImage._type;

    if (_type === "TODO" && eventName === "INSERT") {
      return {
        name: "TodoCreated",
        data: {
          ...newImage,
          pk: undefined,
          sk: undefined,
          _type: undefined,
          assigneeId: undefined,
        },
      };
    }

    return {};
  });

  return result;
};
