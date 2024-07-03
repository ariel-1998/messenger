import { render } from "@testing-library/react";
import Logout from "../../../src/components/AuthArea/Logout";
import userEvent from "@testing-library/user-event";
import { authService } from "../../../src/services/authService";

jest.mock("../../../src/services/authService");

const mockClear = jest.fn();
jest.mock("@tanstack/react-query", () => ({
  useQueryClient: () => ({ clear: mockClear }),
}));
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

const mockLogout = authService.logout as jest.Mock;

describe("Logout", () => {
  it("should render properly", () => {
    const { getByTestId, getByText } = render(<Logout />);
    expect(getByTestId("logout")).toBeInTheDocument();
    expect(getByTestId("icon")).toBeInTheDocument();
    expect(getByText("Logout")).toBeInTheDocument();
  });
  it("should logout properly", async () => {
    const { getByTestId } = render(<Logout />);
    const user = userEvent.setup();
    await user.click(getByTestId("logout"));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith("/auth");

    expect(mockClear).toHaveBeenCalledTimes(1);

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
