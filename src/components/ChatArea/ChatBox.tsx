import React, { useEffect } from "react";
import {
  Box,
  Button,
  Divider,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProfileModal from "../ProfileArea/ProfileModal";
import { findUserInChat } from "../../utils/userMethods";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import { setSelectedChat } from "../../utils/chatSlice";
import MessagesContainer from "./MessagesArea/MessagesContainer";
import { useSocket } from "../../contexts/SocketProvider";

const ChatBox: React.FC = () => {
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();
  const onBackClick = () => {
    dispatch(setSelectedChat({ chat: null, isExist: true }));
  };

  const { socket } = useSocket();

  useEffect(() => {
    if (!selectedChat) return;
    socket.emit("joinChat", selectedChat._id);

    return () => {
      socket.emit("leaveChat", selectedChat._id);
    };
  }, [selectedChat]);

  const chatTitle = !selectedChat
    ? "Chat"
    : selectedChat.isGroupChat
    ? selectedChat.chatName
    : findUserInChat(selectedChat, user)?.name;

  return (
    <Stack
      sx={{
        pt: 2,
        px: 1,
        width: "100%",
        height: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: screanSize ? "10px" : 0,
        background: "#f4f4f4",
        boxSizing: "border-box",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          boxSizing: "border-box",
          px: 1,
        }}
      >
        {/**change it to a button the set selectedChat to null */}
        {!screanSize && (
          <Button onClick={onBackClick} sx={{ p: 1 }}>
            Back
          </Button>
        )}
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
      <MessagesContainer />
    </Stack>
  );
};

export default ChatBox;
