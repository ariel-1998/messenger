import React from "react";
import { MessageModel } from "../../models/MessageModel";

interface MessageProps {
  Messages: MessageModel[];
}

const Message: React.FC<MessageProps> = ({ Messages }) => {
  return <div></div>;
};

export default Message;
