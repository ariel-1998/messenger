import { users } from "../../../mocks/mockData";

const uploadedImgUrl = "someUrl";

class UserService {
  uploadImage = jest.fn().mockResolvedValue(uploadedImgUrl);
  searchUsers = jest.fn().mockResolvedValue(users);
}

export const userService = new UserService();
