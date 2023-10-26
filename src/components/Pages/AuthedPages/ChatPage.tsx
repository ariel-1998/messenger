import React from "react";
import ChatSection from "./ChatSection";
import ChatPageWrapper from "./ChatPageWrapper";
import SocketProvider from "../../../contexts/SocketProvider";
import DrawerProvider from "../../../contexts/DrawerProvider";

const ChatPage: React.FC = () => {
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
