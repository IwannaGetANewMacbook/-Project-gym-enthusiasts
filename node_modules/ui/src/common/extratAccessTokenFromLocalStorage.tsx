export type AccessTokenFromLocalStorage = string;

export function extractAccessTokenFromLocalStorage(): AccessTokenFromLocalStorage | null {
  return window.localStorage.getItem('accessToken');
}
