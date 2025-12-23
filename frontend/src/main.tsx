import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";
import SocketProvider from "./components/SocketProvider.tsx";

createRoot(document.getElementById("root")!).render(
  // <App />
  <RecoilRoot>
    <SocketProvider>
      <App />
    </SocketProvider>
  </RecoilRoot>
);
