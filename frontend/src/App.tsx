import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ChatRoom } from "./screens/ChatRoom";
import App2 from "./screens/App2";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App2 />} />
          <Route path="/chatroom" element={<ChatRoom />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
export default App;