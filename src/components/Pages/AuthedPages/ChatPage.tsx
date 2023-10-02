import React from "react";
import AppBar from "../../AppBarArea/AppBar";
import ChatList from "../../ChatArea/ChatList";
import ChatBox from "../../ChatArea/ChatBox";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";

const ChatPage: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <>
      {matches ? (
        <Grid container height={"100%"} p={2} justifyContent="space-around">
          <Grid sm={5} md={3} item bgcolor={"yellow"} height={"100%"}>
            <ChatList />
          </Grid>
          <Grid sm={6} md={8} item bgcolor={"green"} height={"100%"}>
            <ChatBox />
          </Grid>
        </Grid>
      ) : (
        <>
          <ChatList />
          <ChatBox />
        </>
      )}
    </>
  );
};

export default ChatPage;
