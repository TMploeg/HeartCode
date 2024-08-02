import axios from "axios";

export default function useApi() {
  function get<TResponse>(url: string) {
    return axios.get<TResponse>(convertUrl(url));
  }

  function post<TResponse, TBody>(url: string, body: TBody) {
    return axios.post<TResponse>(convertUrl(url), body);
  }

  return {
    get,
    post,
  };
}

function convertUrl(url: string) {
  return import.meta.env.VITE_API_URL + url;
}
