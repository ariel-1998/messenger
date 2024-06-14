import { rest } from "msw";
import { ChatModel } from "../models/ChatModel";
import { MessageModel } from "../models/MessageModel";

const baseUrl = import.meta.env.VITE_BASE_API_URL;
const path = (path: string) => `${baseUrl}${path}`;

const chats: ChatModel[] = [
  {
    chatName: "null",
    _id: "6656fba46aa44317972f8ee8",
    groupImg:
      "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
    isGroupChat: false,
    users: [
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
    ],
  },
  {
    chatName: "group chat",
    _id: "6656fba46aa44317972f8ee7",
    groupImg:
      "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
    isGroupChat: true,
    groupAdmin: {
      email: "arielkas@gmail.com",
      image:
        "http://res.cloudinary.com/dnlv6fy3z/image/upload/v1718276606/hyhe3h69womcfeqw1kjs.png",
      name: "ariel",
      _id: "650c94e3cb09fe8dc1f01b3d",
    },
    users: [
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
    ],
  },
];
const messages: MessageModel[] = [
  {
    chat: chats[0],
    content: "someContent",
    readBy: [],
    sender: chats[0].users[0],
    createdAt: new Date(),
    // createdAt: "2024-06-05T08:31:23.894Z" as unknown as Date,
  },
  {
    chat: chats[1],
    content: "someContent",
    readBy: [],
    sender: chats[1].users[0],
    createdAt: new Date(),
    // createdAt: "2024-06-05T08:31:23.894Z" as unknown as Date,
  },
];

export const handlers = [
  rest.get(path("chat"), (_, res, ctx) => {
    return res(ctx.json(chats));
  }),
  rest.get(path("message/unread"), (_, res, ctx) => {
    return res(ctx.json(messages));
  }),
];
