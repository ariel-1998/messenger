import axios from "axios";
import { authenticatedAxios } from "../utils/axiosInterceptors";
import { UserModel } from "../models/UserModel";

type cloudinaryImgRes = {
  url: string;
};

const searchEndpoint = "user";
const postImgEndpoint =
  "https://api.cloudinary.com/v1_1/dnlv6fy3z/image/upload";

class UserService {
  async uploadImage(image: FileList): Promise<cloudinaryImgRes> {
    const formData = new FormData();
    formData.append("file", image[0]);
    formData.append("upload_preset", import.meta.env.VITE_UPLOAD_PRESET);
    formData.append("cloud_name", "dnlv6fy3z");
    const { data } = await axios.post<cloudinaryImgRes>(
      postImgEndpoint,
      formData
    );
    return data;
  }

  async searchUsers(search: string | undefined): Promise<UserModel[]> {
    const { data } = await authenticatedAxios.get<UserModel[]>(searchEndpoint, {
      params: { search: search },
    });
    return data;
  }
}

export const userService = new UserService();
