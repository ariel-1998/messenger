class AuthService {
  register = jest.fn().mockResolvedValue("tokenString");
  login = jest.fn().mockResolvedValue("tokenString");
  logout = jest.fn();
}

export const authService = new AuthService();
