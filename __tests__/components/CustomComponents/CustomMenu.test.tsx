import { render, screen } from "@testing-library/react";
import { useState } from "react";
import userEvent from "@testing-library/user-event";
import CustomMenu from "../../../src/components/CustomComponents/CustomMenu";

const CustomMenuTest = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <button onClick={handleClose}>close</button>
      <CustomMenu onOpen={handleOpen} open={open} icon={<div>icon</div>}>
        <div>children</div>
      </CustomMenu>
    </>
  );
};

describe("CustomMenu", () => {
  it("should render properly", () => {
    render(<CustomMenuTest />);
    const menu = screen.getByTestId("menu-field");
    const openBtn = screen.getByRole("open-menu-button");

    expect(menu).toBeInTheDocument();
    expect(openBtn).toBeInTheDocument();

    expect(menu).toBeVisible();
    expect(openBtn).toBeVisible();

    expect(screen.queryByText("children")).not.toBeInTheDocument();
  });
  it("should hide and show menu properly", async () => {
    render(<CustomMenuTest />);
    const user = userEvent.setup();

    const openBtn = screen.getByRole("open-menu-button");
    const closeBtn = screen.getByText("close");

    await user.click(openBtn);

    const children = screen.queryByText("children");
    expect(children).toBeInTheDocument();
    expect(children).toBeVisible();

    await user.click(closeBtn);
    expect(children).not.toBeInTheDocument();
  });
});
