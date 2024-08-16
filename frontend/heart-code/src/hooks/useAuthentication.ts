import LoginData from "../models/LoginData";
import LoginResponse from "../models/LoginResponse";
import RegisterData from "../models/RegisterData";
import useApi from "./useApi";
import useToken from "./useToken";

export default function useAuthentication() {
  const { get, post } = useApi();
  const { getToken, setToken, clearToken } = useToken();

  function register(registerData: RegisterData) {
    return post<LoginResponse, RegisterData>(
      "users/register",
      registerData
    ).then((response) => handleLoginResponse(response.data));
  }

  function login(loginData: LoginData) {
    return post<LoginResponse, LoginData>("users/login", loginData).then(
      (response) => handleLoginResponse(response.data)
    );
  }

  function handleLoginResponse(loginResponse: LoginResponse) {
    setToken(loginResponse.token);
  }

  function isLoggedIn(): Promise<boolean> {
    const token: string | null = getToken();
    if (token === null) {
      return Promise.resolve(false);
    }

    return get<boolean>("users/validate-token", { token })
      .then((response) => response.data)
      .catch(() => {
        return false;
      })
      .then((isValid) => {
        if (!isValid) {
          clearToken();
        }

        return isValid;
      });
  }

  return {
    register,
    login,
    isLoggedIn,
  };
}
