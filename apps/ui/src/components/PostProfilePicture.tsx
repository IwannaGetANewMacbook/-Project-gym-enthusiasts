import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Form,
  Row,
  Col,
  Image,
  Container,
} from 'react-bootstrap';
import defaultProfile from '../assets/defaultUserProfile.jpg';

import axios from 'axios';
import api from '../common/api';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { LoadingSpinner } from './LoadingSpinner';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function PostProfilePicture() {
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem('accessToken');
  const env = import.meta.env;

  const [loading, setLoading] = useState<boolean>(false);

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImgForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePost = () => {
    // if a user doesn't upload imgFile, automatically upload default imgFile.
    if (!imageFile) {
      fetch(defaultProfile)
        .then((res) => res.blob())
        .then((blob) => {
          const defaultFile = new File([blob], 'defaultProfile.jpg', {
            type: blob.type,
          });
          setImageFile(defaultFile);

          // Create the form data and post immediately after setting the default image.
          const formData = new FormData();
          formData.append('image', defaultFile);

          submitPost(formData);
        })
        .catch((error) =>
          console.log('Error fetching default profile image: ', error)
        );
    }
    // If a user uploads their imageFile, directly post.
    else {
      const formData = new FormData();
      formData.append('image', imageFile);
      submitPost(formData);
    }
  };

  const submitPost = (formData: FormData) => {
    setLoading(true);
    api
      .post(`${env.VITE_HOST}/users/profile`, formData, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((r) => {
        console.log(r.data);
        alert('포스팅 완료!');
        setLoading(false);
        navigate('/');
      })
      .catch((e) => {
        if (e.response.status === 401) {
          alert('세션이 만료되었거나 토큰이 없습니다\n다시 로그인 해주세요.');
          navigate('/auth/login/email');
          return;
        }
        console.log(e.response?.data.message);
        alert(e.response?.data.message);
        window.location.reload();
      });
  };

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <Container className='my-5'>
      <h1>유저 프로필 이미지 전송 테스트 페이지</h1>
      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={6}>
          <Card className='shadow-sm'>
            <Card.Body>
              <Form>
                <Form.Group controlId='formFileMultiple' className='mb-3'>
                  <Form.Label>사진을 올려주세요.</Form.Label>
                  <Form.Control type='file' multiple onChange={handleImgForm} />
                </Form.Group>
                {imagePreview && (
                  <div className='text-center mb-3'>
                    <Image src={imagePreview} alt='Preview' fluid rounded />
                  </div>
                )}
                <div className='d-grid'>
                  <Button variant='primary' type='button' onClick={handlePost}>
                    Post
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
