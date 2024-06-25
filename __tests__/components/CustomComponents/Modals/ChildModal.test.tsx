import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@mui/material";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { theme } from "../../../../src/utils/theme";
import ChildModal from "../../../../src/components/CustomComponents/Modals/ChildModal";

const ChildModalTest = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);
  return (
    <ThemeProvider theme={theme}>
      <button onClick={handleOpen}>open modal</button>
      <ChildModal open={open} handleClose={handleClose}>
        <div>modal child</div>
      </ChildModal>
    </ThemeProvider>
  );
};

describe("ChildModal", () => {
  it("closed Modal should not show children", () => {
    render(<ChildModalTest />);
    const modalChild = screen.queryByText("modal child");
    expect(modalChild).not.toBeInTheDocument();
  });

  it("should open and close modal properly", async () => {
    render(<ChildModalTest />);
    const user = userEvent.setup();
    const openBtn = screen.getByText("open modal");
    expect(screen.queryByText("modal child")).not.toBeInTheDocument();
    expect(screen.queryByTestId("modal-overlay-test")).not.toBeInTheDocument();

    await user.click(openBtn);
    expect(screen.getByText("modal child")).toBeInTheDocument();
    expect(screen.getByTestId("modal-overlay-test")).toBeInTheDocument();

    const overlay = screen.getByTestId("modal-overlay-test").firstElementChild;
    expect(overlay).toBeInTheDocument();
    await user.click(overlay as HTMLElement);
    expect(screen.queryByText("modal child")).not.toBeInTheDocument();
  });
});
