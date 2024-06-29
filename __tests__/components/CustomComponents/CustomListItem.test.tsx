// import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CustomListItem from "../../../src/components/CustomComponents/CustomListItem";

const CustomListItemTest = () => (
  <CustomListItem>
    <div>hello</div>
  </CustomListItem>
);

describe("CustomListItem", () => {
  it("should render propely", () => {
    render(<CustomListItemTest />);
    const helloDiv = screen.getByText("hello");
    const listItem = screen.getByTestId("ListItem");
    const ListItemBtn = screen.getByTestId("ListItemButton");
    expect(helloDiv).toBeInTheDocument();
    expect(listItem).toBeInTheDocument();
    expect(ListItemBtn).toBeInTheDocument();
  });
});
