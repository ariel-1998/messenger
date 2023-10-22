import { ChangeEvent, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../utils/reduxStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { messageService } from "../../../services/messageService";
import { MessageModel } from "../../../models/MessageModel";
import SendIcon from "@mui/icons-material/Send";
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";

function MessageInput(): JSX.Element {
  const [message, setMessage] = useState("");
  const btnRef = useRef<HTMLButtonElement>(null);
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const queryClient = useQueryClient();
  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const sendMessageMutation = useMutation({
    mutationFn: messageService.sendMessage,
    onSuccess: (data) => {
      queryClient.setQueryData<MessageModel[]>(
        ["messages", `{chatId: ${selectedChat?._id}}`],
        (oldData) => {
          if (!oldData) return [data];
          return [...oldData, data];
        }
      );
    },
  });

  const onPressEnter = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && message) {
      btnRef.current?.click();
    }
  };

  const sendMessage = () => {
    if (!selectedChat) return;
    sendMessageMutation.mutate({
      chatId: selectedChat?._id,
      content: message,
    });
  };

  return (
    <FormControl
      onKeyDown={onPressEnter}
      sx={{ height: "100%" }}
      fullWidth
      size="small"
      variant="outlined"
    >
      <InputLabel>Message...</InputLabel>
      <OutlinedInput
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
        label="Message..."
      />
    </FormControl>
  );
}

export default MessageInput;
