import React from "react";
import CustomSearchInput from "../CustomComponents/CustomSearchInput";
import { Box, Stack, Typography } from "@mui/material";

const ChatList: React.FC = () => {
  const searchChat = () => undefined;
  return (
    <Stack width={"90%"} justifyContent={"center"} p={2}>
      <Typography pb={1} variant="h6" textAlign={"center"}>
        Chat History
      </Typography>
      <CustomSearchInput
        isIcon={false}
        inputCursor="auto"
        placeholder="Search..."
        id="chat-search"
        onInput={searchChat}
      />
      <Stack p={2}>user chats</Stack>
    </Stack>
  );
};

export default ChatList;
