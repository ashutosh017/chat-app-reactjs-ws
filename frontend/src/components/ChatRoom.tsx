import { useEffect, useRef } from "react";
import { useRecoilState } from "recoil";
import { messagesAtom, nameAtom, roomIdAtom, socketAtom } from "../store/atom";
import { message } from "../types";
import { useNavigate } from "react-router-dom";

export const ChatRoom = () => {
  const navigate = useNavigate();
  const messageRef = useRef<HTMLInputElement>(null);
  const [socket, setSocket] = useRecoilState(socketAtom);
  const [name, setName] = useRecoilState(nameAtom);
  const [messages, setMessages] = useRecoilState(messagesAtom);
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);


  useEffect(() => {
    if (
      socket.readyState === 2 ||
      socket.readyState === 3 ||
      socket.readyState === 0
    ) {
      navigate("/");
    }

    socket.onmessage = (ev) => {
      let parsedData = JSON.parse(ev.data);
      if(parsedData.type==='someone_joined'){
        console.log("parsedData: ",parsedData);
      }
   else if(parsedData.type==='new_message'){
    parsedData = parsedData.payload.data
    const messageObj: message = {
      name: parsedData.name,
      message: parsedData.message,
      date: parsedData.date,
    };


    setMessages((cur) => {
      if (messageObj.name || messageObj.message || messageObj.date) {
        return [...cur, messageObj];
      }
      return cur;
    });
   }
    };
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
        roomId
      })
    );

    if (messageRef.current) {
      messageRef.current.value = "";
    }
  };
  return (
    <div className="p-4 h-screen w-full bg-zinc-900 text-white ">
      <div className="text-xl font-bold ">{roomId}</div>
      <div>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          ref={messageRef}
          placeholder="type your message"
          className="p-2 rounded-md mr-2 text-black"
          autoFocus
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-700 p-2 rounded-md text-white mr-2 cursor-pointer hover:bg-blue-600"
        >
          Send message
        </button>
      </div>
      {messages.length > 0 &&
        messages.map((msg, ind) => (
          <div
            key={ind}
            className={`bg-zinc-800 w-3/4 rounded-md my-2 px-2 py-2 `}
          >
            <div className="text-md font-bold flex space-x-2">
              <span className="">{msg.name}</span>
              <span className="text-sm font-normal">{msg.date}</span>
            </div>
            <div className="text-wrap break-words">{msg.message}</div>
          </div>
        ))}
    </div>
  );
};
