import axios from "axios";
import useToken from "./useToken";

export default function useApi() {
  const { getToken } = useToken();
  function get<TResponse>(url: string, params?: any) {
    return axios.get<TResponse>(convertUrl(url), {
      params,
      headers: getHeaders(),
    });
  }

  function post<TResponse, TBody>(url: string, body: TBody) {
    return axios.post<TResponse>(convertUrl(url), body, {
      headers: getHeaders(),
    });
  }

  function patch<TResponse, TBody>(url: string, body: TBody) {
    return axios.patch<TResponse>(convertUrl(url), body, {
      headers: getHeaders(),
    });
  }

  return {
    get,
    post,
    patch,
  };

  function convertUrl(url: string) {
    return import.meta.env.VITE_API_URL + url;
  }

  function getHeaders() {
    const token: string | null = getToken();

    const headers: { [key: string]: string } = {};

    if (token !== null) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
  }
}
