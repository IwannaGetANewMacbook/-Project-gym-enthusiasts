import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function Login() {
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const env = import.meta.env;

  const onClickForLogin = () => {
    const encoded = Buffer.from(`${email}:${password}`).toString('base64');

    axios
      .post(
        `${env.VITE_HOST}/auth/login/email`,
        {},
        {
          headers: {
            Authorization: `Basic ${encoded}`,
            'Content-Type': 'application/json',
          },
        }
      )
      .then((r) => {
        console.log(r.data);
        localStorage.setItem('accessToken', r.data.accessToken);
        localStorage.setItem('user', JSON.stringify(r.data.user));
        navigate('/');
      })
      .catch((e) => {
        console.log(e);
        alert(e.response?.data.message);
        window.location.reload();
      });
  };

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
                  setEmail(e.currentTarget.value);
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
                  setPassword(e.currentTarget.value);
                }}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className='mb-3' controlId='formHorizontalCheck'>
            <Col sm={{ span: 10, offset: 2 }}>
              <Form.Check label='Remember me' />
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
        </Form>
      </Row>
    </Container>
  );
}
