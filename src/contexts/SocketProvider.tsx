import React, { ReactNode, createContext, useContext, useEffect } from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageModel } from "../models/MessageModel";
import { UserModel } from "../models/UserModel";
import { ChatModel } from "../models/ChatModel";
import { Outlet } from "react-router-dom";

type SocketContextProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  onSetup(cb: (val: boolean) => void): void;
  emitSetup: (user: UserModel) => void;
  onJoinChat: (chat: ChatModel) => void;
  onMessage(cb: (message: MessageModel) => void): void;
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

const SocketProvider: React.FC = () => {
  useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  const onSetup = (cb: (val: boolean) => void) => {
    socket.on("setup", cb);
  };

  const emitSetup = (user: UserModel) => {
    socket.emit("setup", user);
  };

  const onJoinChat = (chat: ChatModel) => {
    socket.emit("joinChat", chat);
  };

  const onMessage = (cb: (message: MessageModel) => void) => {
    socket.on("message", cb);
  };

  const emitMessage = (msg: MessageModel) => {
    socket.emit("message", msg);
  };

  return (
    <SocketContext.Provider
      value={{ socket, onSetup, emitSetup, onJoinChat, onMessage, emitMessage }}
    >
      <Outlet />
    </SocketContext.Provider>
  );
};

export default SocketProvider;
