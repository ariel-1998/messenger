import React, { useState } from "react";
import AppBar from "../../AppBarArea/AppBar";
import ChatList from "../../ChatArea/ChatList";
import ChatBox from "../../ChatArea/ChatBox";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useParams } from "react-router-dom";

const ChatPage: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const { id } = useParams();
  return (
    <>
      {matches ? (
        <Grid
          container
          height={"100%"}
          width={"100%"}
          p={2}
          justifyContent="space-around"
        >
          <Grid md={4} item height={"100%"}>
            <ChatList />
          </Grid>
          <Grid md={7} item height={"100%"}>
            <ChatBox />
          </Grid>
        </Grid>
      ) : (
        <>{id ? <ChatBox /> : <ChatList />}</>
      )}
    </>
  );
};

export default ChatPage;
