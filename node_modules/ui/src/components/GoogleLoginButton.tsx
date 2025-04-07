/**
 * GoogleOAuthProvider: 내부에 Google 로그인 기능을 사용할 수 있도록 전역 환경 설정을 해주는 컨테이너
 * GoogleLogin: 실제로 로그인 버튼을 만들어주는 컴포넌트입니다.
 */

import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import api from '../common/api';

export const GoogleLoginButton = () => {
  const env = import.meta.env;
  const navigate = useNavigate();

  const clientId = env.VITE_GOOGLE_CLIENT_ID || '';

  const handleGoogleLoginSuccess = async (response: any) => {
    console.log('Google Login Success:', response);
    // 사용자가 google 로그인에 성공하면 구글서버가 "response.credential"에 JWT 형태의 ID Token이 담겨있음.
    // 이 ID Token을 백엔드에 전달해서 유저인증을 진행.
    try {
      const res = await api.post(
        '/auth/google/callback',
        { token: response.credential },
        { withCredentials: true } // 쿠키 전달을 위해 필요
      );

      console.log('🎉 서버 응답:', res.data);

      // 서버에서 응답받은 accessToken과 user 정보를 localStorage에 저장.
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/');
    } catch (error: any) {
      console.error('❌ 구글 로그인 실패:', error);
      alert(
        error?.response?.data?.message || '구글 로그인 중 문제가 발생했습니다.'
      );
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
