import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Link, useParams } from "react-router-dom";
import { chatService } from "../../services/chatService";
import { Box, Button, useMediaQuery, useTheme } from "@mui/material";

const ChatBox: React.FC = () => {
  const theme = useTheme();
  const screanSize = useMediaQuery(theme.breakpoints.up("md"));
  const { userId } = useParams();

  const { data } = useQuery({
    queryKey: ["chatBox", `{chat: ${userId}}`],
    queryFn: () => chatService.accessChat(userId || ""),
    onSuccess: console.log,
    enabled: Boolean(userId),
  });

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
      {!screanSize && (
        <Link to={"/chat"}>
          <Button>Back</Button>
        </Link>
      )}
    </Box>
  );
};

export default ChatBox;
