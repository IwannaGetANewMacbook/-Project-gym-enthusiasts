export const checkAccessTokenBeforeRendering = (
  accessToken: string | null
): void => {
  if (!accessToken) {
    alert('토큰이 없습니다. 로그인 해 주십시오');
    window.localStorage.clear();
    window.location.replace('/auth/login/email');
  }
};
