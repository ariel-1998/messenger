import React from "react";
import ChatSection from "./ChatSection";
import ChatPageWrapper from "./ChatPageWrapper";
import SocketProvider from "../../../contexts/SocketProvider";
import DrawerProvider from "../../../contexts/DrawerProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { chatService } from "../../../services/chatService";
import { toastifyService } from "../../../services/toastifyService";
import { messageService } from "../../../services/messageService";

const ChatPage: React.FC = () => {
  useQuery({
    queryFn: chatService.getAllChats,
    onError: (e) => toastifyService.error(e),
  });

  return (
    <SocketProvider>
      <DrawerProvider>
        <ChatPageWrapper>
          <ChatSection />
        </ChatPageWrapper>
      </DrawerProvider>
    </SocketProvider>
  );
};

export default ChatPage;
