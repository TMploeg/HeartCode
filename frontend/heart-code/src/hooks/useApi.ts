import axios from "axios";

const API_URL = "http://localhost:8080/api/v1/";

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
