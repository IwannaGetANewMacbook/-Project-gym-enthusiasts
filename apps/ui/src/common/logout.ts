import axios, { AxiosError } from 'axios';

// 명시적 로그아웃 or 세션종료.
export const logout = (path: string, logoutButton: boolean) => {
  const env = import.meta.env;

  if (logoutButton) {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      axios
        .post(`${env.VITE_HOST}/auth/logout`, {}, { withCredentials: true })
        .then((r) => {
          console.log(r.data);

          // localStorage에서 accessToken/user 삭제
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          localStorage.clear();

          // 로그아웃 후 원하는 경로로 이동
          location.replace(`${path}`);
        })
        .catch((e: AxiosError) => {
          console.log(e.message);
          alert('로그아웃 요청이 실패했습니다.');
        });
    }
  } else {
    axios
      .post(`${env.VITE_HOST}/auth/logout`, {}, { withCredentials: true })
      .then((r) => {
        console.log(r.data);

        // localStorage에서 accessToken/user 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        localStorage.clear();

        // 로그아웃 후 원하는 경로로 이동
        location.replace(`${path}`);
      })
      .catch((e: AxiosError) => {
        console.log(e.message);
        alert('세션종료가 실패했습니다.');
      });
  }
};
