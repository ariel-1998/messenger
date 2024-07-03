import { render } from "@testing-library/react";
import Login from "../../../src/components/AuthArea/Login";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import * as query from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { authService } from "../../../src/services/authService";

jest.mock("../../../src/services/toastifyService");
jest.mock("../../../src/services/authService");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const MockLogin = () => (
  <QueryClientProvider client={new QueryClient()}>
    <Login />
  </QueryClientProvider>
);

describe("Login", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  describe("render and submition", () => {
    it("should render form properly", () => {
      const {
        getAllByTestId,
        getByText,
        getByRole,
        queryAllByTestId,
        getByLabelText,
      } = render(<MockLogin />);

      expect(getByRole("form")).toBeInTheDocument();

      expect(getAllByTestId("form-control")).toHaveLength(2);

      expect(getByText("Email address")).toBeInTheDocument();
      const emailInput = getByLabelText("Email address");
      expect(emailInput).toHaveAttribute("type", "text");

      expect(getByText("Password")).toBeInTheDocument();
      const passwordInput = getByLabelText("Password");
      expect(passwordInput).toHaveAttribute("type", "password");

      expect(queryAllByTestId("error-message")).toHaveLength(0);
      const loginBtn = getByRole("button", {
        name: "Login",
      });
      const resetBtn = getByRole("button", {
        name: "Reset",
      });

      expect(loginBtn).not.toBeDisabled();
      expect(resetBtn).not.toBeDisabled();
      expect(loginBtn).toHaveAttribute("type", "submit");
      expect(resetBtn).toHaveAttribute("type", "reset");
    });
    it("should be able to type in all inputs", async () => {
      const { getByLabelText } = render(<MockLogin />);
      const user = userEvent.setup();

      const emailType = "email";
      const passwordType = "password";

      await user.type(getByLabelText("Email address"), emailType);
      await user.type(getByLabelText("Password"), passwordType);

      expect(getByLabelText("Email address")).toHaveValue(emailType);
      expect(getByLabelText("Password")).toHaveValue(passwordType);
    });
    it("should display loading state when request is loading", async () => {
      const mutationRes = {
        mutate: jest.fn(),
        isLoading: true,
      } as unknown as query.UseMutationResult;
      jest.spyOn(query, "useMutation").mockReturnValueOnce(mutationRes);

      const { getByRole } = render(<MockLogin />);

      expect(getByRole("button", { name: "Login" })).toBeDisabled();
    });
    it("should login properly", async () => {
      const { getByLabelText, getByRole } = render(<MockLogin />);
      const user = userEvent.setup();

      const email = "email@gmail.com";
      const password = "password";

      await user.type(getByLabelText("Email address"), email);
      await user.type(getByLabelText("Password"), password);

      await user.click(getByRole("button", { name: "Login" }));

      expect(authService.login).toHaveBeenCalledTimes(1);
      expect(authService.login).toHaveBeenCalledWith({ email, password });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledWith("/chat");
    });
  });
  describe("schema validation", () => {
    const mutate = jest.fn();
    beforeEach(() => {
      const mutationRes = {
        mutate,
        isLoading: false,
      } as unknown as query.UseMutationResult;
      jest.spyOn(query, "useMutation").mockReturnValue(mutationRes);
    });
    it("should display email required error", async () => {
      const { getByRole, getByText } = render(<MockLogin />);
      const user = userEvent.setup();

      await user.click(getByRole("button", { name: "Login" }));

      expect(getByText("Invalid email address")).toBeInTheDocument();
      expect(mutate).not.toHaveBeenCalled();
    });
    it("should display error when email is invalid", async () => {
      const { getByRole, getByLabelText, getByText } = render(<MockLogin />);
      const user = userEvent.setup();

      await user.type(getByLabelText("Email address"), "invalid-email");
      await user.click(getByRole("button", { name: "Login" }));

      expect(getByText("Invalid email address")).toBeInTheDocument();
      expect(mutate).not.toHaveBeenCalled();
    });
    it("should display password required error", async () => {
      const { getByRole, getByText } = render(<MockLogin />);
      const user = userEvent.setup();

      await user.click(getByRole("button", { name: "Login" }));

      expect(getByText("Password is required")).toBeInTheDocument();
      expect(mutate).not.toHaveBeenCalled();
    });
  });
});
