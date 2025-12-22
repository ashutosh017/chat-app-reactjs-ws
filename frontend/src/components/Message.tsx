import { MessageInterface } from "../types";

export const Message = ({ msg }: { msg: MessageInterface }) => {
  console.log("msg avatar: ",msg.avatar)
  let x = ""
  console.log(x??2)
  return (
    <div
      className={`bg-zinc-800 w-full rounded-md my-2 px-2 py-2 flex flex-col sm:w-1/2   `}
    >
      <div className="text-md font-bold flex space-x-2 items-center py-2 rounded-md">
        <img className="rounded-full size-10" src={msg.avatar || 'person.png'} />
        <span className="">{msg.name}</span>
        <span className="text-sm font-normal">{msg.date}</span>
      </div>
      <div className="text-wrap break-words">{msg.message}</div>
      {msg.image && <img src={msg.image} alt="image" />}
    </div>
  );
};
