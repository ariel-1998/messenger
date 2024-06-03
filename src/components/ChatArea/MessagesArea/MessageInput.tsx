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
import {
  revertMessageOnError,
  updateMessages,
} from "../../../utils/messageMethods";
import useDebounce from "../../../hooks/useDebounce";
import { MessageModel } from "../../../models/MessageModel";
import { UserModel } from "../../../models/UserModel";
import { toastifyService } from "../../../services/toastifyService";
import useSocket from "../../../hooks/useSocket";

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
    onMutate({ content, frontendTimeStamp }) {
      setMessage("");
      const newMessage: MessageModel = {
        chat: selectedChat!,
        content,
        sender: user as UserModel,
        readBy: [],
        frontendTimeStamp,
      };
      updateMessages(newMessage, queryClient, false);
    },
    onSuccess: (data) => {
      socket?.emit("message", data);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError(err: any, { chatId, frontendTimeStamp }) {
      toastifyService.error(err);
      if (!user) return;
      revertMessageOnError(
        { chatId, frontendTimeStamp, sender: user },
        queryClient
      );
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
  }, [debounce, socket]);

  const sendMessage = () => {
    if (!selectedChat) return;
    const frontendTimeStamp = new Date();
    sendMessageMutation.mutate({
      chatId: selectedChat._id,
      content: message,
      frontendTimeStamp,
    });
    inputRef.current?.firstChild?.focus();
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
                <SendIcon
                  sx={{
                    fill: selectedChat ? "#0B4F6C" : "#999",
                  }}
                />
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
