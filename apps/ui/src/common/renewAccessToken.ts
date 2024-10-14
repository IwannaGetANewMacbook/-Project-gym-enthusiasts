import axios from 'axios';

export async function newAccessToken() {
  const env = import.meta.env;
  axios.defaults.withCredentials = true;
  try {
    const response = await axios.post(`${env.VITE_HOST}/auth/token/access`);
    return response.data.accessToken;
  } catch (e) {
    console.log('accessToken 갱신중 에러', e);
    return null; // 명시적으로 null 또는 기본값을 반환
  }
}
