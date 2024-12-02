import { useEffect, useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { nameAtom, roomIdAtom, socketAtom } from "./store/atom";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ChatRoom } from "./screens/ChatRoom";
import { Button } from "./components/Button";

const generateRandomRoomId = () => {
  const a: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const n = a.length;
  let randomRoomId = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * n);
    randomRoomId += a[randomIndex % n];
  }
  console.log("randomRoomId: ", randomRoomId);
  return randomRoomId;
};

function App2() {
  const nameRef = useRef<HTMLInputElement>(null);
  const roomIdInputRef = useRef<HTMLInputElement>(null);
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);
  const [socket, setSocket] = useRecoilState(socketAtom);
  const navigate = useNavigate();
  const [name, setName] = useRecoilState(nameAtom);

  useEffect(() => {
    localStorage.setItem("socket", JSON.stringify(socket));
    socket.onmessage = (ev) => {
      const parsedData = JSON.parse(ev.data);
      alert(parsedData.payload.data);
    };

    socket.onclose = (ev) => {
      console.log("event: ", ev, "\n has left");
    };
  }, []);

  const joinRoom = (
    socket: WebSocket,
    joiners_name: string | undefined,
    roomId: string | undefined
  ) => {
    if (
      joiners_name === undefined ||
      joiners_name === "" ||
      roomId === undefined
    ) {
      alert("joiners name cannot be undefined");
      return;
    }
    let name2 =
      joiners_name +
      "-" +
      Math.floor(Number(Math.random().toFixed(10)) * 10000000000);
      localStorage.setItem("socket",JSON.stringify(socket));
    localStorage.setItem("name", joiners_name);
    localStorage.setItem("roomId", roomId);
    setRoomId(roomId);
    setName(name2);
    navigate("/chatroom");
  };

  const handleJoinRoom = () => {
    const randomRoomId = generateRandomRoomId();

    joinRoom(
      socket,
      nameRef.current?.value,
      roomIdInputRef.current?.value === ""
        ? randomRoomId
        : roomIdInputRef.current?.value
    );
  };

  return (
    <div className="p-4 h-screen w-full bg-zinc-900 ">
      <div className="flex">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // handleCreateNewRoom();
              roomIdInputRef?.current?.focus();
            }
          }}
          ref={nameRef}
          type="text"
          className="mr-2 border border-gray-400 p-2 rounded-md bg-zinc-700 text-white "
          placeholder="Enter your name"
          autoFocus
        />
      </div>
      <div className="flex mt-4">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleJoinRoom();
            }
          }}
          ref={roomIdInputRef}
          type="text"
          className="mr-2 border border-gray-400 p-2 rounded-md bg-zinc-700 text-white "
          placeholder="Enter room id"
        />
        <Button func={handleJoinRoom}>Join Room</Button>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App2 />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;
