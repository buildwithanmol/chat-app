import http from "http";
import { connection, server } from "websocket";
import {
  IncomingMessage,
  SupportedMessages,
} from "./helpers/types/incoming-messages";

const http_server = http.createServer(function (request, response) {
  console.log(new Date() + " requested url " + request.url);
});

http_server.listen(process.env.PORT, () => {
  console.log(`Server running @${process.env.PORT}`);
});

const wss = new server({
  httpServer: http_server,
  autoAcceptConnections: false,
});

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

  var connection = request.accept("echo-protocol", request.origin);

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
      
    }

    if (message.type === SupportedMessages.SEND_MESSAGE) {
    }

    if (message.type === SupportedMessages.UPVOTE_MESSAGE) {
    }
  } catch (error) {}
}
