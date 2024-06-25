import { ChatModel } from "../../models/ChatModel";
import { UserModel } from "../../models/UserModel";
import { chats, users } from "../../../mocks/mockData";

const createdGroupChat: ChatModel = {
  chatName: "group chat 2",
  _id: "6656fba46aa44317972f8ee7",
  groupImg:
    "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
  isGroupChat: true,
  groupAdmin: users[0],
  users: [...users],
};

const addedMember: UserModel = {
  email: "addedMember@gmail.com",
  image:
    "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
  name: "addedMember",
  _id: "addedUserId",
};

class ChatService {
  accessChat = jest.fn().mockResolvedValue(undefined);
  getAllChats = jest.fn().mockResolvedValue(chats);

  createGroupChat = jest.fn().mockResolvedValue(createdGroupChat);

  renameGroup = jest.fn().mockImplementation(({ chatName }) => {
    const renamedChat = { ...createdGroupChat, chatName };
    return Promise.resolve(renamedChat);
  });

  addMembersToGroup = jest.fn().mockResolvedValue({
    ...createdGroupChat,
    users: [...createdGroupChat.users, { ...addedMember }],
  });

  removeMembersFromGroup = jest.fn().mockResolvedValue({
    ...createdGroupChat,
    users: [createdGroupChat.users[0]],
  });
  deleteGroupChat = jest.fn();
}

export const chatService = new ChatService();
