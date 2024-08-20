const TOKEN_STORAGE_LOCATION = "JWT";

export default function useToken() {
  function getToken(): string | null {
    return sessionStorage.getItem(TOKEN_STORAGE_LOCATION);
  }
  function setToken(token: string) {
    sessionStorage.setItem(TOKEN_STORAGE_LOCATION, token);
  }
  function clearToken() {
    sessionStorage.removeItem(TOKEN_STORAGE_LOCATION);
  }

  return { getToken, setToken, clearToken };
}
