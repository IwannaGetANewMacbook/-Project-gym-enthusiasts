/**
 *
 */
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

interface ConfirmPasswordInputProps {
  confirmPassword: string;
  onChange: (value: string) => void;
  isPasswordMatch: boolean;
}

export function ConfirmPasswordInput({
  confirmPassword,
  onChange,
  isPasswordMatch,
}: ConfirmPasswordInputProps) {
  return (
    <Form.Group
      as={Row}
      className='mb-3'
      controlId='formHorizontalConfirmPassword'
    >
      <Form.Label column sm={2}>
        Confirm
      </Form.Label>
      <Col sm={5}>
        <Form.Control
          type='password'
          placeholder='Confirm Password'
          value={confirmPassword}
          onChange={(e) => onChange(e.currentTarget.value)}
          isInvalid={!isPasswordMatch && confirmPassword.length > 0}
          isValid={isPasswordMatch && confirmPassword.length > 0}
        />
        <Form.Control.Feedback type='invalid'>
          비밀번호가 일치하지 않습니다.
        </Form.Control.Feedback>
        <Form.Control.Feedback type='valid'>
          비밀번호가 일치합니다.
        </Form.Control.Feedback>
      </Col>
    </Form.Group>
  );
}
