import { useNavigate } from 'react-router-dom';

export const handleTokenExpiration = (
  navigate: ReturnType<typeof useNavigate>
) => {
  alert('토큰이 만료되었습니다. 다시 로그인 해주세요.');
  window.localStorage.clear();
  navigate('/auth/login/email');
};
