import { render, screen, waitFor } from "@testing-library/react";
import CustomMenu from "../../../components/CustomComponents/CustomMenu";
import { useState } from "react";
import userEvent from "@testing-library/user-event";

const onOpen = jest.fn();

const CustomMenuTest = () => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <button onClick={handleOpen}>open</button>
      <button onClick={handleClose}>close</button>
      <CustomMenu onOpen={onOpen} open={open} icon={<div>icon</div>}>
        <div>children</div>
      </CustomMenu>
    </>
  );
};

describe("CustomMenu", () => {
  it("should render properly", () => {
    render(
      <CustomMenu onOpen={onOpen} open={false} icon={<div>icon</div>}>
        <div>children</div>
      </CustomMenu>
    );
    const menu = screen.getByRole("menu");
    const icon = screen.getByText("icon");
    const children = screen.getByText("children");

    expect(menu).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(children).toBeInTheDocument();

    expect(menu).toBeVisible();
    expect(icon).toBeVisible();
    expect(children).not.toBeVisible();
  });
  it("should hide and show menu properly", async () => {
    render(<CustomMenuTest />);
    const user = userEvent.setup();

    const open = screen.getByText("open");
    const close = screen.getByText("close");

    await user.click(open);
    await waitFor(async () =>
      expect(screen.getByText("children")).not.toBeVisible()
    );

    await user.click(close);
    expect(screen.getByText("children")).not.toBeVisible();

    expect(onOpen).toHaveBeenCalledTimes(1);
  });
});
