import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

type User = {
  id: string;
  name: string;
  socket: WebSocket;
  roomId: string;
  avatar: string;
};
class ChatRoom {
  private users: User[];
  private room: Map<string, User[]>;

  constructor() {
    this.users = [];
    this.room = new Map<string, User[]>();
    wss.on("connection", (socket) => {
      console.log("someone has joined!");
      socket.on("message", (data) => {
        const parsedData = JSON.parse(data.toString());
        switch (parsedData.type) {
          // receiving from client
          case "new_joining":
            const id = "";
            const roomId = parsedData.roomId;
            const name = parsedData.name;
            const avatar = parsedData.avatar;
            const user = { id, name, socket, roomId, avatar };
            this.addUser(user, roomId);
            break;
          case "send_message":
            this.send_message(
              parsedData.message,
              parsedData.name,
              parsedData.date,
              parsedData.roomId,
              parsedData.image,
              parsedData.avatar
            );
        }
      });
      socket.on("close", () => {
        const user = this.users.find((user) => user.socket === socket);
      });
    });
  }

  private addUser(user: User, roomId: string) {
    const user2 = this.users.find((user2) => user2.socket === user.socket);
    if (user2) {
      return;
    }
    this.users.push(user);
    this.room.get(roomId)
      ? this.room.set(roomId, [...(this.room.get(roomId) ?? []), user])
      : this.room.set(roomId, [user]);
    this.init_handler(user, roomId);
  }
  private init_handler(user: User, roomId: string) {
    this.room.get(roomId)?.forEach((otherUser) => {
      otherUser.socket.send(
        JSON.stringify({
          type: "someone_joined",
          payload: {
            data: user.name + " has joined the room",
            roomId,
          },
        })
      );
    });
  }
  private send_message(
    message: string,
    name: string,
    date: string,
    roomId: string,
    image?: string,
    avatar?:string
  ) {
    this.room.get(roomId)?.forEach((otherUser) => {
      // sending to client
      otherUser.socket.send(
        JSON.stringify({
          type: "new_message",
          payload: {
            data: {
              name,
              message,
              date,
              image,
              avatar
            },
          },
        })
      );
    });
  }
}

new ChatRoom();
