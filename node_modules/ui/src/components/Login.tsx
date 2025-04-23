import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LoadingSpinner } from './LoadingSpinner';
import { GoogleLoginButton } from './GoogleLoginButton';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function Login() {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const env = import.meta.env;

  const [loading, setLoading] = useState<boolean>(false);

  const onClickForLogin = async () => {
    const encoded = btoa(`${email}:${password}`);

    try {
      setLoading(true);
      const result = await axios.post(
        `${env.VITE_HOST}/auth/login/email`,
        {},
        {
          headers: {
            Authorization: `Basic ${encoded}`,
            'Content-Type': 'application/json',
          },
        }
      );

      // result 를 받아오면 localStorage에 accessToken과 user정보를 저장.
      localStorage.setItem('accessToken', result.data.accessToken);
      localStorage.setItem('user', JSON.stringify(result.data.user));

      navigate('/');
    } catch (e: any) {
      console.log(e);
      alert(e.response?.data.message || '로그인 중 에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 데이터를 로딩 중인 경우 로딩 메시지 표시
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <Container>
      <Row>
        <Form>
          <Form.Group as={Row} className='mb-3' controlId='formHorizontalEmail'>
            <Form.Label column sm={2}>
              Email
            </Form.Label>
            <Col sm={5}>
              <Form.Control
                type='email'
                placeholder='Email'
                onChange={(e) => {
                  setEmail(e.currentTarget.value.trim());
                }}
              />
            </Col>
          </Form.Group>

          <Form.Group
            as={Row}
            className='mb-3'
            controlId='formHorizontalPassword'
          >
            <Form.Label column sm={2}>
              Password
            </Form.Label>
            <Col sm={5}>
              <Form.Control
                type='password'
                placeholder='Password'
                onChange={(e) => {
                  setPassword(e.currentTarget.value.trim());
                }}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className='mb-3'>
            <Col sm={{ span: 10, offset: 2 }}>
              <Button
                type='button'
                variant='primary'
                style={{ marginRight: '20px' }}
                onClick={() => {
                  onClickForLogin();
                }}
                disabled={!email || !password}
              >
                Sign in
              </Button>
              <Button
                variant='success'
                type='button'
                onClick={() => {
                  navigate('/auth/register/email');
                }}
              >
                Go to sign Up
              </Button>
            </Col>
          </Form.Group>
          {/* ✅ 구글 로그인 버튼 추가 영역 */}
          <Form.Group as={Row} className='mt-4'>
            <Col sm={{ span: 5, offset: 2 }}>
              <hr />
              <GoogleLoginButton />
            </Col>
          </Form.Group>
        </Form>
      </Row>
    </Container>
  );
}
