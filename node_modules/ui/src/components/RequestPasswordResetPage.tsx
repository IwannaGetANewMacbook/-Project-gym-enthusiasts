import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { emailRegex } from '../common/regex';

export function RequestPasswordResetPage() {
  const env = import.meta.env;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [isEmailValid, setIsEmailValid] = useState(false);

  const [loading, setLoading] = useState(false);

  const [isRequested, setIsRequested] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value.trim();
    setEmail(value);

    setIsEmailValid(emailRegex.test(value));
  };

  const handleRequestReset = async () => {
    if (!email || !isEmailValid) return;

    try {
      setLoading(true);

      await axios.post(`${env.VITE_HOST}/auth/email/request-password-reset`, {
        email: email,
      });

      alert('비밀번호 재설정 메일을 전송했습니다. 이메일을 확인해 주세요.');

      // 요청 완료 후 이메일 입력 초기화.
      setEmail('');
      setIsEmailValid(false);

      // 비밀번호 재설정 메일이 전송 성공하면, 요청버튼 비활성화 처리.
      setIsRequested(true);
    } catch (error: any) {
      console.error('비밀번호 재설정 요청 실패: ', error);
      alert(error.response?.data.message || '요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // StorageEvent 리스너 등록 → 다른 탭에서 reset 성공 시 로그인 페이지로 이동
  useEffect(() => {
    const handleStorageEvent = (event: StorageEvent) => {
      if (event.key === 'resetPasswordSuccess' && event.newValue === 'true') {
        localStorage.removeItem('resetPasswordSuccess'); // 재사용 방지
        navigate('/auth/login/email');
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    // 이 페이지가 언마운트 될 때 clean-up함수로 'storage event' 정리.
    return () => window.removeEventListener('storage', handleStorageEvent);
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        <Col xs={12} md={6}>
          <h2 className='text-center mb-4'>비밀번호 재설정 요청</h2>
          <Form>
            {!isRequested ? (
              <Form.Group controlId='formEmail' className='mb-3'>
                <Form.Label>이메일 주소</Form.Label>
                <Form.Control
                  type='email'
                  placeholder='이메일을 입력하세요'
                  value={email}
                  onChange={handleEmailChange}
                  isInvalid={!isEmailValid && email.length > 0}
                  isValid={isEmailValid && email.length > 0}
                />
                {!isEmailValid && email.length > 0 && (
                  <div className='text-danger small mt-2'>
                    이메일 형식이 올바르지 않습니다.
                  </div>
                )}
                {isEmailValid && email.length > 0 && (
                  <div className='text-success small mt-2'>
                    사용가능한 이메일 형식입니다.
                  </div>
                )}
              </Form.Group>
            ) : null}

            <Button
              variant='primary'
              onClick={handleRequestReset}
              disabled={!isEmailValid || isRequested}
              className='w-100 mt-2'
            >
              {isRequested
                ? '메일이 전송되었습니다'
                : '비밀번호 재설정 메일 보내기'}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
