import ChatList from "../../ChatArea/ChatList";
import ChatBox from "../../ChatArea/ChatBox";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import React from "react";

const ChatSection: React.FC = () => {
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("md"));
  const { selectedChat } = useSelector((state: RootState) => state.chat);
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
        <>{selectedChat ? <ChatBox /> : <ChatList />}</>
      )}
    </>
  );
};

export default ChatSection;
