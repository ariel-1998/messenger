import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageModel } from "../models/MessageModel";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import { toastifyService } from "../services/toastifyService";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessages } from "../utils/messageMethods";

type SocketContextProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  emitJoinChat: (chatId: string) => void;
  emitLeavingChat: (chatId: string) => void;
  emitMessage: (msg: MessageModel) => void;
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
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    socket.connect();
    emitSetup(user._id);
    setupEvent("on");
    onMessage("on");
    return () => {
      setupEvent("off");
      onMessage("off");
      socket.disconnect();
    };
  }, [user]);

  //setup event function
  const setupListener = (connected: boolean) => {
    if (connected) return console.log(connected);
    toastifyService.error("There was an error connecting to live chat!");
    console.log(connected);
  };

  //for both creating and removing setup event
  const setupEvent = (event: "on" | "off") => {
    socket[event]("setup", setupListener);
  };

  //connecting to socket with userId
  const emitSetup = (userId: string) => {
    socket.emit("setup", userId);
  };

  //connecting to room with chatId
  const emitJoinChat = (chatId: string) => {
    socket.emit("joinChat", chatId);
  };

  //emit leaving chat
  const emitLeavingChat = (chatId: string) => {
    socket.emit("leaveChat", chatId);
  };

  //emiting msg
  const emitMessage = (msg: MessageModel) => {
    socket.emit("message", msg);
  };

  //listening to message event
  function onMessage(event: "on" | "off") {
    socket[event]("message", (data: MessageModel) => {
      updateMessages(data, queryClient, true);
      console.log("message", data);
    });
  }

  return (
    <SocketContext.Provider
      value={{ socket, emitJoinChat, emitLeavingChat, emitMessage }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
