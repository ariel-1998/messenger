import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../../services/messageService";
import SendIcon from "@mui/icons-material/Send";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import { useSocket } from "../../../contexts/SocketProvider";
import { updateMessages } from "../../../utils/messageMethods";
import useDebounce from "../../../hooks/useDebounce";
import { setChatLatestMessage } from "../../../utils/chatSlice";

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
  const dispatch = useDispatch();
  const { debounce } = useDebounce({ fn: event, wait: 2000 });
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessageMutation = useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: (data) => {
      setMessage("");
      updateMessages(data, queryClient, false);
      socket?.emit("message", data);
      dispatch(setChatLatestMessage(data));
    },
  });

  useEffect(() => {
    if (!selectedChat) return;
    inputRef.current?.firstChild?.focus();
  }, [selectedChat, sendMessageMutation.data]);

  const onKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && message) {
      btnRef.current?.click();
    } else {
      if (!user || !selectedChat) return;
      socket?.emit("typing", user, selectedChat._id);
    }
  };

  function event() {
    setUserTyping("");
  }

  useEffect(() => {
    const typingEvent = (userName: string) => {
      setUserTyping(userName);
      debounce();
    };
    socket?.on("typing", typingEvent);
    return () => {
      socket?.off("typing", typingEvent);
    };
  }, []);

  const sendMessage = () => {
    if (!selectedChat) return;
    sendMessageMutation.mutate({
      chatId: selectedChat?._id,
      content: message,
    });
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
          disabled={!selectedChat || sendMessageMutation.isLoading}
          ref={inputRef}
          value={message}
          onChange={onInputChange}
          type="text"
          endAdornment={
            <InputAdornment position="end">
              {sendMessageMutation.isLoading ? (
                <CircularProgress size={25} />
              ) : (
                <IconButton
                  disabled={!message}
                  ref={btnRef}
                  onClick={sendMessage}
                  edge="end"
                >
                  <SendIcon
                    sx={{
                      fill: selectedChat ? "rgba(83, 154, 208, 0.9)" : "#999",
                    }}
                  />
                </IconButton>
              )}
            </InputAdornment>
          }
          placeholder="Message..."
        />
      </FormControl>
    </Box>
  );
}

export default MessageInput;
