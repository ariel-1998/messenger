import axios from "axios";
import { apiConfig } from "../utils/config";
import { CredentialsModel, UserModel } from "../models/UserModel";
import { store } from "../utils/reduxStore";
import { login } from "../utils/authSlice";

type cloudinaryImgRes = {
  url: string;
};

const postImgEndpoint =
  "https://api.cloudinary.com/v1_1/dnlv6fy3z/image/upload";
const registerEndpoint = "user/register";
const loginEndpoint = "user/login";

class UserService {
  async uploadImage(image: FileList): Promise<cloudinaryImgRes> {
    const formData = new FormData();
    formData.append("file", image[0]);
    formData.append("upload_preset", "messenger"); // put it in .env
    formData.append("cloud_name", "dnlv6fy3z"); // put it in .env
    const { data } = await axios.post(postImgEndpoint, formData);
    return data;
  }

  async register(user: UserModel) {
    console.log(registerEndpoint);
    const { data } = await axios.post<string>(
      apiConfig.BASE_URL + registerEndpoint,
      user
    );
    store.dispatch(login(data));
  }

  async login(credentials: CredentialsModel) {
    const { data } = await axios.post<string>(
      apiConfig.BASE_URL + loginEndpoint,
      credentials
    );
    store.dispatch(login(data));
  }
}

export const userService = new UserService();
