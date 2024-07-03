import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Register from "../../../src/components/AuthArea/Register";
import { render } from "@testing-library/react";
import * as query from "@tanstack/react-query";
import userEvent from "@testing-library/user-event";
import { UserModel } from "../../../src/models/UserModel";
import { authService } from "../../../src/services/authService";
import { userService } from "../../../src/services/userService";

jest.mock("../../../src/services/authService");
jest.mock("../../../src/services/userService");

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

const MockRegister = () => (
  <QueryClientProvider client={new QueryClient()}>
    <Register />
  </QueryClientProvider>
);

type ValidInputs = Pick<UserModel, "email" | "name"> & {
  password: string;
  confirmPassword: string;
  image: undefined;
};
const validPassword = "password";
const validInputs: ValidInputs = {
  email: "email@mail.com",
  name: "name",
  password: validPassword,
  confirmPassword: validPassword,
  image: undefined,
};

describe("Register", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  describe("render and submition", () => {
    it("should render form properly", () => {
      const {
        getByRole,
        getAllByTestId,
        getByText,
        getByLabelText,
        getByTestId,
        queryAllByTestId,
      } = render(<MockRegister />);

      expect(getByRole("form")).toBeInTheDocument();
      expect(getAllByTestId("form-control")).toHaveLength(5);

      expect(getByText("Name")).toBeInTheDocument();
      expect(getByText("Email address")).toBeInTheDocument();
      expect(getByText("Password")).toBeInTheDocument();
      expect(getByText("Confirm password")).toBeInTheDocument();
      expect(getByText("Profile image")).toBeInTheDocument();

      expect(getByLabelText("Name")).toHaveAttribute("type", "text");
      expect(getByLabelText("Email address")).toHaveAttribute("type", "text");
      expect(getByLabelText("Password")).toHaveAttribute("type", "password");
      expect(getByLabelText("Confirm password")).toHaveAttribute(
        "type",
        "password"
      );
      expect(getByTestId("file-input").firstElementChild).toHaveAttribute(
        "type",
        "file"
      );

      expect(queryAllByTestId("error-message")).toHaveLength(0);

      expect(
        getByRole("button", {
          name: "Register",
        })
      ).not.toBeDisabled();
      expect(
        getByRole("button", {
          name: "Reset",
        })
      ).not.toBeDisabled();
    });
    it("inputs should not be disabled", async () => {
      const { getByTestId, getByLabelText } = render(<MockRegister />);
      const user = userEvent.setup();
      const inputs = [
        getByLabelText("Name"),
        getByLabelText("Email address"),
        getByLabelText("Password"),
        getByLabelText("Confirm password"),
        getByTestId("file-input").firstElementChild,
      ];
      inputs.forEach((input) => {
        expect(input).not.toBeDisabled();
      });
      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      const fileInput = getByTestId("file-input").querySelector("input");
      await user.upload(fileInput as HTMLElement, file);
      expect(fileInput?.files?.[0]).toBeTruthy();
    });
    it("should display loading state when request is loading", () => {
      const mutationRes = {
        isLoading: true,
      } as unknown as query.UseMutationResult;
      jest.spyOn(query, "useMutation").mockReturnValueOnce(mutationRes);

      const { getByRole } = render(<MockRegister />);

      expect(getByRole("button", { name: "Register" })).toBeDisabled();
    });
    it("should register properly without an image", async () => {
      const { getByLabelText, getByRole } = render(<MockRegister />);
      const user = userEvent.setup();

      await user.type(getByLabelText("Name"), validInputs.name);
      await user.type(getByLabelText("Email address"), validInputs.email);
      await user.type(getByLabelText("Password"), validInputs.password);
      await user.type(
        getByLabelText("Confirm password"),
        validInputs.confirmPassword
      );

      await user.click(getByRole("button", { name: "Register" }));

      expect(authService.register).toHaveBeenCalledTimes(1);

      expect(authService.register).toHaveBeenCalledWith({ ...validInputs });
      expect(userService.uploadImage).not.toHaveBeenCalled();
    });
    it("should register properly with an image", async () => {
      const { getByLabelText, getByTestId, getByRole } = render(
        <MockRegister />
      );
      const user = userEvent.setup();

      const file = new File(["dummy content"], "example.png", {
        type: "image/png",
      });

      const fileInput = getByTestId("file-input").querySelector("input");
      await user.type(getByLabelText("Name"), validInputs.name);
      await user.type(getByLabelText("Email address"), validInputs.email);
      await user.type(getByLabelText("Password"), validInputs.password);
      await user.type(getByLabelText("Confirm password"), validInputs.password);
      await user.upload(fileInput as HTMLElement, file);

      await user.click(getByRole("button", { name: "Register" }));

      expect(userService.uploadImage).toHaveBeenCalledTimes(1);
      expect(userService.uploadImage).toHaveBeenCalledWith(fileInput?.files);
      const { url } = await userService.uploadImage({} as FileList);
      expect(authService.register).toHaveBeenCalledTimes(1);
      expect(authService.register).toHaveBeenCalledWith({
        ...validInputs,
        image: url,
      });
    });
  });

  describe("schema validation", () => {
    const mutate = jest.fn();
    const mutateAsync = jest.fn();
    beforeEach(() => {
      const mutationRes = {
        mutate,
        isLoading: false,
        mutateAsync,
      } as unknown as query.UseMutationResult;
      jest.spyOn(query, "useMutation").mockReturnValue(mutationRes);
    });
    it("should display required errors", async () => {
      const { getAllByTestId, getByRole, getByText, getAllByText } = render(
        <MockRegister />
      );
      const user = userEvent.setup();

      await user.click(getByRole("button", { name: "Register" }));

      expect(getAllByTestId("error-message")).toHaveLength(4);

      expect(getByText("Min number of letters is 2")).toBeInTheDocument();
      expect(getByText("Invalid email address")).toBeInTheDocument();
      expect(getAllByText("Min number of letters is 8")).toHaveLength(2);

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
    it("should display name too short error", async () => {
      const { getByText, getByLabelText, getByRole } = render(<MockRegister />);
      const user = userEvent.setup();

      await user.type(getByLabelText("Name"), "a");
      await user.click(getByRole("button", { name: "Register" }));

      expect(getByText("Min number of letters is 2")).toBeInTheDocument();

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
    it("should display name too long error", async () => {
      const { getByText, getByLabelText, getByRole } = render(<MockRegister />);
      const user = userEvent.setup();

      await user.type(getByLabelText("Name"), "a".repeat(21));
      await user.click(getByRole("button", { name: "Register" }));

      expect(getByText("Max number of letters is 20")).toBeInTheDocument();

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
    it("should display errors password and confirmPassword are too Long", async () => {
      const { getAllByText, getByLabelText, getByRole } = render(
        <MockRegister />
      );
      const user = userEvent.setup();
      const longPassword = "a".repeat(21);

      await user.type(getByLabelText("Password"), longPassword);
      await user.type(getByLabelText("Confirm password"), longPassword);
      await user.click(getByRole("button", { name: "Register" }));

      expect(getAllByText("Max number of letters is 20")).toHaveLength(2);

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
    it("should display password and confirmPassword too short errors", async () => {
      const { getAllByText, getByLabelText, getByRole } = render(
        <MockRegister />
      );
      const user = userEvent.setup();

      await user.type(getByLabelText("Password"), "a");
      await user.type(getByLabelText("Confirm password"), "a");

      await user.click(getByRole("button", { name: "Register" }));

      expect(getAllByText("Min number of letters is 8")).toHaveLength(2);

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
    it("should display invalid email error", async () => {
      const { getByText, getByLabelText, getByRole } = render(<MockRegister />);
      const user = userEvent.setup();

      await user.type(getByLabelText("Email address"), "invalid-email");

      await user.click(getByRole("button", { name: "Register" }));

      expect(getByText("Invalid email address")).toBeInTheDocument();

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
    it("should display an error if file type doesnts start with image/", async () => {
      const { getByText, getByRole, getByTestId } = render(<MockRegister />);
      const user = userEvent.setup();

      const fileInput = getByTestId("file-input").querySelector("input");
      const file = new File(["dummy content"], "example.png", {
        type: "video/png",
      });

      await user.upload(fileInput as HTMLElement, file);
      await user.click(getByRole("button", { name: "Register" }));

      expect(getByText("Only image files are allowed")).toBeInTheDocument();

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
    it("should display an error if file type ends with gif", async () => {
      const { getByText, getByRole, getByTestId } = render(<MockRegister />);
      const user = userEvent.setup();

      const fileInput = getByTestId("file-input").querySelector("input");
      const file = new File(["dummy content"], "example.png", {
        type: "image/gif",
      });

      await user.upload(fileInput as HTMLElement, file);
      await user.click(getByRole("button", { name: "Register" }));

      expect(getByText("Only image files are allowed")).toBeInTheDocument();

      expect(mutate).not.toHaveBeenCalled();
      expect(mutateAsync).not.toHaveBeenCalled();
    });
  });
});
