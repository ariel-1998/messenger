import { Stack, Box } from "@mui/material";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";

function MessagesContainer(): JSX.Element {
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
      <MessageList />
      <Box flexShrink={0} py={1} flexBasis={"30px"} width={"100%"}>
        <MessageInput />
      </Box>
    </Stack>
  );
}

export default MessagesContainer;
