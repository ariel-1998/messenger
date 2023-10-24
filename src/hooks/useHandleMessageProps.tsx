import React from "react";
import { MessageBubbleProps } from "../components/ChatArea/MessagesArea/MessageBubble";
import { useSelector } from "react-redux";
import { RootState } from "../utils/reduxStore";
import { MessageModel } from "../models/MessageModel";
import {
  shouldMakeMarginLeftToMsg,
  showSenderDetails,
} from "../utils/messageMethods";

type useHandleMessagePropsProps = {
  messages: MessageModel[];
  message: MessageModel;
  index: number;
};

type useHandleMessagePropsReturnType = {
  senderDetails: boolean;
  alignMessage: "start" | "end";
  marginMessage: boolean;
};

const useHandleMessageProps = ({
  message,
  messages,
  index,
}: useHandleMessagePropsProps): useHandleMessagePropsReturnType => {
  const { selectedChat } = useSelector((state: RootState) => state.chat);
  const user = useSelector((state: RootState) => state.auth);
  const isGroupChat = selectedChat?.isGroupChat;
  const senderIsMe = user?._id === message.sender._id;
  const alignMessage = senderIsMe ? "end" : "start";

  const args: [
    boolean | undefined,
    number,
    MessageModel[],
    MessageModel,
    boolean
  ] = [isGroupChat, index, messages, message, senderIsMe];
  //show image and name
  const senderDetails = showSenderDetails(...args);
  //should align massages right if no image
  const marginMessage = shouldMakeMarginLeftToMsg(...args);
  return { alignMessage, senderDetails, marginMessage };
};

export default useHandleMessageProps;
