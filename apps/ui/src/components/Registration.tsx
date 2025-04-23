import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import api from '../common/api';
import defaultProfile from '../assets/defaultUserProfile.jpg';
import { LoadingSpinner } from './LoadingSpinner';
import { TermsAgreement } from './registration/TermsAgreement';
import { ConfirmPasswordInput } from './registration/ConfirmPasswordInput';
import { EmailInputSection } from './registration/EmailInputSection';
import { NicknameInputSection } from './registration/NicknameInputSection';
import { PasswordInputSection } from './registration/PasswordInputSection';
import { SubmitButton } from './registration/SubmitButton';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function Registraion() {
  const env = import.meta.env;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordValid, setIsPasswordValid] = useState(true); // 비밀번호 형식이 맞는지 아닌지 체크.
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const [nickname, setNickname] = useState('');
  const [isNicknameValid, setIsNicknameValid] = useState(true); // 닉네임 형식이 맞는지 아닌지 체크.
  const [isNicknameChecked, setIsNicknameChecked] = useState(false);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');

  const [loading, setLoading] = useState<boolean>(false);

  // email 인증을 위한 state관라.
  const [isEmailValid, setIsEmailValid] = useState(false);

  // email 인증 완료 여부 추적.
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  /**
   * 이용약관 및 개인정보 처리방침 동의 체크박스 상태 관리.
   */
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  const formData = new FormData();

  useEffect(() => {
    // 이메일 인증 상태를 로컬 스토리지에서 가져와서 상태를 업데이트.
    // 초기 상태 확인(isEmailVerified) 및 페이지 새로고침 시에도 상태를 유지하기 위함.
    const stored = localStorage.getItem('isEmailVerified');
    setIsEmailVerified(stored === 'true' ? true : false);

    // ✅ 다른 탭에서 localStorage 변경 시 이벤트 리스너를 통해 상태 업데이트.
    const handleStorageChage = (event: StorageEvent) => {
      if (event.key === 'isEmailVerified' && event.newValue === 'true') {
        setIsEmailVerified(true);
      }
    };

    // handleStorageChage 이벤트 리스너 등록.
    window.addEventListener('storage', handleStorageChage);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거.
      window.removeEventListener('storage', handleStorageChage);
    };
  }, []);

  /**
   * 비밀번호 확인 및 일치 여부 체크.
   */
  useEffect(() => {
    setIsPasswordMatch(password === confirmPassword);
  }, [password, confirmPassword]);

  const onClickForSignUp = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${env.VITE_HOST}/auth/register/email`,
        {
          email: email,
          password: password,
          nickname: nickname,
        }
      );

      console.log(response.data);
      localStorage.setItem('accessToken', response.data.accessToken);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      alert(`${nickname}님 가입을 환영합니다!`);

      // 프로필 업로드가 실패해도 다음 코드가 실행되도록 함.
      await uploadDefaultProfilePic();

      // 회원가입 후 로컬스토리지에 저장된 isEmailVerified 제거.
      localStorage.removeItem('isEmailVerified');

      navigate('/');
    } catch (e: any) {
      console.log('회원가입 중 오류 발생: ', e);
      alert(e.response?.data.message);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  const uploadDefaultProfilePic = async () => {
    try {
      const response = await fetch(defaultProfile);
      const blob = await response.blob();
      const defaultFile = new File([blob], 'defaultProfile.jpg', {
        type: blob.type,
      });

      formData.append('images', defaultFile);

      const result = await api.post(
        `/users/updateUserProfilePicture`,
        formData,
        {}
      );

      console.log('기본프사 설정 완료!', result.data);
    } catch (e) {
      console.log(
        '회원가입 프로세스 진행 중 기본프사 설정 프로세스에서 발생한 에러: ',
        e
      );
      alert(
        '기본 프로필 이미지를 설정하는 중 오류가 발생했습니다. 나중에 프로필 페이지에서 변경해 주세요.'
      );
    }
  };

  /**
   * 이메일 형식 체크 및 인증 버튼 활성화.
   */
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    setEmail(value);

    // 정규 표현식을 사용하여 이메일 형식 체크
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(value));
  };

  /**
   * 이메일 인증 요청 함수
   */
  const requestEmailVerification = async () => {
    try {
      setLoading(true);
      const res = await api.post('/mail/request-verification', {
        email: email,
      });
      alert(res.data.message);
    } catch (error: any) {
      alert(error.response?.data.message || '이메일 인증 요청 실패.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 비밀번호 입력 시 유효성 검사
   */
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    setPassword(value);

    // 정규 표현식을 사용하여 비밀번호 형식 체크 (최소 8자, 영문자+숫자 조합)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    setIsPasswordValid(passwordRegex.test(value)); // 비밀번호 유효성 체크
  };

  /**
   * 닉네임 입력 시 유효성 검사
   * (중복체크 상태 초기화, 중복체크 메시지 상태 초기화, 닉네임 정규식 체크)
   */
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    setNickname(value);

    /**
     * 정규 표현식을 사용하여 닉네임 형식 체크
     * (2~12자, 숫자만으로 이루어지지 않음, 한글 및 영문 대소문자 포함)
     */
    const nicknameRegex = /^(?!\d+$)[a-zA-Z0-9가-힣]{2,12}$/;
    setIsNicknameValid(nicknameRegex.test(value)); // 닉네임 유효성 체크

    setIsNicknameChecked(false); // 중복 체크 초기화
    setNicknameCheckMessage(''); // 메시지 초기화
  };

  /**
   * 닉네임 중복 체크 요청 함수
   */
  const checkNicknameDuplicate = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/auth/check-nickname?nickname=${nickname}`);

      if (res.data.isAvailable) {
        setIsNicknameChecked(true);
        setNicknameCheckMessage('사용 가능한 닉네임 입니다.');
      } else {
        setIsNicknameChecked(false);
        setNicknameCheckMessage('이미 사용 중인 닉네임 입니다.');
      }
    } catch (error: any) {
      setIsNicknameChecked(false);
      setNicknameCheckMessage('닉네임 중복 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <LoadingSpinner excuse={2}></LoadingSpinner>
      </>
    );
  }

  return (
    <Container>
      <Row>
        <Form>
          {/* 이메일 */}
          <EmailInputSection
            email={email}
            isEmailValid={isEmailValid}
            isEmailVerified={isEmailVerified}
            onEmailChange={handleEmailChange} // ✅ 기존에 정의해둔 함수 그대로 넘김
            onRequestVerification={requestEmailVerification}
          />

          {/* 비밀번호 */}
          <PasswordInputSection
            password={password}
            isPasswordValid={isPasswordValid}
            onPasswordChange={handlePasswordChange}
          />

          {/* 비밀번호 확인 */}
          <ConfirmPasswordInput
            confirmPassword={confirmPassword}
            onChange={setConfirmPassword}
            isPasswordMatch={isPasswordMatch}
          />

          {/* 닉네임 */}
          <NicknameInputSection
            nickname={nickname}
            isNicknameValid={isNicknameValid}
            isNicknameChecked={isNicknameChecked}
            nicknameCheckMessage={nicknameCheckMessage}
            onNicknameChange={handleNicknameChange}
            onCheckNickname={checkNicknameDuplicate}
          />

          {/* TermsAgreement 위치 */}
          <Form.Group as={Row} className='mb-3'>
            {/* <Col sm={{ span: 10, offset: 2 }}> */}
            <TermsAgreement
              termsAgreed={termsAgreed}
              privacyAgreed={privacyAgreed}
              onTermsChange={setTermsAgreed}
              onPrivacyChange={setPrivacyAgreed}
            />
            {/* </Col> */}
          </Form.Group>

          {/* 회원가입 버튼 */}
          <SubmitButton
            onSubmit={onClickForSignUp}
            isEmailVerified={isEmailVerified}
            disabled={
              !isEmailVerified ||
              !password ||
              !confirmPassword ||
              !isPasswordMatch ||
              !nickname ||
              !isEmailValid ||
              !isNicknameChecked ||
              !isNicknameValid ||
              !isPasswordValid ||
              !termsAgreed ||
              !privacyAgreed
            }
          />
        </Form>
      </Row>
    </Container>
  );
}
