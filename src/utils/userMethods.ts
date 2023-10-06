import { ChatModel } from "../models/ChatModel";
import { UserModel } from "../models/UserModel";

export const findUserInChat = (
  chat: ChatModel,
  loggedUser: UserModel | null
): UserModel | undefined => {
  return chat.users.find((user) => user._id !== loggedUser?._id);
};

export const isUserInArr = (usersArr: UserModel[], user: UserModel) => {
  const index = usersArr?.findIndex((arrayUser) => user._id === arrayUser._id);
  return index;
};
