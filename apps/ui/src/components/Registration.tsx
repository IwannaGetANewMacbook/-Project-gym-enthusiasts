import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import api from '../common/api';
import defaultProfile from '../assets/defaultUserProfile.jpg';
import { LoadingSpinner } from './LoadingSpinner';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function Registraion() {
  const env = import.meta.env;
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [nickname, setNickname] = useState('');

  const [loading, setLoading] = useState<boolean>(false);

  const formData = new FormData();

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

      formData.append('image', defaultFile);

      const result = await api.put(
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
