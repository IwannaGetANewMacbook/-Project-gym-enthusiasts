import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../common/api';
import { Button, Col, Container, Form, Row, Spinner } from 'react-bootstrap';
import { passwordErrorMessage, passwordRegex } from '../common/regex';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [isPasswordValid, setIsPasswordValid] = useState(true);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);

  const [loading, setLoading] = useState(false);

  const [resetSuccess, setResetSuccess] = useState(false);

  const [error, setError] = useState('');

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 입력 중 에러 초기화.
    setError('');

    const value = e.currentTarget.value.trim();
    setNewPassword(value);

    setIsPasswordValid(passwordRegex.test(value));

    // confirm 입력값이 있을 경우, 비교도 즉시 수행
    if (confirmPassword.length > 0) {
      setIsPasswordMatch(value === confirmPassword);
    }
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    // 입력 중 에러 초기화.
    setError('');

    const value = e.currentTarget.value.trim();
    setConfirmPassword(value);
    setIsPasswordMatch(value === newPassword);
  };

  const handleResetPassword = async () => {
    if (!newPassword || !isPasswordValid || !isPasswordMatch) {
      setError('유효한 비밀번호를 입력해주세요.');
      return;
    }

    try {
      setLoading(true);
      await api.patch('/auth/email/reset-password', {
        token,
        newPassword,
      });
      setResetSuccess(true);

      // Storage event를 통한 메인 탭 알림 및 현재 탭 닫기
      localStorage.setItem('resetPasswordSuccess', 'true');

      // 3초 뒤에 현재 탭 닫기.
      setTimeout(() => {
        window.close();
      }, 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || '비밀번호 재설정 실패.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container className='text-center mt-5'>
        <h3>유효하지 않은 링크입니다.</h3>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className='text-center mt-5'>
        <Spinner animation='border' />
      </Container>
    );
  }

  if (resetSuccess) {
    return (
      <Container className='text-center mt-5'>
        <h3>✅ 비밀번호가 재설정되었습니다!</h3>
        <p>3초뒤 이 창이 자동으로 닫힙니다.</p>
      </Container>
    );
  }
  return (
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        <Col md={6}>
          <h2 className='mb-4'>비밀번호 재설정</h2>
          <Form>
            {/* 새 비밀번호 */}
            <Form.Group controlId='newPassword' className='mb-3'>
              <Form.Label>새 비밀번호</Form.Label>
              <Form.Control
                type='password'
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder='새 비밀번호를 입력하세요'
                isInvalid={!isPasswordValid && newPassword.length > 0}
                isValid={isPasswordValid && newPassword.length > 0}
              />
              <Form.Control.Feedback type='invalid'>
                {passwordErrorMessage}
              </Form.Control.Feedback>
              <Form.Control.Feedback type='valid'>
                사용 가능한 비밀번호입니다.
              </Form.Control.Feedback>
            </Form.Group>

            {/* 비밀번호 확인 */}
            <Form.Group controlId='confirmPassword' className='mb-3'>
              <Form.Label>비밀번호 확인</Form.Label>
              <Form.Control
                type='password'
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder='비밀번호를 다시 입력하세요'
                isInvalid={!isPasswordMatch && confirmPassword.length > 0}
                isValid={isPasswordMatch && confirmPassword.length > 0}
              />
              <Form.Control.Feedback type='invalid'>
                비밀번호가 일치하지 않습니다.
              </Form.Control.Feedback>
              <Form.Control.Feedback type='valid'>
                비밀번호가 일치합니다.
              </Form.Control.Feedback>
            </Form.Group>

            {error && <p className='text-danger mt-2'>{error}</p>}

            <Button
              variant='success'
              className='mt-3'
              onClick={handleResetPassword}
              disabled={
                !isPasswordValid ||
                !isPasswordMatch ||
                newPassword.length === 0 ||
                confirmPassword.length === 0
              }
            >
              비밀번호 재설정
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
