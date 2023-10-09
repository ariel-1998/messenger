import { toast } from "react-toastify";

type ErrorResponse = {
  response?: { data?: ErrorMessage };
};

type ErrorMessage = {
  message?: string | string[];
};

export type ErrorModels = ErrorMessage & ErrorResponse;

class ToastifyService {
  error(err: ErrorModels) {
    const message = this.errorMessageExtractor(err);
    if (Array.isArray(message)) {
      message.forEach((msg) => toast.error(`Error: ${msg}`));
      return;
    }
    toast.error(message);
  }

  success(msg: string) {
    toast.success(msg);
  }

  info(msg: string) {
    toast.info(msg);
  }

  private errorMessageExtractor(err: ErrorModels) {
    if (err.response?.data?.message) return err.response?.data?.message;
    if (err.message) return err.message;

    return "Unknown Error has accured!";
  }
}

export const toastifyService = new ToastifyService();
