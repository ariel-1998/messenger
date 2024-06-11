import { render, screen } from "@testing-library/react";
import CustomTabPanel, {
  CustomTabPanelProps,
} from "../../../components/CustomComponents/CustomTabPanel";

const CustomTabPanelTest = ({
  index,
  value,
}: Omit<CustomTabPanelProps, "children">) => (
  <CustomTabPanel index={index} value={value}>
    <div>children</div>
  </CustomTabPanel>
);

describe("CustomTabPanel", () => {
  it("should render properly when value !== index", () => {
    render(<CustomTabPanelTest index={0} value={1} />);
    const tab = screen.getByTestId("tab");
    const childrenWrapper = screen.queryByTestId("chilren-wrapper");
    const children = screen.queryByText("children");

    expect(tab).toBeInTheDocument();
    expect(tab).not.toBeVisible();
    expect(childrenWrapper).not.toBeInTheDocument();
    expect(children).not.toBeInTheDocument();
  });
  it("should render properly when value === index", () => {
    render(<CustomTabPanelTest index={1} value={1} />);
    const tab = screen.getByTestId("tab");
    const childrenWrapper = screen.getByTestId("chilren-wrapper");
    const children = screen.getByText("children");

    expect(tab).toBeInTheDocument();
    expect(tab).toBeVisible();
    expect(childrenWrapper).toBeInTheDocument();
    expect(children).toBeInTheDocument();
  });
});
