import { ChatModel } from "./ChatModel";
import { UserModel } from "./UserModel";

export type MessageModel = {
  _id: string;
  sender: UserModel;
  content: string;
  chat: Omit<ChatModel, "users"> & { users: string[] };
  readBy: string[];
};
