import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import MessageBubble from "./MessageBubble";
import { useMutation, useQuery } from "@tanstack/react-query";
import { messageService } from "../../../services/messageService";
import { toastifyService } from "../../../services/toastifyService";
import { useUnreadMessages } from "../../../contexts/UnreadMessagesProvider";

const MessageList: React.FC = () => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { removeUnreadMessages, unreadMessages, unreadAmount } =
    useUnreadMessages();

  const readByMessagesMutatin = useMutation({
    mutationFn: messageService.updateReadBy,
    onSuccess: () => {
      if (selectedChat) removeUnreadMessages(selectedChat._id);
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["messages", `{chatId: ${selectedChat?._id}}`],
    queryFn: () => messageService.getMessagesByChatId(selectedChat?._id!),
    enabled: !!selectedChat?._id,
    onError: (err) => toastifyService.error(err),
    // onSuccess: (data) => {
    // if (!selectedChat) return;
    // const readMessages = unreadMessages[selectedChat._id];
    // if (!readMessages) return;
    // const messageIds = readMessages.map((msg) => msg._id);
    // readByMessagesMutatin.mutate({
    //   chatId: selectedChat._id,
    //   messages: messageIds,
    // });
    // },
  });

  useEffect(() => {
    console.log("first");
    if (!selectedChat) return;
    const readMessages = unreadMessages[selectedChat._id];
    if (!readMessages) return;
    const messageIds = readMessages.map((msg) => msg._id);
    readByMessagesMutatin.mutate({
      chatId: selectedChat._id,
      messages: messageIds,
    });
  }, [unreadAmount]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "instant",
    });
  }, [selectedChat]);

  // function onMessagesQuerySuccess(data: MessageModel[]) {
  //   if (!user?._id || !selectedChat?._id) return;
  //   const notReadMessages = filterUnreadMessages(data, user._id);
  //   if (!notReadMessages.length) return;
  //   readByMessagesMutatin.mutate({
  //     messages: notReadMessages,
  //     chatId: selectedChat._id,
  //   });
  // }

  return messages ? (
    <>
      {messages.map((msg, i) => (
        <MessageBubble
          messages={messages}
          index={i}
          message={msg}
          key={msg._id}
        />
      ))}
      <div ref={bottomRef}></div>
    </>
  ) : null;
};
export default MessageList;
