import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageModel } from "../models/MessageModel";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessages } from "../utils/messageMethods";
import { useUnreadMessages } from "./UnreadMessagesProvider";

type SocketContextProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
};

const SocketContext = createContext<SocketContextProps | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

const socket = io("http://localhost:3001");

type SocketProviderProps = {
  children: ReactNode;
};
const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { addUnreadMessage } = useUnreadMessages();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    socket.connect();
    socket.emit("setup", user._id);
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const event = (data: MessageModel) => {
      if (selectedChat?._id !== data.chat._id) addUnreadMessage(data);
      console.log("message", data.content, data.chat.users);
      updateMessages(data, queryClient, true);
    };
    socket.on("message", event);
    return () => {
      socket.off("message", event);
    };
  }, [selectedChat]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
