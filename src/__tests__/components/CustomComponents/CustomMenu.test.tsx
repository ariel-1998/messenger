import { render, screen } from "@testing-library/react";
import CustomMenu from "../../../components/CustomComponents/CustomMenu";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

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
    render(
      <CustomMenu onOpen={jest.fn()} open={false} icon={<div>icon</div>}>
        <div>children</div>
      </CustomMenu>
    );
    const menu = screen.getByRole("menu-field");
    const openBtn = screen.getByRole("open-menu-button");
    const children = screen.getByText("children");

    expect(menu).toBeInTheDocument();
    expect(openBtn).toBeInTheDocument();
    expect(children).toBeInTheDocument();

    expect(menu).toBeVisible();
    expect(openBtn).toBeVisible();
    expect(children).not.toBeVisible();
  });
  it("should hide and show menu properly", async () => {
    render(<CustomMenuTest />);
    const user = userEvent.setup();

    const openBtn = screen.getByRole("open-menu-button");
    const closeBtn = screen.getByText("close");

    const children = screen.getByText("children");

    await user.click(openBtn);
    expect(children).toBeVisible();

    await user.click(closeBtn);
    expect(children).not.toBeVisible();
  });
});
