import React, { ChangeEvent, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import { Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import { findUserInChat } from "../../utils/userMethods";
import GroupForm from "./GroupForms/Forms/GroupForm";
import { ChatModel } from "../../models/ChatModel";
import { setSelectedChat } from "../../utils/chatSlice";
import ListItems from "./GroupForms/ListItems";

const ChatList: React.FC = () => {
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));
  const [search, setSearch] = useState("");

  const { debounce, isLoading: debounceLoad } = useDebounce({
    fn: searchChat,
    wait: 500,
  });

  function searchChat(search: string) {
    setSearch(search);
  }

  const onInput = (e: ChangeEvent<HTMLInputElement>) => {
    debounce(e.target.value);
  };

  return (
    <Stack
      sx={{
        p: 2,
        width: "100%",
        height: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: screanSize ? "10px" : 0,
        background: "#f4f4f4",
        boxSizing: "border-box",
        overflow: "auto",
      }}
    >
      <Stack
        pb={1}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <Typography variant="h6">Chats</Typography>
        <GroupForm.Create />
      </Stack>
      <Stack alignItems={"center"}>
        <CustomSearchInput
          isIcon={false}
          inputCursor="auto"
          placeholder="Search..."
          onInput={onInput}
        />
      </Stack>
      {debounceLoad && (
        <Typography textAlign={"center"} variant="body2">
          Loading...
        </Typography>
      )}
      <Stack p={2} spacing={0.1}>
        <ChatListItems search={search} />
      </Stack>
    </Stack>
  );
};

export default ChatList;

//filtered chatList
type ChatListItemsProps = {
  search: string;
};

function ChatListItems({ search }: ChatListItemsProps): JSX.Element {
  const loggedUser = useSelector((state: RootState) => state.auth);
  const { chats: chatList } = useSelector((state: RootState) => state.chat);
  const dispatch = useDispatch();

  const chats = chatList || [];
  const onUserClick = (chat: ChatModel) => {
    dispatch(setSelectedChat({ chat, isExist: true }));
  };

  const filteredChats = chats?.filter((chat) => {
    if (search === "") return true;
    if (chat.isGroupChat) return chat.chatName.includes(search);
    const user = findUserInChat(chat, loggedUser);
    if (user) {
      const includesName = user.name.includes(search);
      const includesEmail = user.email.includes(search);
      return includesName || includesEmail;
    }
    return false;
  });

  const content = filteredChats ? (
    <>
      {filteredChats.map((chat) => (
        <ListItems.Chat
          chat={chat}
          key={chat._id}
          onClick={() => onUserClick(chat)}
        />
      ))}
    </>
  ) : (
    <Typography textAlign={"center"}>Empty!</Typography>
  );
  return content;
}
