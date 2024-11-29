import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { nameAtom, roomIdAtom, socketAtom } from "./store/atom";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import { ChatRoom } from "./components/ChatRoom";

const generateRandomRoomId = () => {
  const a: string =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  const n = a.length;
  let randomRoomId = "";
  for (let i = 0; i < 10; i++) {
    const randomIndex = Math.floor(Math.random() * n);
    randomRoomId += a[randomIndex];
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
    if (socket.readyState === 3) {
      console.log("useEffect | entered in if block");
      setSocket(new WebSocket("ws://localhost:8080"));
    }

    socket.onmessage = (ev) => {
      const parsedData = JSON.parse(ev.data);
      alert(parsedData.payload.data);
    };

    socket.onclose = (ev) => {
      console.log("event: ", ev, "\n has left");
    };
  }, []);

  const joinRoom = (socket:WebSocket, joiners_name:string | undefined, roomId:string | undefined)=>{

    if (socket.readyState === 3) {
      console.log("handleClick | entered in if block");
      setSocket(new WebSocket("ws://localhost:8080"));
    }
    console.log("ws ready state: ", socket.readyState);
    console.log("value of socket: ", socket);
  
    if(joiners_name===undefined ||joiners_name==="" || roomId===undefined){
      alert("joiners name cannot be undefined");
      return;
    }

    let name2 = joiners_name + "-" + Math.floor(Number(Math.random().toFixed(10)) * 10000000000)
    setRoomId(roomId);
    console.log("name2: ",name2);
    setName(
      name2
    );
    socket.send(JSON.stringify({
      type:"new_joining",
      name:name2,
      roomId
    }))
    navigate("/chatroom")


  }

  const handleCreateNewRoom = () => {
    const randomRoomId = generateRandomRoomId();

    joinRoom(socket,nameRef.current?.value, randomRoomId);
  };

  const handleJoinCustomRoom = ()=>{
    joinRoom(socket,nameRef?.current?.value,  roomIdInputRef?.current?.value)
  }

  return (
    <div className="p-4 h-screen w-full bg-zinc-900 ">
      <div className="flex">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleCreateNewRoom();
            }
          }}
          ref={nameRef}
          type="text"
          className="mr-2 border border-gray-400 p-2 rounded-md bg-zinc-700 text-white "
          placeholder="Enter your name"
          autoFocus
        />
        <button
          onClick={handleCreateNewRoom}
          className="bg-blue-700 p-2 rounded-md text-white mr-2 cursor-pointer hover:bg-blue-600"
        >
          Enter ChatRoom
        </button>
      </div>
      <div className="flex mt-4">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleJoinCustomRoom();
            }
          }}
          ref={roomIdInputRef}
          type="text"
          className="mr-2 border border-gray-400 p-2 rounded-md bg-zinc-700 text-white "
          placeholder="Enter room id"
          autoFocus
        />
        <button
          onClick={handleJoinCustomRoom}
          className="bg-blue-700 p-2 rounded-md text-white mr-2 cursor-pointer hover:bg-blue-600"
        >
          Join Room
        </button>
        {/* <button
          onClick={generateRandomRoomId}
          className="bg-blue-700 p-2 rounded-md text-white mr-2 cursor-pointer hover:bg-blue-600"
        >
        generate random room Id
        </button> */}
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
