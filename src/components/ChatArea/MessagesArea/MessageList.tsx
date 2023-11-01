import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import MessageBubble from "./MessageBubble";
import { useMutation, useQuery } from "@tanstack/react-query";
import { messageService } from "../../../services/messageService";
import { toastifyService } from "../../../services/toastifyService";
import { useUnreadMessages } from "../../../contexts/UnreadMessagesProvider";
import { Box, Typography } from "@mui/material";

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
  });

  useEffect(() => {
    if (!selectedChat) return;
    const readMessages = unreadMessages[selectedChat._id];
    if (!readMessages) return;
    const messageIds = readMessages.map((msg) => msg._id);
    readByMessagesMutatin.mutate({
      chatId: selectedChat._id,
      messages: messageIds,
    });
  }, [unreadAmount, selectedChat]);

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

  return (
    <Box position={"relative"} width={"100%"} height={"100%"}>
      {!messages?.length && (
        <Typography
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 20,
            color: "#ccc",
          }}
        >
          Nothing here!
        </Typography>
      )}

      {!!messages?.length && (
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
      )}
    </Box>
  );
};
export default MessageList;
