import React, { ChangeEvent, useState } from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import {
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
import { Info, Search as SearchIcon } from "@mui/icons-material";
import useUnreadMessages from "../../hooks/useUnreadMessages";

const ChatList: React.FC = () => {
  const theme = useTheme();
  const mdScreen = useMediaQuery(theme.breakpoints.up("md"));
  const lgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const [search, setSearch] = useState("");

  const { debounce, isLoading: debounceLoad } = useDebounce({
    fn: searchChat,
    wait: 300,
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
        background: "#E5E5E5",
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
        <Typography variant="h6" fontWeight={"bold"}>
          Chats
        </Typography>
        <GroupForm.Create />
      </Stack>
      <Box position={"relative"}>
        <CustomSearchInput
          isIcon={false}
          placeholder="Search Chats..."
          onChange={onInput}
          style={{
            width: "100%",
            marginBottom: "10px",
            paddingRight: "55px",
          }}
        />
        <Stack
          direction={"row"}
          justifyContent={"space-around"}
          gap={1}
          sx={{ position: "absolute", top: 8, right: 20, width: 30 }}
        >
          <Divider
            orientation="vertical"
            flexItem
            sx={{ justifySelf: "start" }}
          />
          <Box width={20}>
            {!debounceLoad ? (
              <SearchIcon sx={{ fill: "#999" }} />
            ) : (
              <CircularProgress size={20} />
            )}
          </Box>
        </Stack>
      </Box>
      <ChatListItems search={search} />
    </Stack>
  );
};

export default ChatList;

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
                bgcolor:
                  selectedChat?._id !== chat._id ? "#f0f0f0" : "#0B4F6C88",
                transition: "background-color 400ms ease",
              }}
              chat={chat}
              key={chat._id}
              onClick={() => onUserClick(chat)}
            />
          ))}
        </>
      )}

      {!fetchingChats && !filteredChats.length && !!search && (
        <Info
          color="warning"
          sx={{
            width: 40,
            height: 40,
            alignSelf: "center",
          }}
        />
      )}
    </Stack>
  );
}
