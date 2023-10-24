import { Stack, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { messageService } from "../../../services/messageService";
import { RootState } from "../../../utils/reduxStore";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

function MessagesContainer(): JSX.Element {
  const { selectedChat } = useSelector((state: RootState) => state.chat);

  const { data: messages } = useQuery({
    queryKey: ["messages", `{chatId: ${selectedChat?._id}}`],
    queryFn: () => messageService.getMessagesByChatId(selectedChat?._id!),
    enabled: !!selectedChat?._id,
  });

  return (
    <Stack
      bgcolor={"rgba(176, 172, 165, 0.1)"}
      width={"100%"}
      height={"100%"}
      overflow={"auto"}
      px={1}
      pt={1}
      boxSizing={"border-box"}
    >
      <Stack
        flexGrow={1}
        width={"100%"}
        sx={{ overflowY: "auto", overflowX: "hidden", whiteSpace: "normal" }}
      >
        {messages && <MessageList messages={messages} />}
      </Stack>
      <Box flexShrink={0} py={1} flexBasis={"30px"} width={"100%"}>
        <MessageInput />
      </Box>
    </Stack>
  );
}

export default MessagesContainer;
