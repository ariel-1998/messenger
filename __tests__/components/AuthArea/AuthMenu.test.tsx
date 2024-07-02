import { render } from "@testing-library/react";
import AuthMenu from "../../../src/components/AuthArea/AuthMenu";
import userEvent from "@testing-library/user-event";

jest.mock("../../../src/components/AuthArea/Login", () => mockLogin);
jest.mock("../../../src/components/AuthArea/Register", () => mockRegister);

function mockLogin() {
  return <div>mock login</div>;
}
function mockRegister() {
  return <div>mock register</div>;
}

describe("AuthMenu", () => {
  it("should render with initial value properly", () => {
    const { getByTestId, getByRole, getByText, queryByText } = render(
      <AuthMenu />
    );
    expect(getByTestId("menu-wrapper")).toBeInTheDocument();

    expect(getByRole("tab", { name: /Login/i })).toBeInTheDocument();
    expect(getByRole("tab", { name: /Register/i })).toBeInTheDocument();

    expect(getByText("mock login")).toBeInTheDocument();
    expect(queryByText("mock register")).not.toBeInTheDocument();
  });
  it("should should switch between tabs properly", async () => {
    const { getByRole, getByText, queryByText } = render(<AuthMenu />);
    const user = userEvent.setup();

    const loginBtn = getByRole("tab", { name: /Login/i });
    const registerBtn = getByRole("tab", { name: /Register/i });

    await user.click(registerBtn);

    expect(queryByText("mock login")).not.toBeInTheDocument();
    expect(getByText("mock register")).toBeInTheDocument();

    await user.click(loginBtn);

    expect(getByText("mock login")).toBeInTheDocument();
    expect(queryByText("mock register")).not.toBeInTheDocument();
  });
});
