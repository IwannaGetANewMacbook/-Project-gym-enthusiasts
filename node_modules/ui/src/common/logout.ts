import axios, { AxiosError } from 'axios';

export const logout = (path: string) => {
  const env = import.meta.env;
  if (confirm('정말 로그아웃 하시겠습니까?')) {
    axios
      .post(`${env.VITE_HOST}/auth/logout`, {}, { withCredentials: true })
      .then((r) => {
        console.log(r.data);

        // localStorage에서 accessToken/user 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        // 로그아웃 후 원하는 경로로 이동
        location.replace(`${path}`);
      })
      .catch((e: AxiosError) => {
        console.log(e.message);
        alert('로그아웃 요청이 실패했습니다.');
      });
  }
};
