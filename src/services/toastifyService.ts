import { toast } from "react-toastify";

type ErrorResponse = {
  response?: { data?: ErrorMessage };
};

type ErrorMessage = {
  message?: string;
};

export type ErrorModels = ErrorMessage & ErrorResponse;

class ToastifyService {
  error(err: ErrorModels) {
    const message = this.errorMessageExtractor(err);
    toast.error(message);
  }

  success(msg: string) {
    toast.success(msg);
  }

  info(msg: string) {
    toast.info(msg);
  }

  private errorMessageExtractor(err: ErrorModels) {
    if (err.message) return err.message;

    if (err.response?.data?.message) {
      const message = err.response?.data?.message;
      if (Array.isArray(message)) {
        //do something late for displaying an array
      }
      return message;
    }
    return "Unknown Error has accured!";
  }
}

export const toastifyService = new ToastifyService();
