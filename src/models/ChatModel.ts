import { MessageModel } from "./MessageModel";
import { UserModel } from "./UserModel";

export type ChatModel = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: UserModel[];
  latestMessage: MessageModel;
  groupAdmin: UserModel;
};
