import { ZodError } from "zod";
import { toastifyService } from "../services/toastifyService";

export const extractZodErrors = (error: ZodError) => {
  const issues = error.errors?.map((issue) => issue?.message);
  toastifyService.error({ message: issues });
};
