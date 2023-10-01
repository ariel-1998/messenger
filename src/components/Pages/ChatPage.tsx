import React from "react";
import SideDrawer from "../AppBarArea/SideDrawer";
import ChatList from "../ChatArea/ChatList";
import ChatBox from "../ChatArea/ChatBox";
import { Box } from "@mui/material";

const ChatPage: React.FC = () => {
  return (
    <div>
      <SideDrawer />
      <Box
        sx={{
          display: "flex",
        }}
      >
        <ChatList />
        <ChatBox />
      </Box>
    </div>
  );
};

export default ChatPage;
