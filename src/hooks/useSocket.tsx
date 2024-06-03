import { useContext } from "react";
import { SocketContext } from "../contexts/SocketProvider";

const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default useSocket;
