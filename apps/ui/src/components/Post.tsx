import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import defaultProfile from '../assets/No-photo.jpg';

import Form from 'react-bootstrap/Form';
import axios from 'axios';
import api from '../common/api';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function Post() {
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem('accessToken');
  const env = import.meta.env;

  const [imageFile, setimageFile] = useState<File | null>(null);

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const handleImgForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setimageFile(e.currentTarget.files[0]);
  };

  const handleTitleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleContentForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.currentTarget.value);
  };

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  return (
    <div className='post-container'>
      <Card className='post-card'>
        <Form.Group controlId='formFileMultiple' className='mb-3'>
          <Form.Label>사진을 올려주세요.</Form.Label>
          <Form.Control type='file' multiple onChange={handleImgForm} />
        </Form.Group>
        {/* <Card.Img variant='top' src='holder.js/100px180?text=Image cap' /> */}
        <Card.Title>
          <Form.Control
            as='textarea'
            placeholder='제목을 입력해 주세요.'
            onChange={handleTitleForm}
          />
        </Card.Title>
        <Card.Body>
          <Form.Control
            as='textarea'
            placeholder='내용을 입력해 주세요.'
            style={{ height: '300px' }}
            onChange={handleContentForm}
          />
        </Card.Body>
      </Card>
      <Button
        className='post-button'
        variant='dark'
        type='button'
        onClick={() => {
          // if a user doesn't upload imgFile, automatically upload defalut imgFile.
          if (!imageFile) {
            // fetch default image and set it to imageFile state, then post
            fetch(defaultProfile)
              .then((res) => res.blob())
              .then((blob) => {
                const defaultFile = new File([blob], 'defaultProfile.jpg', {
                  type: blob.type,
                });
                setimageFile(defaultFile);

                // Create the form data and post immediately after setting the default image
                const formData = new FormData();
                formData.append('title', title);
                formData.append('content', content);
                formData.append('image', defaultFile);

                api
                  .post(`${env.VITE_HOST}/posts`, formData, {
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                    },
                  })
                  .then((r) => {
                    console.log(r.data);
                    alert('포스팅 완료!');
                    navigate('/');
                  })
                  .catch((e) => {
                    if (e.response.status === 401) {
                      alert(
                        '세션이 만료되었거나 토큰이 없습니다\n 다시 로그인 해주세요.'
                      );
                      navigate('/auth/login/email');
                      return;
                    }
                    console.log(e.response?.data.message);
                    alert(e.response?.data.message);
                    window.location.reload();
                  });
              })
              .catch((error) =>
                console.error('Error fetching default profile image:', error)
              );
          } else {
            // If imageFile exists, directly post
            const formData = new FormData();
            formData.append('title', title);
            formData.append('content', content);
            formData.append('image', imageFile);

            api
              .post(`${env.VITE_HOST}/posts`, formData, {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .then((r) => {
                console.log(r.data);
                alert('포스팅 완료!');
                navigate('/');
              })
              .catch((e) => {
                if (e.response.status === 401) {
                  alert(
                    '세션이 만료되었거나 토큰이 없습니다\n 다시 로그인 해주세요.'
                  );
                  navigate('/auth/login/email');
                  return;
                }
                console.log(e.response?.data.message);
                alert(e.response?.data.message);
                window.location.reload();
              });
          }
        }}
      >
        Post
      </Button>
    </div>
  );
}
