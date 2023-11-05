import React from "react";
import ChatSection from "./ChatSection";
import ChatPageWrapper from "./ChatPageWrapper";
import DrawerProvider from "../../../contexts/DrawerProvider";

const ChatPage: React.FC = () => {
  return (
    <DrawerProvider>
      <ChatPageWrapper>
        <ChatSection />
      </ChatPageWrapper>
    </DrawerProvider>
  );
};

export default ChatPage;
