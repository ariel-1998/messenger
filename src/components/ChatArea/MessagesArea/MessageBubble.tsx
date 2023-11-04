import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { RootState } from "../../../utils/reduxStore";
import { useSelector } from "react-redux";
import { MessageModel } from "../../../models/MessageModel";
import {
  messageMarginTop,
  shouldMakeMarginLeftToMsg,
  showSenderDetails,
} from "../../../utils/messageMethods";
import { DoneAll } from "@mui/icons-material";

export type MessageBubbleProps = {
  message: MessageModel;
  messages: MessageModel[];
  index: number;
};

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  messages,
  index,
}) => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth);
  const isGroupChat = selectedChat?.isGroupChat;
  const senderIsMe = user?._id === message.sender._id;
  const alignMessage = senderIsMe ? "end" : "start";
  const date = new Date(message.frontendTimeStamp);
  const createdAt = date.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // Use 24-hour format
  });

  const marginTop = messageMarginTop(messages, message, index);
  const senderDetails = showSenderDetails(
    isGroupChat,
    index,
    messages,
    message,
    senderIsMe
  );
  const marginMessage = shouldMakeMarginLeftToMsg(
    isGroupChat,
    index,
    messages,
    message,
    senderIsMe
  );

  return (
    <Stack
      mt={marginTop}
      spacing={0.5}
      direction={"row"}
      justifyContent={alignMessage}
      boxSizing={"border-box"}
      width={"100%"}
    >
      {senderDetails && !marginMessage && (
        <Avatar
          src={(message.sender.image as string) || ""}
          sx={{ width: 35, height: 35, flexBasis: 35 }}
        />
      )}

      {marginMessage && <Box sx={{ width: 35, height: 35, flexBasis: 35 }} />}
      <Stack
        maxWidth={"75%"}
        m={0}
        pt={senderDetails ? 0 : 1}
        className={`bubble ${alignMessage}`}
      >
        {senderDetails && (
          <Typography fontSize={"0.9rem"} color={"#333"} sx={{ opacity: 0.7 }}>
            {message.sender.name}
          </Typography>
        )}
        <Typography fontWeight={"bold"}>{message.content}</Typography>
        <Stack direction={"row"} spacing={0.5} pt={0.7}>
          {senderIsMe && !isGroupChat && (
            <Typography fontSize={10}>
              <DoneAll
                sx={{
                  fontSize: 15,
                  fill: !!message.readBy.length ? "#3498db" : "#999",
                }}
              />
            </Typography>
          )}
          <Typography fontSize={10}>{createdAt}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MessageBubble;
