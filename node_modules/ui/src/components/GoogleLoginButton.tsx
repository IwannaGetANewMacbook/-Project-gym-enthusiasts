/**
 * GoogleOAuthProvider: 내부에 Google 로그인 기능을 사용할 수 있도록 전역 환경 설정을 해주는 컨테이너
 * GoogleLogin: 실제로 로그인 버튼을 만들어주는 컴포넌트입니다.
 */

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../common/api';
const env = import.meta.env;

export const GoogleLoginButton = () => {
  const clientId = env.VITE_GOOGLE_CLIENT_ID || '';

  const handleGoogleLoginSuccess = async (response: any) => {
    console.log('Google Login Success:', response);
    // 사용자가 google 로그인에 성공하면 "response.credential"에 JWT 형태의 ID Token이 담겨있음.
    // 이 ID Token을 백엔드에 전달해서 유저인증을 진행.
    try {
      const { data } = await api.post('/auth/google/callback', {
        // 백엔드로 ID 토큰을 전송해서, 서버에서 검증 및 사용자 식별
        token: response.credential,
      });
      console.log('서버 응답: ', data);
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin
        // 구글 로그인 성공시 onSucess 콜백 함수 호출
        onSuccess={handleGoogleLoginSuccess}
        // 구글 로그인 실패시 onError 콜백 함수 호출
        onError={() => console.log('Google Login Error')}
      ></GoogleLogin>
    </GoogleOAuthProvider>
  );
};
