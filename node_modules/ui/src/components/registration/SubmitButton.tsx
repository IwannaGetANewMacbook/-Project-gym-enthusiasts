/**
 *
 */
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

interface SubmitButtonProps {
  disabled: boolean;
  onSubmit: () => void;
  isEmailVerified: boolean;
}

export function SubmitButton({
  disabled,
  onSubmit,
  isEmailVerified,
}: SubmitButtonProps) {
  return (
    <Form.Group as={Row} className='mb-3'>
      <Col sm={{ span: 10, offset: 2 }}>
        <Button
          type='button'
          variant='success'
          style={{ marginRight: '20px' }}
          onClick={onSubmit}
          disabled={disabled}
        >
          Sign up
        </Button>
        <div className='text-danger small'>
          {!isEmailVerified && (
            <i className='bi bi-exclamation-circle me-1'>
              이메일 인증이 필요합니다.
            </i>
          )}
        </div>
      </Col>
    </Form.Group>
  );
}
