import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';
import axios from 'axios';

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

  useEffect(() => {
    if (!accessToken) {
      alert(' 로그인 해 주십시오');
      navigate('/auth/login/email');
      return;
    }
    axios
      .get(`${env.VITE_HOST}/auth/checkValidToken`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((r) => {
        console.log('유효한 토큰입니다', '\n', `${r.data}`);
      })
      .catch((e) => {
        console.log(e.response?.data.message);
        alert('세션이 만료되었습니다. 다시 로그인해주세요.');
        window.localStorage.clear();
        navigate('/auth/login/email');
      });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
        position: 'relative',
        marginBottom: '100px',
      }}
    >
      <Card style={{ width: '80%' }}>
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
        style={{
          position: 'absolute',
          bottom: -50,
        }}
        variant='dark'
        type='button'
        onClick={() => {
          if (!imageFile) {
            alert('이미지를 넣어 주십시오.');
            window.location.reload();
          }

          const formData = new FormData();
          formData.append('title', title);
          formData.append('content', content);
          formData.append('image', imageFile);
          axios
            .post(
              `${env.VITE_HOST}/posts`,
              formData,

              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
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
        }}
      >
        Post
      </Button>
    </div>
  );
}
