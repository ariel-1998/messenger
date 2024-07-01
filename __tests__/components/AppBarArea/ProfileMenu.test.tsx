import { render, screen } from "@testing-library/react";
import { Box, SxProps } from "@mui/material";
import ProfileMenu from "../../../src/components/AppBarArea/ProfileMenu";
import userEvent from "@testing-library/user-event";

jest.mock("react-redux");
jest.mock("../../../src/components/CustomComponents/CustomMenu");
jest.mock("../../../src/components/ProfileArea/ProfileModal");
jest.mock("../../../src/utils/urlImageOptimize");
jest.mock("../../../src/components/AuthArea/Logout", () => ({
  __esModule: true,
  default: mockLogout,
}));

function mockLogout({ sx }: { sx: SxProps }) {
  return <Box sx={sx}>Logout</Box>;
}
describe("ProfileMenu", () => {
  it("should initial render menu properly", () => {
    render(<ProfileMenu />);
    expect(screen.getByTestId("menu-field")).toBeInTheDocument();
    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    expect(screen.queryByText("My Profile")).not.toBeInTheDocument();
  });
  it("should open menu properly", async () => {
    render(<ProfileMenu />);
    const user = userEvent.setup();

    const openMenuBtn = screen.getByTestId("open-menu-button");
    await user.click(openMenuBtn);

    const openProfileBtn = screen.getByText("My Profile");
    expect(openProfileBtn).toBeInTheDocument();
    expect(openProfileBtn.tagName).toBe("P");

    expect(screen.getByText("Logout")).toBeInTheDocument();
  });
  it("should close menu when clicking user profile", async () => {
    render(<ProfileMenu />);
    const user = userEvent.setup();

    const openMenuBtn = screen.getByTestId("open-menu-button");
    await user.click(openMenuBtn);

    const openProfileBtn = screen.getByText("My Profile");
    await user.click(openProfileBtn);

    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    expect(screen.queryByText("My Profile")).not.toBeInTheDocument();
  });
  it("should close menu when clicking logout", async () => {
    render(<ProfileMenu />);
    const user = userEvent.setup();

    const openMenuBtn = screen.getByTestId("open-menu-button");
    await user.click(openMenuBtn);

    const openProfileBtn = screen.getByText("Logout");
    await user.click(openProfileBtn);

    expect(screen.queryByText("Logout")).not.toBeInTheDocument();
    expect(screen.queryByText("My Profile")).not.toBeInTheDocument();
  });
});
