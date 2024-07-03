import { users } from "../../../mocks/mockData";

class UserService {
  uploadImage = jest.fn().mockResolvedValue({ url: "someUrl" });
  searchUsers = jest.fn().mockResolvedValue(users);
}

export const userService = new UserService();
