import RegisterData from "../models/RegisterData";
import useApi from "./useApi";

export default function useAuthentication() {
  const { post } = useApi();

  function register(registerData: RegisterData) {
    return post("users/register", registerData);
    // .catch((error) => {
    // alert(error.response.data);
    // return Promise.reject(error.response.data);
    // });
  }

  return {
    register,
  };
}
