import { connection } from "websocket";
import { OutgoingMessage } from "./types/outgoing-messages";

interface User {
  name: string;
  id: string;
  ws: connection;
}

interface Room {
  users: User[];
}

export class UserManager {
  private rooms: Map<string, Room>;

  constructor() {
    this.rooms = new Map<string, Room>();
  }

  add_user(name: string, user_id: string, room_id: string, socket: connection) {
    if (!this.rooms.get(room_id)) {
      this.rooms.set(room_id, {
        users: [],
      });
    }
    this.rooms.get(room_id)?.users.push({
      id: user_id,
      name,
      ws: socket,
    });

    socket.on("close", () => {
      this.remove_user(room_id, user_id);
    });
  }

  remove_user(room_id: string, user_id: string) {
    const users = this.rooms.get(room_id)?.users;
    if (users) {
      users.filter(({ id }) => {
        id !== user_id;
      });
    }   
  }

  get_user(room_id: string, user_id: string) {
    if(!this.rooms.has(room_id)) {
        return null
    };
    const user = this.rooms.get(room_id)?.users.find((({id}) => id === user_id));
    return user ?? null;
  }

  broadcast(room_id: string, user_id: string, message: OutgoingMessage) {
    const users = this.get_user(room_id, user_id);
    
    if(!users) {
      return {message: 'No rooms active', success: false}
    };

    const room = this.rooms.get(room_id);

    if(!room) {
      return {message: 'No room found'}
    };

    room.users.forEach((user) => {
      if(user.id === user_id) {
        return;
      };
      console.log("outgoing message " + JSON.stringify(message))
      const data = JSON.stringify(message)
      user.ws.sendUTF(data)
    })
  }
}
