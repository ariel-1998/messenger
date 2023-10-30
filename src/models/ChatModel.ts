import { z } from "zod";
import { MessageModel } from "./MessageModel";
import { UserModel } from "./UserModel";

export type ChatModel = {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  users: UserModel[];
  latestMessage?: Partial<MessageModel>;
  groupAdmin?: UserModel;
};

export const groupNameSchema = z
  .string()
  .refine(
    (name) => name.trim().length > 1,
    "Chat name must be at least 2 letters!"
  );

export const usersSchema = z.object({
  _id: z.string(),
});

export const createGroupSchema = z.object({
  chatName: groupNameSchema,
  users: z.array(usersSchema).min(3, "Minimum of 3 users is required!"),
});
