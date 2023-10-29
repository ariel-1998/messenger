import React from "react";
import ChatSection from "./ChatSection";
import ChatPageWrapper from "./ChatPageWrapper";
import SocketProvider from "../../../contexts/SocketProvider";
import DrawerProvider from "../../../contexts/DrawerProvider";
import UnreadMessagesProvider from "../../../contexts/UnreadMessagesProvider";

const ChatPage: React.FC = () => {
  return (
    <UnreadMessagesProvider>
      <SocketProvider>
        <DrawerProvider>
          <ChatPageWrapper>
            <ChatSection />
          </ChatPageWrapper>
        </DrawerProvider>
      </SocketProvider>
    </UnreadMessagesProvider>
  );
};

export default ChatPage;
