import { ChatModel } from "./ChatModel";
import { UserModel } from "./UserModel";

export type MessageModel = {
  _id: string;
  sender: UserModel;
  content: string;
  chat: ChatModel;
  readBy: string[];
  createdAt: Date;
};

//timeStampFromUser is only for ux puposes so i could update messages faster
