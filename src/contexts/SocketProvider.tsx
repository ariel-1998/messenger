import React, {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { MessageModel } from "../models/MessageModel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMessages, updateMessagesReadBy } from "../utils/messageMethods";
import { messageService } from "../services/messageService";
import { ChatModel } from "../models/ChatModel";
import {
  deleteGroup,
  onAddedToGroup,
  onRemoveFromGroup,
  setChatLatestMessage,
} from "../utils/chatSlice";
import { UserModel } from "../models/UserModel";
import useUnreadMessages from "../hooks/useUnreadMessages";

type SocketContextProps = {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
};

export const SocketContext = createContext<SocketContextProps | null>(null);

type SocketProviderProps = {
  children: ReactNode;
};

const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const { addUnreadMessage, removeUnreadMessages } = useUnreadMessages();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const [socketConnection, setSocketConnection] = useState<Socket<
    DefaultEventsMap,
    DefaultEventsMap
  > | null>(null);

  const { mutate: readByMutate } = useMutation({
    mutationFn: messageService.updateReadBy,
    onSuccess: (chat) => {
      socketConnection?.emit("readMessage", chat, user?._id);
    },
  });

  const messageEvent = useCallback(
    (data: MessageModel) => {
      if (selectedChat?._id === data.chat._id) {
        readByMutate({
          chatId: selectedChat._id,
          messages: [data._id!],
        });
      } else {
        addUnreadMessage(data);
      }
      dispatch(setChatLatestMessage(data));
      updateMessages(data, queryClient, true);
    },
    [selectedChat, readByMutate, addUnreadMessage, dispatch, queryClient]
  );

  const readByEvent = useCallback(
    (chat: ChatModel, userId: string) => {
      updateMessagesReadBy(chat, userId, queryClient);
    },
    [queryClient]
  );

  const onAddedToGroupEvent = useCallback(
    (groupChat: ChatModel) => {
      dispatch(onAddedToGroup(groupChat));
    },
    [dispatch]
  );

  const onRemovingFromGroupEvent = useCallback(
    (groupChat: ChatModel, userToRemove: UserModel) => {
      dispatch(
        onRemoveFromGroup({
          chat: groupChat,
          isRemoved: userToRemove._id === user?._id,
        })
      );
      if (userToRemove._id === user?._id) {
        removeUnreadMessages(groupChat._id);
      }
    },
    [dispatch, removeUnreadMessages, user]
  );

  const onDeletingGroupEvent = useCallback(
    (chatId: string) => {
      dispatch(deleteGroup(chatId));
      removeUnreadMessages(chatId);
    },
    [dispatch, removeUnreadMessages]
  );

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_SERVER_BASE_URL);
    setSocketConnection(socket);
    socket.connect();
    socket.emit("setup", user._id);
    return () => {
      socket.disconnect();
    };
  }, [user]);

  useEffect(() => {
    if (!socketConnection) return;
    socketConnection.on("readMessage", readByEvent);
    socketConnection.on("addedToGroup", onAddedToGroupEvent);
    socketConnection.on("removingFromGroup", onRemovingFromGroupEvent);
    socketConnection.on("deletingGroup", onDeletingGroupEvent);
    return () => {
      socketConnection.off("readMessage", readByEvent);
      socketConnection.off("addedToGroup", onAddedToGroupEvent);
      socketConnection.off("removingFromGroup", onRemovingFromGroupEvent);
      socketConnection.off("deletingGroup", onDeletingGroupEvent);
    };
  }, [
    socketConnection,
    readByEvent,
    onAddedToGroupEvent,
    onRemovingFromGroupEvent,
    onDeletingGroupEvent,
  ]);

  useEffect(() => {
    socketConnection?.on("message", messageEvent);
    return () => {
      socketConnection?.off("message", messageEvent);
    };
  }, [messageEvent, selectedChat, socketConnection]);

  return (
    <SocketContext.Provider value={{ socket: socketConnection }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
