import { z } from "zod";

export type UserModel = {
  _id: string;
  name: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  image: string | FileList;
};

const passwordSchema = z
  .string()
  .min(8, "Min number of letters is 8")
  .max(20, "Max number of letters is 20")
  .trim();

const imageSchema = z.instanceof(FileList).refine((files) => {
  const type = files?.[0]?.type;
  if (!type) return false;
  if (!type.startsWith("image/") || type.endsWith("gif")) return false;
  return true;
}, "Image required, only image files are valid");

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Min number of letters is 2")
    .max(20, "Max number of letters is 20")
    .trim(),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  image: imageSchema,
});

export const loginSchema = userSchema.pick({ email: true }).merge(
  z.object({
    password: z
      .string({ required_error: "password is required" })
      .min(1, "password is required"),
  })
);
export type CredentialsModel = z.infer<typeof loginSchema>;
