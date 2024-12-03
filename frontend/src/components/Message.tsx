import { message } from "../types";

export const Message =({ msg }: { msg: message }) => {
    return (
      <div
        className={`bg-zinc-800 w-full rounded-md my-2 px-2 py-2 flex flex-col sm:w-1/2   `}
      >
        <div className="text-md font-bold flex space-x-2 items-center py-2 rounded-md">
          <span className="">{msg.name}</span>
          <span className="text-sm font-normal">{msg.date}</span>
        </div>
        <div className="text-wrap break-words">{msg.message}</div>
        {msg.image && <img src={msg.image} alt="image" />}
      </div>
    );
  }