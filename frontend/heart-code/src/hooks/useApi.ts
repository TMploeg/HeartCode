import axios from "axios";

export default function useApi() {
  function get<TResponse>(url: string) {
    return axios.get<TResponse>(import.meta.env.VITE_API_URL + url);
  }

  return {
    get,
  };
}
