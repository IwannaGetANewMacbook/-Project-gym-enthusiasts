import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_HOST,
  withCredentials: true, // 쿠키를 자동으로 전송
});

// 응답 인터셉터 설정
api.interceptors.response.use(
  (response) => {
    // 요청이 성공한 경우, 바로 response 반환.
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 토큰이 만료된 경우 (401 Unathorized)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        // 서버에서 refreshToken을 이용해 accessToken 갱신 요청 (쿠키 사용)
        const response = await axios.post(
          `${import.meta.env.VITE_HOST}/auth/token/access`,
          {},
          {
            withCredentials: true, // 쿠키 전송
          }
        );

        // 새로운 accessToken을 로컬스토리지에 저장
        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);
        console.log('accessToken 갱신 완료');

        // 원래 요청의 Authorization 헤더 업데이트
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // 원래 요청 재시도
        return api(originalRequest);
      } catch (refreshError) {
        // 토큰 갱신 실패 시 처리 로직
        console.error('토큰 갱신에 실패했습니다.', refreshError);

        // 로그아웃 요청 보내기 (서버 측에서 refreshToken 삭제)
        try {
          await axios.post(
            `${import.meta.env.VITE_HOST}/auth/logout`,
            {},
            {
              withCredentials: true,
            }
          );
          console.log('로그아웃 요청 성공: refreshToken 삭제 완료');
        } catch (logoutError) {
          console.log('로그아웃 요청 실패', logoutError);
        }

        // 로컬 스토리지를 비우고 로인 페이지로 이동
        window.localStorage.clear();
        window.location.href = '/auth/login/email';
      }
    }
    return Promise.reject(error);
  }
);
export default api;
