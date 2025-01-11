import { Navigate } from 'react-router-dom';
import { extractAccessTokenFromLocalStorage } from '../common/extratAccessTokenFromLocalStorage';

interface AuthRedirectProps {
  children: React.ReactNode; // children을 명시적으로 선언.
  redirectTo: string; // 리다이렉트할 경로를 명시적으로 선언.
}

export function AuthRedirect({ children, redirectTo }: AuthRedirectProps) {
  const accessToken = extractAccessTokenFromLocalStorage();

  // 로그인 상태라면 특정 경로로 리다이렉트
  if (accessToken) {
    return <Navigate to={redirectTo} replace />;
  }

  // 로그인 상태가 아니면 children을 렌더링

  return <>{children}</>;
}
