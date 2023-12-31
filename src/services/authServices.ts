import { CredentialsModel, UserModel } from "../models/UserModel";
import { store } from "../utils/reduxStore";
import { login, logout } from "../utils/authSlice";
import { defaultAxios } from "../utils/axiosInterceptors";

const registerEndpoint = "auth/register";
const loginEndpoint = "auth/login";

class AuthService {
  async register(user: UserModel) {
    const { data } = await defaultAxios.post<string>(registerEndpoint, user);
    store.dispatch(login(data));
  }

  async login(credentials: CredentialsModel) {
    const { data } = await defaultAxios.post<string>(
      loginEndpoint,
      credentials
    );
    store.dispatch(login(data));
  }

  logout() {
    store.dispatch(logout());
  }
}

export const authService = new AuthService();
