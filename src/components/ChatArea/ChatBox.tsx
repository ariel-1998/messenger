import React, {
  ChangeEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ProfileModal from "../ProfileArea/ProfileModal";
import { findUserInChat } from "../../utils/userMethods";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import { MessageModel } from "../../models/MessageModel";
import { setSelectedChat } from "../../utils/chatSlice";
import { ChatModel } from "../../models/ChatModel";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../services/messageService";
import MessagesContainer from "./MessagesArea/MessagesContainer";

const ChatBox: React.FC = () => {
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));
  const user = useSelector((state: RootState) => state.auth);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const onBackClick = () => {
    dispatch(setSelectedChat({ chat: null, isExist: true }));
  };
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
