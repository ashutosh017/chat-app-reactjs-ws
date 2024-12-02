import { WebSocket, WebSocketServer } from "ws";
const wss = new WebSocketServer({ port: 8080 });

type User = {
  id:string
  name: string;
  socket: WebSocket;
  roomId: string;
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
          case "new_joining":
            const roomId = parsedData.roomId;
            const user = {id:"", name: parsedData.name, socket: socket, roomId};
            this.addUser(user, roomId);
            break;
          case "send_message":
            this.send_message(
              socket,
              parsedData.message,
              parsedData.name,
              parsedData.date,
              parsedData.roomId,
              parsedData.image
            );
        }
      });
      socket.on("close", () => {
        const user = this.users.find((user) => user.socket === socket);
        console.log("user: ", user?.name, " has left the room");
      });
    });
  }

  private addUser(user: User, roomId: string) {
    this.users.push(user);
    if (this.room.get(roomId)) {
      console.log("pushing in already existing room")
      this.room.set(roomId, [...(this.room.get(roomId) ?? []), user]);
    } else {
      console.log("pushing in new room")
      
      this.room.set(roomId, [user]);
    }
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
    socket: WebSocket,
    message: string,
    name: string,
    date: string,
    roomId: string,
    image?:string
  ) {
    console.log("message: ", message);
    console.log("roomId: ",roomId);
    console.log("this.room.get(roomId): ",this.room.get(roomId))
    this.room.get(roomId)?.forEach((otherUser) => {
      console.log("room found: ",otherUser.roomId);
      otherUser.socket.send(
        JSON.stringify({
          type: "new_message",
          payload: {
            data: {
              name,
              message,
              date,
              image
            },
          },
        })
      );
    });
  }
}

const chatRoom = new ChatRoom();
