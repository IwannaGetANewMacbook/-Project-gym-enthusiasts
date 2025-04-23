/**
 *
 */
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import React from 'react';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';

interface PasswordInputSectionProps {
  password: string;
  isPasswordValid: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function PasswordInputSection({
  password,
  isPasswordValid,
  onPasswordChange,
}: PasswordInputSectionProps) {
  const showInvalid = !isPasswordValid && password.length > 0;
  const showValid = isPasswordValid && password.length > 0;

  return (
    <Form.Group as={Row} className='mb-3' controlId='formHorizontalPassword'>
      <Form.Label column sm={2}>
        Password
      </Form.Label>
      <Col sm={5}>
        <Form.Control
          type='password'
          placeholder='Password'
          value={password}
          onChange={onPasswordChange}
          isInvalid={showInvalid}
          isValid={showValid}
        />
        <Form.Control.Feedback type='invalid'>
          비밀번호는 최소 8자 이상, 영문자와 숫자를 포함해야 합니다.
        </Form.Control.Feedback>
        <Form.Control.Feedback type='valid'>
          사용 가능한 비밀번호입니다.
        </Form.Control.Feedback>

        {/* 비밀번호 강도 표시 */}
        <PasswordStrengthMeter password={password} />
      </Col>
    </Form.Group>
  );
}
