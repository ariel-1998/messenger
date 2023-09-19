import { z } from "zod";

export type UserModel = {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  image: string;
};

const passwordSchema = z
  .string()
  .min(8, "Min number of letters is 8")
  .max(20, "Max number of letters is 20")
  .trim();

export const userSchema = z.object({
  name: z
    .string()
    .min(2, "Min number of letters is 2")
    .max(20, "Max number of letters is 20")
    .trim(),
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  confirmPassword: passwordSchema,
  image: z.instanceof(FileList),
});

export const loginSchema = userSchema.pick({ email: true, password: true });
export type CredentialsModel = z.infer<typeof loginSchema>;
