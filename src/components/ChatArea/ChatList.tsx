import React, { ChangeEvent, SyntheticEvent, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import {
  Avatar,
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { chatService } from "../../services/chatService";
import { Link } from "react-router-dom";
import CustomListItem from "../CustomComponents/CustomListItem";
import { useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import { ChatModel } from "../../models/ChatModel";
import { UserModel } from "../../models/UserModel";

const ChatList: React.FC = () => {
  const loggedUser = useSelector((state: RootState) => state.auth);
  const { debounce, isLoading } = useDebounce({ fn: searchChat, wait: 3000 });
  const [search, setSearch] = useState("");
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));

  const { data: chats } = useQuery({
    queryKey: ["chatList"],
    queryFn: chatService.getAllChats,
  });

  function searchChat(search: string) {
    setSearch(search);
  }

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(e.target.value);
  };

  const findUser = (chat: ChatModel): UserModel | undefined => {
    return chat.users.find((user) => user._id !== loggedUser?._id);
  };

  const filteredChats = chats?.filter((chat) => {
    if (search === "") return true; // Show all chats when the search term is empty
    // Check if the chat name or user name contains the search term
    if (chat.isGroupChat) return chat.chatName.includes(search);

    const user = findUser(chat);
    if (user) {
      const includesName = user.name.includes(search);
      const includesEmail = user.email.includes(search);
      return includesName || includesEmail;
    }
    return false;
  });

  const chatListItems = filteredChats?.map((chat) => (
    <Link
      to={
        chat.isGroupChat
          ? `/chat/group/${chat._id}`
          : `/chat/${findUser(chat)?._id}`
      }
      key={chat._id}
      style={{ color: "#333" }}
    >
      <CustomListItem
        text={chat.isGroupChat ? chat.chatName : findUser(chat)?.name || ""}
      >
        <Avatar
          src={chat.isGroupChat ? "" : (findUser(chat)?.image as string)}
        />
      </CustomListItem>
    </Link>
  ));

  return (
    <Stack
      sx={{
        p: 2,
        maxWidth: "100%",
        width: "100%",
        height: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: screanSize ? "10px" : 0,
        background: "#f4f4f4",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <Typography pb={1} variant="h6" textAlign={"center"}>
        My Chats
      </Typography>
      <CustomSearchInput
        isIcon={false}
        inputCursor="auto"
        placeholder="Search..."
        onInput={onInput}
      />
      {isLoading && <div>loading...</div>}
      <Stack p={2}>
        {chatListItems && chatListItems.length > 0 ? (
          chatListItems
        ) : (
          <div>empty</div>
        )}
      </Stack>
    </Stack>
  );
};

export default ChatList;
