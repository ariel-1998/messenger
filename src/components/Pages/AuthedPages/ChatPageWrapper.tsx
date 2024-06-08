import React, { ReactNode } from "react";
import AppBar from "../../AppBarArea/AppBar";
import { Box, Stack } from "@mui/material";

type ChatPageWrapperProps = {
  children: ReactNode;
};
const ChatPageWrapper: React.FC<ChatPageWrapperProps> = ({ children }) => {
  return (
    <Stack p={0} m={0} height={"100vh"}>
      <AppBar />
      <Box height={"calc(100dvh - 60px)"}>{children}</Box>
    </Stack>
  );
};

export default ChatPageWrapper;
