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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMessages } from "../utils/messageMethods";
import { useUnreadMessages } from "./UnreadMessagesProvider";
import { messageService } from "../services/messageService";

type SocketContextProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
};

const SocketContext = createContext<SocketContextProps | null>(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === null) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

type SocketProviderProps = {
  children: ReactNode;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { addUnreadMessage } = useUnreadMessages();
  const queryClient = useQueryClient();
  const [socketConnection, setSocketConnection] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const readByMessagesMutatin = useMutation({
    mutationFn: messageService.updateReadBy,
  });

  useEffect(() => {
    if (!user) return;
    let socket = io("http://localhost:3001");
    setSocketConnection(socket);
    socket.connect();
    socket.emit("setup", user._id);
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    const event = (data: MessageModel) => {
      if (selectedChat?._id === data.chat._id) {
        readByMessagesMutatin.mutate({
          chatId: selectedChat._id,
          messages: [data._id],
        });
      } else {
        addUnreadMessage(data);
      }
      updateMessages(data, queryClient, true);
    };

    socketConnection?.on("message", event);
    return () => {
      socketConnection?.off("message", event);
    };
  }, [selectedChat, socketConnection]);

  return (
    <SocketContext.Provider value={{ socket: socketConnection }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
