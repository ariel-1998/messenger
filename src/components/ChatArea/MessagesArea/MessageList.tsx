import React, { useEffect, useRef } from "react";
import { MessageModel } from "../../../models/MessageModel";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import MessageBubble from "./MessageBubble";
import { io } from "socket.io-client";

type MessageListProps = {
  messages: MessageModel[];
};

// const SOCKET_ENDPOINT = "http://localhost:3001";
// export let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const bottomRef = useRef<HTMLDivElement | null>(null);

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
  );
};
export default MessageList;
