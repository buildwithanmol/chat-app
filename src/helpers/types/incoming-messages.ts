import z from "zod";

export enum SupportedMessages {
  JOIN_ROOM = "join-room",
  SEND_MESSAGE = "send-message",
  UPVOTE_MESSAGE = "upvote-message",
}

export type IncomingMessage =
  | { type: SupportedMessages.JOIN_ROOM; payload: JOIN_ROOM_PAYLOAD }
  | { type: SupportedMessages.SEND_MESSAGE; payload: SEND_MESSAGE_PAYLOAD }
  | { type: SupportedMessages.UPVOTE_MESSAGE; payload: UPVOTE_MESSAGE_PAYLOAD };

const join_room = z.object({
  name: z.string(),
  userId: z.string(),
  roomId: z.string(),
});

const send_message = z.object({
  userId: z.string(),
  roomId: z.string(),
  message: z.string(),
});

const upvote_message = z.object({
  userId: z.string(),
  roomId: z.string(),
  chatId: z.string(),
});

type JOIN_ROOM_PAYLOAD = z.infer<typeof join_room>;
type SEND_MESSAGE_PAYLOAD = z.infer<typeof send_message>;
type UPVOTE_MESSAGE_PAYLOAD = z.infer<typeof upvote_message>;
