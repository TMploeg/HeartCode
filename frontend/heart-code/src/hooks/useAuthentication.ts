import { EventHandler } from "react";
import LoginData from "../models/LoginData";
import LoginResponse from "../models/LoginResponse";
import RegisterData from "../models/RegisterData";
import useApi from "./useApi";
import useToken from "./useToken";

const LOGOUT_EVENT_NAME: string = "logout";

export default function useAuthentication() {
  const logoutEvent = new Event(LOGOUT_EVENT_NAME);

  const { get, post } = useApi();
  const { getToken, setToken, clearToken } = useToken();

  function register(registerData: RegisterData) {
    return post<LoginResponse, RegisterData>(
      "auth/register",
      registerData
    ).then((response) => handleLoginResponse(response.data));
  }

  function login(loginData: LoginData) {
    return post<LoginResponse, LoginData>("auth/login", loginData).then(
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

  function logout(): void {
    clearToken();
    document.dispatchEvent(logoutEvent);
  }

  function addLogoutListener(handler: () => void): void {
    document.addEventListener(LOGOUT_EVENT_NAME, handler);
  }

  return {
    register,
    login,
    isLoggedIn,
    logout,
    addLogoutListener,
  };
}
