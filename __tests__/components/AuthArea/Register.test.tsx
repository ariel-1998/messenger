import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "../../../src/components/AuthArea/Register";
import { render } from "@testing-library/react";

jest.mock("../../../src/services/authService");
jest.mock("../../../src/services/userService");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const MockRegister = () => (
  <QueryClientProvider client={new QueryClient()}>
    <Register />
  </QueryClientProvider>
);

describe("Register", () => {
  it("should render form properly", () => {
    const {
      getByRole,
      getAllByTestId,
      getByText,
      getByLabelText,
      getByTestId,
    } = render(<MockRegister />);

    expect(getByRole("form")).toBeInTheDocument();
    expect(getAllByTestId("form-control")).toHaveLength(5);

    expect(getByText("Name")).toBeInTheDocument();
    expect(getByText("Email address")).toBeInTheDocument();
    expect(getByText("Password")).toBeInTheDocument();
    expect(getByText("Confirm password")).toBeInTheDocument();
    expect(getByText("Profile image")).toBeInTheDocument();

    const nameInput = getByLabelText("Name");
    const emailInput = getByLabelText("Email address");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm password");
    const imageInput = getByTestId("file-input");

    expect(nameInput).toHaveAttribute("type", "text");
    expect(emailInput).toHaveAttribute("type", "text");
    expect(passwordInput).toHaveAttribute("type", "password");
    expect(confirmPasswordInput).toHaveAttribute("type", "password");
    expect(imageInput.firstElementChild).toHaveAttribute("type", "file");
  });
  it("inputs should not be disabled", () => {
    const { getByTestId, getByLabelText } = render(<MockRegister />);

    const nameInput = getByLabelText("Name");
    const emailInput = getByLabelText("Email address");
    const passwordInput = getByLabelText("Password");
    const confirmPasswordInput = getByLabelText("Confirm password");
    const imageInput = getByTestId("file-input").firstElementChild;
    const inputs = [
      nameInput,
      emailInput,
      passwordInput,
      confirmPasswordInput,
      imageInput,
    ];
    inputs.forEach((input) => {
      expect(input).not.toBeDisabled();
    });
    it("should display errors properly when schema validation fails", () => {});
    it("should display loading state when request is loading", () => {});
    it("should register properly without an image", () => {});
    it("should register properly with an image", () => {});
  });
});
