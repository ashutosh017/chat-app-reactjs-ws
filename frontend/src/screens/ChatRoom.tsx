import { useEffect,  useRef, useState } from "react";
import { useRecoilState } from "recoil";
import {
  iamgeAtom,
  nameAtom,
  roomIdAtom,
  socketAtom,
} from "../store/atom";
import { message } from "../types";
import { Button } from "../components/Button";
import { CgAttachment } from "react-icons/cg";

export const ChatRoom = () => {
  const messageRef = useRef<HTMLInputElement>(null);
  // const [socket, setSocket] = useRecoilState(socketAtom);
  const socket = useRecoilState(socketAtom)[0];
  const [name, setName] = useRecoilState(nameAtom);
  const [roomId, setRoomId] = useRecoilState(roomIdAtom);
  const [selectedImage, setSelectedImage] = useRecoilState(iamgeAtom);
  const imageRef = useRef<HTMLInputElement>(null);

  useEffect(()=>{
    const roomId2 = localStorage.getItem("roomId") as string;
    const name2 = localStorage.getItem("name") as string;
    setRoomId(roomId2);
    setName(name2);
    socket.send(JSON.stringify({
      type:"new_joining",
      roomId:roomId2,
      name:name2
    }))
  },[])


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
    <div className="p-4 min-h-screen w-full bg-zinc-900 text-white ">
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
        <Button
          func={handleSendMessage}
        >
          Send message
        </Button>
      </div>
      <div className="">
      <CgAttachment/>
        <input type="file" ref={imageRef} onChange={handleFileChange} />
      </div>
      <Messages />
    </div>
  );
};

const Messages = () => {
  // const [socket, setSocket] = useRecoilState(socketAtom);
  const socket = useRecoilState(socketAtom)[0];
  const [messages, setMessages] = useState<message[]>([])
  useEffect(() => {
    localStorage.setItem("messages",JSON.stringify("[]"))
    setMessages([])
  }, []);
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

  return (
    <div>
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
            {msg.image && <img src={msg.image} alt="image" />}
          </div>
        ))}
    </div>
  );
};
