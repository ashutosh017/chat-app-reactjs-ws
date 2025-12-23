import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { socketAtom } from "../store/atom";

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const setSocket = useSetRecoilState(socketAtom);
  useEffect(() => {
    const ws = new WebSocket(
      import.meta.env.VITE_WS_URL ?? "ws://localhost:8080"
    );

    setSocket(ws);

    ws.onopen = () => {
      console.log("socket connected");
    };

    ws.onclose = () => {
      console.log("socket closed");
    };

    return () => {
      ws.close();
      setSocket(null);
    };
  }, []);
  return <div>{children}</div>;
}
