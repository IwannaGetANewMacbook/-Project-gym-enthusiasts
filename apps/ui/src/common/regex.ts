// src/common/regex.ts

/**
 * 비밀번호는 최소 8자 이상, 영문자, 숫자, 특수문자가 모두 최소 1개 이상 포함
 */
export const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * 이메일 형식 검사 정규식
 */
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * 비밀번호 에러 메시지
 */
export const passwordErrorMessage =
  '비밀번호는 최소 8자 이상, 영문자와 숫자, 하나 이상의 특수문자를 포함해야 합니다.';
