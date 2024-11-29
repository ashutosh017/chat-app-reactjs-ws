import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { RecoilRoot } from "recoil";



createRoot(document.getElementById("root")!).render(
  // <App />
 <RecoilRoot>
  <App/>
 </RecoilRoot>
);
