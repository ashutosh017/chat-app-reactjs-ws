import React, { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { iamgeAtom, nameAtom, roomIdAtom, socketAtom } from "../store/atom";
import { Button } from "../components/Button";
import { IoMdSend } from "react-icons/io";
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

  useEffect(() => {
    const roomId2 = localStorage.getItem("roomId") as string;
    const name2 = localStorage.getItem("name") as string;
    setRoomId(roomId2);
    setName(name2);
    socket.send(
      JSON.stringify({
        type: "new_joining",
        roomId: roomId2,
        name: name2,
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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="p-2 flex flex-col items-center h-screen w-full bg-zinc-900 text-white ">
      <ToastContainer
      />
      <div className="text-xl font-bold  min-h-10 flex justify-center items-center w-full rounded-md space-x-2 lg:w-1/2">
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

      <div className="flex  lg:bottom-8 lg:w-1/2 px-2 w-full space-x-2  ">
        <div className="flex items-center border rounded-md bg-white text-black flex-grow">
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
      <div className="">
        <input
          type="file"
          ref={imageRef}
          onChange={handleFileChange}
          className="hidden "
        />
      </div>
    </div>
  );
};



