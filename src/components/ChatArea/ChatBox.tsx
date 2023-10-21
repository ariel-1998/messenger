import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Box, Button, Divider, useMediaQuery, useTheme } from "@mui/material";
import ProfileModal from "../ProfileArea/ProfileModal";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "../../services/chatService";
import { findUserInChat } from "../../utils/userMethods";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import { ChatModel } from "../../models/ChatModel";
import { findChatIndexById } from "../../utils/chatMetods";

const ChatBox: React.FC = () => {
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  // const { data: chat } = useQuery({
  //   queryKey: ["chatList", `{chat: ${id}}`],
  //   queryFn: () => {
  //     if (!isGroupChat) return chatService.accessChat(id as string);
  //     return chatService.accessGroupChat(id as string);
  //   },
  //   onSuccess: onChatQuerySuccess,
  //   enabled: !!id,
  // });

  // function onChatQuerySuccess(data: ChatModel) {
  //   queryClient.setQueryData<ChatModel[] | undefined>(
  //     ["chatList"],
  //     (oldData) => {
  //       if (!oldData) return [data];
  //       const index = oldData.findIndex((item) => item._id === data._id);
  //       if (index !== -1) return oldData;
  //       const filteredData = oldData.filter((chat) => chat._id !== data._id);
  //       return [data, ...filteredData];
  //     }
  //   );
  // }

  const chatTitle = !selectedChat
    ? "Chat"
    : selectedChat.isGroupChat
    ? selectedChat.chatName
    : findUserInChat(selectedChat, user)?.name;

  return (
    <Box
      p={3}
      sx={{
        width: "100%",
        height: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: screanSize ? "10px" : 0,
        background: "#f4f4f4",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/**change it to a button the set selectedChat to null */}
        {/* {!screanSize && (
          <Link to={"/chat"}>
            <Button sx={{ p: 1 }}>Back</Button>
          </Link>
        )} */}
        {selectedChat &&
          ((selectedChat.isGroupChat && (
            <ProfileModal.Group btnText="View profile" />
          )) ||
            (!selectedChat.isGroupChat && (
              <ProfileModal.User
                btnText="View profile"
                profile={findUserInChat(selectedChat, user)!}
                isBtn={true}
              />
            )))}
      </Box>
      <Divider textAlign="center">{chatTitle}</Divider>
      <Box></Box>
    </Box>
  );
};

export default ChatBox;
