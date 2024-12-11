import { useEffect, useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {  avatarAtom, nameAtom, roomIdAtom, socketAtom } from "../store/atom";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { generateRandomRoomId } from "../Functions/generateRandomId";

function App2() {
  const nameRef = useRef<HTMLInputElement>(null);
  const roomIdInputRef = useRef<HTMLInputElement>(null);
  const setRoomId = useSetRecoilState(roomIdAtom);
  const socket = useRecoilValue(socketAtom);
  const navigate = useNavigate();
  const setName = useSetRecoilState(nameAtom);
  const setAvatar = useSetRecoilState(avatarAtom)
  const avatar = useRecoilValue(avatarAtom);
  const avatarRef = useRef<HTMLInputElement>(null);

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
    roomId: string | undefined,
    avatar:string|undefined
  ) => {
    if (
      joiners_name === undefined ||
      joiners_name === "" ||
      roomId === undefined
    ) {
      alert("joiners name or roomId cannot be undefined");
      return;
    }
    let name2 =
      joiners_name +
      "-" +
      Math.floor(Number(Math.random().toFixed(10)) * 10000000000);
    localStorage.setItem("socket", JSON.stringify(socket));
    localStorage.setItem("name", joiners_name);
    localStorage.setItem("roomId", roomId);
    localStorage.setItem("avatar",avatar??"");
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
        : roomIdInputRef.current?.value,
      avatar
    );
  };

  const onAvatarInputChange =(e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files){
     const file = e.target.files[0];
     const reader = new FileReader();
     reader.onload = ()=>{
        setAvatar(reader.result as string)
     }
     reader.readAsDataURL(file);

    }
     

  }
  return (
    <div className="p-4 lg:p-16 h-screen w-full bg-zinc-900 ">
      <div className="flex flex-col space-y-2 lg:w-1/2  mx-auto">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              roomIdInputRef?.current?.focus();
            }
          }}
          ref={nameRef}
          type="text"
          className=" border border-gray-400 p-2 rounded-md bg-zinc-700 text-white "
          placeholder="Enter your name"
          autoFocus
        />
        <div  className="text-white flex space-x-4 flex-col md:flex-row md:items-center md:justify-centerp-1">
            <span className="font-thin lg:text-lg">Select your avatar (optional): </span>
        <input type="file" ref={avatarRef} onChange={onAvatarInputChange} className="text-white"/>

        </div>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleJoinRoom();
            }
          }}
          ref={roomIdInputRef}
          type="text"
          className=" border border-gray-400 p-2 rounded-md bg-zinc-700 text-white "
          placeholder="Enter room id"
        />
        <Button func={handleJoinRoom}>Join Room</Button>
      </div>
    </div>
  );
}

export default App2;
