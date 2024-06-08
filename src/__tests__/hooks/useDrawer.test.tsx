import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import useDrawer from "../../hooks/useDrawer";
import DrawerProvider from "../../contexts/DrawerProvider";
import userEvent from "@testing-library/user-event";

let DrawerWithWrapper: React.FC;

beforeAll(() => {
  const Drawer = () => {
    const { closeDrawer, open, openDrawer } = useDrawer();
    return (
      <div>
        <div>{open ? "open" : "closed"}</div>
        <button onClick={openDrawer}>open btn</button>
        <button onClick={closeDrawer}>close btn</button>
      </div>
    );
  };
  DrawerWithWrapper = () => (
    <DrawerProvider>
      <Drawer />
    </DrawerProvider>
  );
});

describe("useDrawer", () => {
  it("open initial state should be false", () => {
    render(<DrawerWithWrapper />);
    const closeDiv = screen.queryByText("closed");
    expect(closeDiv).toBeInTheDocument();
    const openDiv = screen.queryByText("open");
    expect(openDiv).not.toBeInTheDocument();
  });
  it("should change states open and close properly", async () => {
    render(<DrawerWithWrapper />);
    const user = userEvent.setup();
    expect(screen.queryByText("open")).not.toBeInTheDocument();
    expect(screen.queryByText("closed")).toBeInTheDocument();
    const openBtn = screen.getByText("open btn");
    const closeBtn = screen.getByText("close btn");
    await user.click(openBtn);
    expect(screen.queryByText("open")).toBeInTheDocument();
    expect(screen.queryByText("closed")).not.toBeInTheDocument();
    await user.click(closeBtn);
    expect(screen.queryByText("open")).not.toBeInTheDocument();
    expect(screen.queryByText("closed")).toBeInTheDocument();
  });
});
