import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  avatarAtom,
  iamgeAtom,
  nameAtom,
  roomIdAtom,
  socketAtom,
} from "../store/atom";
import { Button } from "../components/Button";
import { IoMdCloseCircle, IoMdSend } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import { MdOutlineContentCopy } from "react-icons/md";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Messages } from "../components/Messages";

export const ChatRoom = () => {
  const messageRef = useRef<HTMLInputElement>(null);
  // const [socket, setSocket] = useRecoilState(socketAtom);
  const socket = useRecoilState(socketAtom)[0];
  const [name, setName] = useRecoilState(nameAtom);
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);
  const [selectedImage, setSelectedImage] = useRecoilState(iamgeAtom);
  const imageRef = useRef<HTMLInputElement>(null);
  const avatar = useRecoilValue(avatarAtom);
  const setAvatar = useSetRecoilState(avatarAtom);
  const [selectedImageName, setSelectedImageName] = useState("");
  useEffect(() => {
    const roomId2 = localStorage.getItem("roomId") as string;
    const name2 = localStorage.getItem("name") as string;
    const avatar2 = localStorage.getItem("avatar") as string;
    setRoomId(roomId2);
    setName(name2);
    setAvatar(avatar2);
    socket.send(
      // sending to server
      JSON.stringify({
        type: "new_joining",
        roomId: roomId2,
        name: name2,
        avatar: avatar2,
      })
    );
  }, []);

  const handleSendMessage = () => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    const date = `${hours}:${formattedMinutes} ${ampm}`;

    if (!socket) {
      console.log("returning because there no any socket");
      return;
    }
    socket.send(
      JSON.stringify({
        type: "send_message",
        message: messageRef?.current?.value,
        name,
        date,
        roomId,
        image: selectedImage,
        avatar,
      })
    );

    if (messageRef.current) {
      messageRef.current.value = "";
    }
    if (imageRef.current) {
      imageRef.current.value = "";
    }
    if (selectedImage) {
      setSelectedImage("");
    }
    messageRef.current?.focus();
    setSelectedImageName("")
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imageRef.current?.files) console.log(imageRef.current?.files[0].name);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      setSelectedImageName(file.name);
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        // console.log("reader.result as string = ",reader.result)
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="p-2 lg:p-32 flex flex-col items-center h-screen w-full bg-zinc-900 text-white justify-end">
      <ToastContainer />
      <div className="text-xl font-bold  min-h-10 flex justify-center items-center w-full rounded-md space-x-2 lg:w-1/2 absolute top-4 bg-zinc-900 pb-4">
        <div>{roomId}</div>
        <div className="">
          <MdOutlineContentCopy
            onClick={() => {
              navigator.clipboard.writeText(roomId);
              toast.success("Room ID copied to clipboard!", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
                transition: Bounce,
              });
            }}
            className="size-6 hover:opacity-80"
          />
        </div>
      </div>
      <Messages />
      <div className="">
        <input
          type="file"
          ref={imageRef}
          onChange={handleFileChange}
          className=" hidden"
        />
      </div>

      <div className="flex items-center flex-col lg:bottom-8 lg:w-1/2 px-2 w-full space-x-2  ">
   {selectedImageName &&
    <div className="w-full flex justify-between items-center lg:w-1/2 bg-zinc-800 px-4 py-1 rounded-t-full">
    <div className="truncate ">
          {selectedImageName}
        </div>
        <button onClick={()=>setSelectedImageName("")} className="cursor-pointer hover:bg-zinc-700 rounded-md px-2 py-1">
        <IoMdCloseCircle className='size-5 '/>
        </button>
    </div>
   }
        <div className="flex  space-x-2 w-full items-center justify-center">
          <div className="flex flex-grow w-full items-center border rounded-md bg-white text-black ">
            <input
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              ref={messageRef}
              placeholder="Type your message"
              className="p-2 flex-grow rounded-l-md focus:outline-none"
              autoFocus
            />
            <button
              className="flex justify-center items-center px-3 hover:bg-gray-200 rounded-r-md"
              onClick={() => {
                messageRef.current?.focus();
                imageRef.current?.click();
              }}
            >
              <CgAttachment className="text-xl" />
            </button>
          </div>
          <Button func={handleSendMessage}>
            <IoMdSend className="size-6 mx-auto" />
          </Button>
        </div>
      </div>
    </div>
  );
};
