import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

export const FirstScreen = () => {
    const navigate = useNavigate()
  return (
    <div className="h-screen bg-zinc-900">
      <Button func={() => {navigate("/createroom")}}>Create New Room</Button>
    </div>
  );
};
