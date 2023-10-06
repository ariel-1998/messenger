import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { chatService } from "../../services/chatService";
import { Box, Button, Divider, useMediaQuery, useTheme } from "@mui/material";
import ProfileModal from "../ProfileArea/ProfileModal";

const ChatBox: React.FC = () => {
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));
  const { chatId } = useParams();

  // useQuery({});

  return (
    <Box
      p={3}
      sx={{
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
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {!screanSize && (
          <Link to={"/chat"}>
            <Button sx={{ p: 1 }}>Back</Button>
          </Link>
        )}
        <ProfileModal user={null}>
          <Button sx={{ p: 1 }}>View profile</Button>
        </ProfileModal>
      </Box>
      <Divider textAlign="center">Chat</Divider>
      <Box></Box>
    </Box>
  );
};

export default ChatBox;
