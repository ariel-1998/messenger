import React, { ChangeEvent, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useDebounce from "../../hooks/useDebounce";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../utils/reduxStore";
import { findUserInChat } from "../../utils/userMethods";
import GroupForm from "./GroupForms/Forms/GroupForm";
import { ChatModel } from "../../models/ChatModel";
import { setSelectedChat } from "../../utils/chatSlice";
import ListItems from "./GroupForms/ListItems";
import LoadingSkeletons, {
  SkeletonUser,
} from "../CustomComponents/LoadingSkeletons";
import { useUnreadMessages } from "../../contexts/UnreadMessagesProvider";

const ChatList: React.FC = () => {
  const theme = useTheme();
  const mdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const lgScreen = useMediaQuery(theme.breakpoints.up("lg"));
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
        p: lgScreen ? 1.5 : 1,
        width: "100%",
        height: "100%",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        borderRadius: mdScreen ? "10px" : 0,
        background: "#f4f4f4",
        boxSizing: "border-box",
      }}
    >
      <Stack
        pb={1.5}
        direction={"row"}
        boxSizing={"border-box"}
        alignItems={"center"}
        justifyContent={"space-around"}
      >
        <Typography variant="h6">Chats</Typography>
        <GroupForm.Create />
      </Stack>
      <Box>
        <CustomSearchInput
          isIcon={false}
          placeholder="Search..."
          onChange={onInput}
          style={{ width: "100%", marginBottom: "10px" }}
        />
      </Box>
      {/* <TextField fullWidth label="fullWidth" id="fullWidth" /> */}
      {debounceLoad && (
        <Typography textAlign={"center"} variant="body2">
          Loading...
        </Typography>
      )}
      <ChatListItems search={search} />
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
  const { chats: chatList, selectedChat } = useSelector(
    (state: RootState) => state.chat
  );
  const dispatch = useDispatch();

  const { fetchingChats } = useUnreadMessages();
  const onUserClick = (chat: ChatModel) => {
    dispatch(setSelectedChat({ chat, isExist: true }));
  };

  const stringToLowerCase = (string: string) => string.toLowerCase();

  const chats = chatList ? chatList : [];

  const filteredChats = chats?.filter((chat) => {
    const lowerCaseSeearch = stringToLowerCase(search);
    if (lowerCaseSeearch === "") return true;
    if (chat.isGroupChat) {
      return stringToLowerCase(chat.chatName).includes(lowerCaseSeearch);
    }
    const user = findUserInChat(chat, loggedUser);
    if (!user) return false;
    const includesName = stringToLowerCase(user.name).includes(
      lowerCaseSeearch
    );
    const includesEmail = stringToLowerCase(user.email).includes(
      lowerCaseSeearch
    );
    return includesName || includesEmail;
  });
  return (
    <Stack spacing={0.1} pt={1} overflow={fetchingChats ? "hidden" : "auto"}>
      {fetchingChats && (
        <Stack spacing={1}>
          <LoadingSkeletons amount={10}>
            <SkeletonUser />
          </LoadingSkeletons>
        </Stack>
      )}
      {!!filteredChats && !!filteredChats.length && (
        <>
          {filteredChats.map((chat) => (
            <ListItems.Chat
              sx={{
                bgcolor: selectedChat?._id !== chat._id ? "#ddd" : "#bbdefb",
                transition: "background-color 900ms ease",
              }}
              chat={chat}
              key={chat._id}
              onClick={() => onUserClick(chat)}
            />
          ))}
        </>
      )}

      {!fetchingChats && !filteredChats.length && (
        <Typography>Empty!</Typography>
      )}
    </Stack>
  );
}
