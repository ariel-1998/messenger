import { UserModel } from "../src/models/UserModel";
import { MessageModel } from "../src/models/MessageModel";
import { ChatModel } from "../src/models/ChatModel";
//users
export const users: UserModel[] = [
  {
    email: "arielkas@gmail.com",
    image:
      "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
    name: "ariel",
    _id: "650c94e3cb09fe8dc1f01b3d",
  },
  {
    email: "hi@gmail.com",
    image:
      "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
    name: "ariel",
    _id: "6654d1f98200b98b13e29687",
  },
];

//chats
export const chats: ChatModel[] = [
  {
    chatName: "null",
    _id: "6656fba46aa44317972f8ee8",
    groupImg:
      "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
    isGroupChat: false,
    users: [...users],
  },
  {
    chatName: "group chat",
    _id: "6656fba46aa44317972f8ee7",
    groupImg:
      "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
    isGroupChat: true,
    groupAdmin: users[0],
    users: [...users],
  },
];

//messages
export const messages: MessageModel[] = [
  {
    chat: chats[0],
    content: "someContent",
    readBy: [],
    sender: chats[0].users[0],
    createdAt: new Date(),
  },
  {
    chat: chats[1],
    content: "someContent",
    readBy: [],
    sender: chats[1].users[0],
    createdAt: new Date(),
  },
];
