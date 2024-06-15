export enum SupportedMessage {
  ADD_CHAT = "ADD_CHAT",
  UPDATE_CHAT = "UPDATE_CHAT",
}

type message_payload = {
  roomId: string;
  message: string;
  name: string;
  upvotes: number;
  chatId: string;
};

export type OutgoingMessage =
  | {
      type: SupportedMessage.ADD_CHAT;
      payload: message_payload;
    }
  | {
      type: SupportedMessage.UPDATE_CHAT;
      payload: Partial<message_payload>;
    };
