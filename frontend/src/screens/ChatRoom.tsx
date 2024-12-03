import React, { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { iamgeAtom, nameAtom, roomIdAtom, socketAtom } from "../store/atom";
import { message } from "../types";
import { Button } from "../components/Button";
import { IoMdSend } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";

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
      <div className="text-xl font-bold ">{roomId}</div>
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

const Messages = () => {
  // const socket = useRecoilState(socketAtom)[0];
  const socket = useRecoilValue(socketAtom);
  const [messages, setMessages] = useState<message[]>([]);
  // useEffect(() => {
  //   localStorage.setItem("messages", JSON.stringify("[]"));
  //   setMessages([]);
  // }, []);
  useEffect(() => {
    localStorage.setItem("messages", JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    socket.onmessage = (ev) => {
      let parsedData = JSON.parse(ev.data);
      if (parsedData.type === "someone_joined") {
        console.log("parsedData: ", parsedData);
      } else if (parsedData.type === "new_message") {
        parsedData = parsedData.payload.data;
        const messageObj: message = {
          name: parsedData.name,
          message: parsedData.message,
          date: parsedData.date,
          image: parsedData.image,
        };

        setMessages((cur) => {
          if (messageObj.name || messageObj.message || messageObj.date) {
            return [...cur, messageObj];
          }
          return cur;
        });
        console.log("messages.length: ", messages.length);
      }
    };
  }, []);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const prevMessagesRef = useRef(messages);

  // Scroll to bottom only for new messages
  useEffect(() => {
    if (messages.length > prevMessagesRef.current.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
    prevMessagesRef.current = messages;
  }, [messages]);
  // useEffect(() => {
  //   if (messagesEndRef.current) {
  //     messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, [messages]); // Trigger whenever `messages` change

  return (
    <div className="border border-white w-full px-4 py-4 rounded-md flex-grow my-4 overflow-y-scroll">
      {messages.length > 0 &&
        messages.map((msg, ind) => <Message key={ind} msg={msg} />)}
      <div ref={messagesEndRef} />
    </div>
  );
};

const Message = React.memo(({ msg }: { msg: message }) => {
  return (
    <div className={`bg-zinc-800 w-full rounded-md my-2 px-2 py-2 `}>
      <div className="text-md font-bold flex space-x-2">
        <span className="">{msg.name}</span>
        <span className="text-sm font-normal">{msg.date}</span>
      </div>
      <div className="text-wrap break-words">{msg.message}</div>
      {msg.image && <img src={msg.image} alt="image" />}
    </div>
  );
})
