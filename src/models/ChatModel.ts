import { z } from "zod";
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

export const createGroupSchema = z.object({
  chatName: z
    .string()
    .min(2)
    .refine(
      (name) => name.trim().length > 1,
      "Chat name must be at least 2 letters!"
    ),
  users: z
    .array(
      z.object({
        _id: z
          .string()
          .min(1)
          .refine((str) => str.trim().length > 0, "Invalid users!"),
      })
    )
    .min(3, "Minimum of 3 users is required!"),
});
