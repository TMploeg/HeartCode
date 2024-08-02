import RegisterData from "../models/RegisterData";
import useApi from "./useApi";

export default function useAuthentication() {
  const { post } = useApi();

  function register(registerData: RegisterData) {
    return post("users/register", registerData);
  }

  return {
    register,
  };
}
