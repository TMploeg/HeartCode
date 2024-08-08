import LoginData from "../models/LoginData";
import LoginResponse from "../models/LoginResponse";
import RegisterData from "../models/RegisterData";
import useApi from "./useApi";
import useToken from "./useToken";

export default function useAuthentication() {
  const { post } = useApi();
  const { setToken } = useToken();

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

  return {
    register,
    login,
  };
}
