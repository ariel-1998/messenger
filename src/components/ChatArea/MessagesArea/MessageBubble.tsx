import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import { RootState } from "../../../utils/reduxStore";
import { useSelector } from "react-redux";
import { MessageModel } from "../../../models/MessageModel";

type MessageBubbleProps = {
  message: MessageModel;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const loggedIsSender = user?._id === message.sender._id;
  const alignment = loggedIsSender ? "end" : "start";
  const isGroupChat = selectedChat?.isGroupChat;
  return (
    <Stack
      width={"80%"}
      spacing={1}
      direction={alignment ? "row-reverse" : "row"}
      alignSelf={alignment}
    >
      {!loggedIsSender && isGroupChat && (
        <Avatar
          src={(user?.image as string) || ""}
          sx={{ alignSelf: "start", width: 35, height: 35 }}
        />
      )}
      <Stack
        m={0}
        pt={isGroupChat && !loggedIsSender ? 0 : 1}
        className={`bubble ${alignment}`}
      >
        {isGroupChat && !loggedIsSender && (
          <Typography color={"#333"} sx={{ opacity: 0.7 }}>
            {message.sender.name}
          </Typography>
        )}
        <Typography>{message.content}</Typography>
      </Stack>
    </Stack>
  );
};

export default MessageBubble;
