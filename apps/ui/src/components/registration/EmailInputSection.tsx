import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import React from 'react';

interface EmailInputSectionProps {
  email: string;
  isEmailValid: boolean;
  isEmailVerified: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // ✅ 함수 그대로 넘김
  onRequestVerification: () => void;
}

export function EmailInputSection({
  email,
  isEmailValid,
  isEmailVerified,
  onEmailChange,
  onRequestVerification,
}: EmailInputSectionProps) {
  const showInvalid = !isEmailVerified && !isEmailValid && email.length > 0;
  const showValid = !isEmailVerified && isEmailValid && email.length > 0;

  return (
    <Form.Group as={Row} className='mb-3' controlId='formHorizontalEmail'>
      <Form.Label column sm={2}>
        Email
      </Form.Label>
      <Col sm={5}>
        <Form.Control
          type='email'
          placeholder='Email'
          value={email}
          onChange={onEmailChange} // ✅ 그냥 부모 함수 그대로 씀
          isInvalid={showInvalid}
          isValid={showValid}
        />
        {showInvalid && (
          <Form.Control.Feedback type='invalid'>
            <i className='bi bi-exclamation-circle me-1'>
              이메일 형식이 올바르지 않습니다.
            </i>
          </Form.Control.Feedback>
        )}
        {showValid && (
          <Form.Control.Feedback type='valid'>
            사용가능한 이메일 형식입니다.
            <br />
            이메일 인증하기 버튼을 눌러주세요.
          </Form.Control.Feedback>
        )}
      </Col>
      <Col sm={{ span: 10, offset: 2 }}>
        {!isEmailVerified ? (
          <Button
            variant='outline-info'
            size='sm'
            disabled={!isEmailValid}
            onClick={onRequestVerification}
          >
            이메일 인증하기
          </Button>
        ) : (
          <Alert
            variant='success'
            className='d-inline-block py-2 px-3 mt-2 mb-0'
          >
            <i className='bi bi-check-circle-fill me-2'></i>
            이메일 인증이 완료되었습니다.
          </Alert>
        )}
      </Col>
    </Form.Group>
  );
}
