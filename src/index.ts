import http from "http";
import { connection, server } from "websocket";
import {config} from 'dotenv';
import {
  IncomingMessage,
  SupportedMessages,
} from "./helpers/types/incoming-messages";
import { UserManager } from "./helpers/user-manager";
import { InMemoryStore } from "./helpers/store";
import { SupportedMessage } from "./helpers/types/outgoing-messages";

config();

const http_server = http.createServer(function (request, response) {
  console.log(new Date() + " requested url " + request.url);
});

http_server.listen(process.env.PORT, () => {
  console.log(`Server running @${process.env.PORT}`);
});

const wss = new server({
  httpServer: http_server,
  autoAcceptConnections: true,
});

const user_manager = new UserManager();
const in_memory_store = new InMemoryStore()

function originIsAllowed(origin: string) {
  return true;
}

wss.on("request", function (request) {
  if (!originIsAllowed(request.origin)) {
    request.reject();
    console.log(
      new Date() + " Connection from origin " + request.origin + " rejected."
    );
    return;
  }

  const connection = request.accept("echo-protocol", request.origin);

  console.log(new Date() + " Connection accepted.");

  connection.on("message", function (message) {
    if (message.type === "utf8") {
      handle_message(connection, JSON.parse(message.utf8Data));
    }
  });
  connection.on("close", function (reasonCode, description) {
    console.log(
      new Date() + " Peer " + connection.remoteAddress + " disconnected."
    );
  });
});

function handle_message(connection: connection, message: IncomingMessage) {
  try {
    if (message.type === SupportedMessages.JOIN_ROOM) {
      const payload = message.payload;
      user_manager.add_user(payload.name, payload.userId, payload.roomId, connection);
    }

    if (message.type === SupportedMessages.SEND_MESSAGE) {
      const payload = message.payload;
      const user = user_manager.get_user(payload.roomId, payload.userId);
      console.log(user)
      if (!user) {
          console.error("User not found in the db");
          return;
      };
      
      let chat = in_memory_store.add_chat(payload.userId, user.name, payload.roomId, payload.message);
      console.log(chat)
      if (!chat) {
          return;
      }

      const outgoingPayload= {
          type: SupportedMessage.ADD_CHAT,
          payload: {
              chatId: chat.id,
              roomId: payload.roomId,
              message: payload.message,
              name: user.name,
              upvotes: 0
          }
      }
      user_manager.broadcast(payload.roomId, payload.userId, outgoingPayload)
    }

    if (message.type === SupportedMessages.UPVOTE_MESSAGE) {
      const payload = message.payload;
      in_memory_store.upvote(payload.userId, payload.roomId, payload.chatId);
      
    }
  } catch (error) {}
}
