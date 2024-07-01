import { render, screen } from "@testing-library/react";
import CustomSearchInput from "../../../src/components/CustomComponents/CustomSearchInput";

describe("CustomSearchInput", () => {
  it("should render properly props", () => {
    render(<CustomSearchInput />);
    const input = screen.getByRole("textbox");
    const searchIconBtn = screen.queryByRole("button");
    expect(input).toBeInTheDocument();
    expect(input).toHaveStyle({ textAlign: "center" });
    expect(searchIconBtn).toBeInTheDocument();
    expect(searchIconBtn).toHaveStyle({ position: "absolute", left: "6%" });
  });
  it("should render properly without icon button", () => {
    render(<CustomSearchInput isIcon={false} />);
    const searchIconBtn = screen.queryByRole("button");
    expect(searchIconBtn).not.toBeInTheDocument();
  });
  //need to test that its writable, test when user types that it actually typing
  //also test when disabled thats not typing
});
