import { useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { avatarAtom, nameAtom, roomIdAtom, socketAtom } from "../store/atom";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { generateRandomRoomId } from "../Functions/generateRandomId";

function HomeScreen() {
  const navigate = useNavigate();

  const nameRef = useRef<HTMLInputElement>(null);
  const roomIdInputRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const socket = useRecoilValue(socketAtom);
  const [avatar, setAvatar] = useRecoilState(avatarAtom);

  const setRoomId = useSetRecoilState(roomIdAtom);
  const setName = useSetRecoilState(nameAtom);

 

  const handleJoinRoom = useCallback(() => {
    let name = nameRef.current?.value;
    if (name === undefined) {
      alert("joiners name cannot be undefined");
      return;
    }

    const randomRoomId = generateRandomRoomId();
    const inputRoomId = roomIdInputRef?.current?.value;
    const roomId =
      inputRoomId?.length === 0 || !inputRoomId ? randomRoomId : inputRoomId;

    name =
      name + "-" + Math.floor(Number(Math.random().toFixed(10)) * 10000000000);
    setRoomId(roomId);
    setName(name);

    navigate(`/chatroom/${roomId}`);
  }, [socket]);

  const onAvatarInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          setAvatar(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    },
    [avatar]
  );
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
        <div className="text-white flex space-x-4 flex-col md:flex-row md:items-center md:justify-centerp-1">
          <span className="font-thin lg:text-lg">
            Select your avatar (optional):{" "}
          </span>
          <input
            type="file"
            ref={avatarRef}
            onChange={onAvatarInputChange}
            className="text-white"
          />
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
          placeholder="Enter room id (optional)"
        />
        <Button func={handleJoinRoom}>Join Room</Button>
      </div>
    </div>
  );
}

export default HomeScreen;
