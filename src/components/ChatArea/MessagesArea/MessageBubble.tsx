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
// type MessageBubbleProps = {
//   message: MessageModel;
//   showSenderInGroup: boolean;
// };

// const MessageBubble: React.FC<MessageBubbleProps> = ({
//   message,
//   showSenderInGroup,
// }) => {
//   const user = useSelector((state: RootState) => state.auth);
//   const { selectedChat } = useSelector((state: RootState) => state.chat);
//   const senderIsMe = user?._id === message.sender._id;
//   const alignment = senderIsMe ? "end" : "start";
//   const isGroupChat = selectedChat?.isGroupChat;

//   const shouldShowImg = !senderIsMe && isGroupChat && showSenderInGroup;
//   return (
//     <Stack
//       direction={"row"}
//       spacing={0.5}
//       justifyContent={alignment}
//       boxSizing={"border-box"}
//       width={"100%"}
//     >
//       {shouldShowImg && (
//         <Avatar
//           src={(user?.image as string) || ""}
//           sx={{ alignSelf: "start", width: 35, height: 35, flexBasis: 35 }}
//         />
//       )}
//       {isGroupChat && !senderIsMe && !showSenderInGroup && (
//         <Box
//           sx={{ alignSelf: "start", width: 35, height: 35, flexBasis: 35 }}
//         />
//       )}
//       <Stack
//         maxWidth={"80%"}
//         m={0}
//         pt={shouldShowImg ? 0 : 1}
//         className={`bubble ${alignment}`}
//       >
//         {isGroupChat && !senderIsMe && showSenderInGroup && (
//           <Typography color={"#333"} sx={{ opacity: 0.7 }}>
//             {message.sender.name}
//           </Typography>
//         )}
//         <Typography>{message.content}</Typography>
//       </Stack>
//     </Stack>
//   );
// };

// export default MessageBubble;
