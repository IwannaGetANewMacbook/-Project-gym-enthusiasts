export interface UserFromLocalStorage {
  accssToken: string;
  userNickname: string;
}

export function extractUserFromLocalStorage(): UserFromLocalStorage | null {
  const userData = window.localStorage.getItem('user');
  return userData ? JSON.parse(userData) : null;
}
