import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { socketAtom } from "../store/atom";
import { message } from "../types";
import { Message } from "./Message";

export const Messages = () => {
    const socket = useRecoilValue(socketAtom);
    const [messages, setMessages] = useState<message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const prevMessagesRef = useRef(messages);
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

  
    useEffect(() => {
      if (messages.length > prevMessagesRef.current.length) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
      prevMessagesRef.current = messages;
    }, [messages]);
  
    return (
      <div className=" border-white w-full px-4 py-2 rounded-md my-4 overflow-y-scroll lg:w-1/2 flex flex-col  ">
        {messages.length > 0 &&
          messages.map((msg, ind) => <Message key={ind} msg={msg} />)}
        <div ref={messagesEndRef} />
      </div>
    );
  };