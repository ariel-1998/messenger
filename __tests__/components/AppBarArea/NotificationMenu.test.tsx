import { render, screen } from "@testing-library/react";
import NotificationMenu from "../../../src/components/AppBarArea/NotificationMenu";
import * as chatSlice from "../../../src/utils/chatSlice";
import { messages } from "../../../mocks/mockData";

const mockSetSelectedChat = jest.spyOn(chatSlice, "setSelectedChat");

// jest.mock("../../../src/hooks/useUnreadMessages", () => ({
//   __esModule: true,
//   default: jest.fn().mockReturnValue({
//     unreadMessages: messages,
//     unreadAmount:
//   }),
// }));

describe("NotificationMenu", () => {
  it("should", () => {
    render(<NotificationMenu />);
    expect(screen.getByRole("notification-menu")).toBeInTheDocument();
  });
});
