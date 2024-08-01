import axios from "axios";

//const API_URL = "http://localhost:8080/api/v1/"";
const API_URL = "http://192.168.68.55:8080/api/v1/";

export default function useApi() {
  function get<TResponse>(url: string) {
    return axios.get<TResponse>(API_URL + url);
  }

  return {
    get,
  };
}
