let global_chat_id = 0;

interface Chat {
  id: string;
  userId: string;
  name: string;
  message: string;
  upvotes: string[];
}
export interface Room {
  roomId: string;
  chats: Chat[];
}

export class InMemoryStore {
  private store: Map<string, Room>;

  constructor() {
    this.store = new Map<string, Room>();
  }

  init_room(room_id: string) {
    if (!this.store.has(room_id)) {
      return { success: false, message: "Room already exists" };
    }
    this.store.set(room_id, { roomId: room_id, chats: [] });
    return { success: true, message: "Room created successfully" };
  }

  get_chats(room_id: string, limit: number, offset: number) {
    if (!this.store.has(room_id)) {
      return { success: false, message: "Room does not exists" };
    }

    const data = this.store.get(room_id);

    return {
      success: true,
      data: data.chats
        .reverse()
        .slice(0, offset)
        .slice(-1 * limit),
      message: "Fetched data successfully",
    };
  }

  add_chat(user_id: string, name: string, room_id: string, message: string) {
    if (!this.store.has(room_id)) {
      this.init_room(room_id);
    }

    const room = this.store.get(room_id);

    if (!room) {
      return { message: "No room active", success: false };
    }

    const chat: Chat = {
      id: (global_chat_id++).toString(),
      message,
      name,
      upvotes: [],
      userId: user_id,
    };

    room.chats.push(chat);
    return { success: true, message: "User added to room successfully" };
  }

  upvote(user_id: string, room: string, chat_id: string) {

    if (!this.store.has(room)) {
      return { message: "Room does not exists", success: false };
    }

    const users = this.store.get(room);

    const chat = users.chats.find(({ id }) => id == chat_id);

    if (chat) {
      if (chat.upvotes.find((x) => x === user_id)) {
        return chat;
      }
      chat.upvotes.push(user_id);
    }
    return chat;
    }

}
