import { connection } from "websocket";

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
        return {message: ''}
    }
  }

  broadcast() {}
}
