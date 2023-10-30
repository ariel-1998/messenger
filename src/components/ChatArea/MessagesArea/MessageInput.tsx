import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../../services/messageService";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { useSocket } from "../../../contexts/SocketProvider";
import { updateMessages } from "../../../utils/messageMethods";
import { UserModel } from "../../../models/UserModel";
import useDebounce from "../../../hooks/useDebounce";

type inputRef = {
  firstChild: HTMLInputElement;
} & HTMLDivElement;
function MessageInput(): JSX.Element {
  const [message, setMessage] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<inputRef>(null);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth);
  const [userTyping, setUserTyping] = useState("");
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const { debounce } = useDebounce({ fn: event, wait: 2000 });
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessageMutation = useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: (data) => {
      socket.emit("message", data);
      updateMessages(data, queryClient, false);
    },
  });

  useEffect(() => {
    if (!selectedChat) return;
    inputRef.current?.firstChild?.focus();
  }, [selectedChat]);

  const onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && message) {
      btnRef.current?.click();
    } else {
      if (!user || !selectedChat) return;
      socket.emit("typing", user, selectedChat._id);
    }
  };

  function event() {
    console.log("typing");
    setUserTyping("");
  }

  useEffect(() => {
    const typingEvent = (userName: string) => {
      setUserTyping(userName);
      debounce();
    };
    socket.on("typing", typingEvent);
    return () => {
      socket.off("typing", typingEvent);
    };
  }, []);

  const sendMessage = () => {
    if (!selectedChat) return;
    sendMessageMutation.mutate({
      chatId: selectedChat?._id,
      content: message,
    });
    setMessage("");
  };

  return (
    <Box
      sx={{
        p: 0,
        m: 0,
        pt: "10px",
        height: "100%",
        position: "relative",
        boxSizing: "border-box",
        flexShrink: 0,
      }}
    >
      {userTyping && (
        <Box
          bgcolor={"transparent"}
          position={"absolute"}
          top={"-10px"}
          left={0}
        >{`${userTyping} is typing...`}</Box>
      )}
      <FormControl
        onKeyDown={onKeyPress}
        sx={{ height: "100%" }}
        fullWidth
        size="small"
        variant="outlined"
      >
        <OutlinedInput
          disabled={!selectedChat}
          ref={inputRef}
          value={message}
          onChange={onInputChange}
          type="text"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                disabled={!message}
                ref={btnRef}
                onClick={sendMessage}
                edge="end"
              >
                <SendIcon />
              </IconButton>
            </InputAdornment>
          }
          placeholder="Message..."
        />
      </FormControl>
    </Box>
  );
}

export default MessageInput;
