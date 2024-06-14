import React, { Fragment, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import MessageBubble from "./MessageBubble";
import { useMutation, useQuery } from "@tanstack/react-query";
import { messageService } from "../../../services/messageService";
import { toastifyService } from "../../../services/toastifyService";
import { Stack, Typography } from "@mui/material";
import LoadingSkeletons, {
  SkeletonMessage,
} from "../../CustomComponents/LoadingSkeletons";
import useUnreadMessages from "../../../hooks/useUnreadMessages";
import useSocket from "../../../hooks/useSocket";
import moment, { Moment } from "moment";

const MessageList: React.FC = () => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { removeUnreadMessages, unreadMessages } = useUnreadMessages();
  const { socket } = useSocket();
  const user = useSelector((state: RootState) => state.auth);
  const renderRef = useRef(true);
  const { mutate } = useMutation({
    mutationFn: messageService.updateReadBy,
    onSuccess: (chat) => {
      socket?.emit("readMessage", chat, user?._id);
      removeUnreadMessages(chat._id);
    },
  });

  const { data: messages } = useQuery({
    queryKey: ["messages", `{chatId: ${selectedChat?._id}}`],
    queryFn: () => messageService.getMessagesByChatId(selectedChat!._id!),
    enabled: !!selectedChat?._id,
    onError: (err) => toastifyService.error(err),
  });

  useEffect(() => {
    // renderRef.current = true;
    if (!selectedChat) return;
    const readMessages = unreadMessages[selectedChat._id];
    if (!readMessages) return;
    // const messageIds = readMessages.map((msg) => msg._id!);
    mutate({
      chatId: selectedChat._id,
      // messages: messageIds,
    });
  }, [selectedChat, mutate, unreadMessages]);
  // }, [selectedChat,mutate]);

  useEffect(() => {
    if (!messages) return;
    const isFirstRendr = renderRef.current;
    bottomRef.current?.scrollIntoView({
      behavior: isFirstRendr ? "instant" : "smooth",
    });
    // renderRef.current = false;
  }, [messages]);

  return (
    <Stack
      flexGrow={1}
      width={"100%"}
      position={"relative"}
      sx={{
        overflowY: messages ? "auto" : "hidden",
        whiteSpace: "normal",
        height: "100%",
      }}
    >
      {messages && !messages.length && (
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
      {selectedChat && !messages && (
        <LoadingSkeletons amount={12}>
          <SkeletonMessage isGroupChat={selectedChat.isGroupChat} />
        </LoadingSkeletons>
      )}
      {!!messages?.length && (
        <>
          {messages.map((msg, i) => {
            const date = getLocalTime(msg.createdAt);
            const show = shouldShowDateBlock(
              msg.createdAt,
              messages[i - 1]?.createdAt
            );
            return (
              <Fragment key={i}>
                {show && <MessageDateBlock date={date} />}
                <MessageBubble
                  messages={messages}
                  index={i}
                  message={msg}
                  date={date}
                />
              </Fragment>
            );
          })}
          <div ref={bottomRef}></div>
        </>
      )}
    </Stack>
  );
};
export default MessageList;

function shouldShowDateBlock(
  currentMessageDate: Date,
  prevMessageDate: Date | undefined
) {
  const prev = moment(prevMessageDate).startOf("day");
  const current = moment(currentMessageDate).startOf("day");
  return current.isAfter(prev);
}

const MessageDateBlock = ({ date }: { date: Moment }) => {
  return (
    // <Stack
    //   alignItems="center"
    //   justifyContent="center"
    //   position={"sticky"}
    //   top={0}
    //   m={"auto"}
    //   sx={{
    //     backgroundColor: "#f0f0f0",
    //     color: "#555",
    //     width: "50%",
    //     py: 0.5,
    //     px: 1,
    //     borderRadius: "4px",
    //     mt: "4px",
    //   }}
    // >
    //   <Typography variant="caption">{date.format("MMM D, YYYY")}</Typography>
    // </Stack>
    <Stack
      alignItems="center"
      justifyContent="center"
      m={"auto"}
      sx={{
        backgroundColor: "#f0f0f0",
        color: "#555",
        width: "50%",
        py: 0.5,
        px: 1,
        borderRadius: "4px",
        mt: "4px",
      }}
    >
      <Typography variant="caption">{date.format("MMM D, YYYY")}</Typography>
    </Stack>
  );
};

function getLocalTime(timeStamp: Date) {
  const localTime = moment.utc(timeStamp).local();
  return localTime;
}
