import { WebSocket, WebSocketServer } from "ws";
import cron from 'node-cron'
import express from 'express'
import http from 'http'
const app  = express();
const server = http.createServer(app)
const wss = new WebSocketServer({ server});
app.get("/", (req, res) => {
  res.send("HTTP server is running");
});



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

server.listen(8080,()=>console.log("hello"))

new ChatRoom();

const broadcastMessage = (message:string) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
cron.schedule('* * * * *', () => {
  console.log('Cron job executed: Broadcasting message to all clients');
  broadcastMessage('This is a scheduled message from the server!');
});
