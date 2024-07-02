class ToastifyService {
  error = jest.fn((err) => err);
  success = jest.fn((string) => string);
  info = jest.fn((string) => string);
}

export const toastifyService = new ToastifyService();
