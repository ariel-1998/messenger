import React from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Box, Button, Divider, useMediaQuery, useTheme } from "@mui/material";
import ProfileModal from "../ProfileArea/ProfileModal";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "../../services/chatService";
import { findUserInChat } from "../../utils/userMethods";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";

const ChatBox: React.FC = () => {
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));
  const user = useSelector((state: RootState) => state.auth);
  const { chatId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isGroupChat = queryParams.get("isGroupChat");

  const { data: chat } = useQuery({
    queryKey: ["chatList", `{chat: ${chatId}}`],
    queryFn: () => chatService.accessGroupChat(chatId as string),
    enabled: !!chatId && Boolean(isGroupChat),
  });

  const chatTitle = !chat
    ? "Chat"
    : chat.isGroupChat
    ? chat.chatName
    : findUserInChat(chat, user)?.name;

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
        {!screanSize && (
          <Link to={"/chat"}>
            <Button sx={{ p: 1 }}>Back</Button>
          </Link>
        )}
        {chat && isGroupChat && (
          <ProfileModal.Group profile={chat}>
            <Button sx={{ p: 1 }}>View profile</Button>
          </ProfileModal.Group>
        )}
        {chat && !isGroupChat && (
          <ProfileModal.User profile={findUserInChat(chat, user)}>
            <Button sx={{ p: 1 }}>View profile</Button>
          </ProfileModal.User>
        )}
      </Box>
      <Divider textAlign="center">{chatTitle}</Divider>
      <Box></Box>
    </Box>
  );
};

export default ChatBox;
