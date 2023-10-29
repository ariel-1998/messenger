import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageModel } from "../models/MessageModel";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import { toastifyService } from "../services/toastifyService";
import { useQueryClient } from "@tanstack/react-query";
import { updateMessages } from "../utils/messageMethods";
import { useUnreadMessages } from "./UnreadMessagesProvider";

type SocketContextProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
  emitMessage: (msg: MessageModel) => void;
  emitJoinChat: (chatId: string) => void;
  emitLeavingChat: (chatId: string) => void;
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
  const [chatRoom, setChatRoom] = useState<null | string>(null);
  const { addUnreadMessage } = useUnreadMessages();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;
    socket.connect();
    emitSetup(user._id);
    setupEvent("on");
    leavingChat("on");
    joinChat("on");
    onMessage("on");
    return () => {
      setupEvent("off");
      leavingChat("off");
      joinChat("off");
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

  const joinChat = (event: "on" | "off") => {
    console.log(event);
    socket[event]("joinChat", (chatId) => setChatRoom(chatId));
  };

  const leavingChat = (event: "on" | "off") => {
    socket[event]("leaveChat", (chatId) => setChatRoom(chatId));
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
      console.log(data.chat._id, chatRoom);
      if (chatRoom != data.chat._id) addUnreadMessage(data);
      updateMessages(data, queryClient, true);
    });
  }

  return (
    <SocketContext.Provider
      value={{ socket, emitMessage, emitLeavingChat, emitJoinChat }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
