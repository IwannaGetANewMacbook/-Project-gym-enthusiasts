import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

export function Registraion() {
  const env = import.meta.env;
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');

  const onClickForSignUp = () => {
    axios
      .post(`${env.VITE_HOST}/auth/register/email`, {
        email: email,
        password: password,
        nickname: nickname,
      })
      .then((r) => {
        console.log(r.data);
        localStorage.setItem('accessToken', r.data.accessToken);
        localStorage.setItem('user', JSON.stringify(r.data.user));
        alert(`${nickname}님 가입을 환영합니다!`);
        navigate('/');
      })
      .catch((e) => {
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

          <Form.Group
            as={Row}
            className='mb-3'
            controlId='formHorizontalPassword'
          >
            <Form.Label column sm={2}>
              nickname
            </Form.Label>
            <Col sm={5}>
              <Form.Control
                type='text'
                placeholder='nickname'
                onChange={(e) => {
                  setNickname(e.currentTarget.value);
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
                variant='success'
                style={{ marginRight: '20px' }}
                onClick={() => {
                  onClickForSignUp();
                }}
              >
                Sign up
              </Button>
            </Col>
          </Form.Group>
        </Form>
      </Row>
    </Container>
  );
}