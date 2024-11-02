import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Button, Form, Row, Col, Container } from 'react-bootstrap';
import api from '../common/api';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { LoadingSpinner } from './LoadingSpinner';

export function EditPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem('accessToken');
  const user = JSON.parse(window.localStorage.getItem('user'));

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const [image, setImage] = useState('');

  const [loading, setLoading] = useState(true);

  // 수정을 원하는 post의 데이터를 불러오는 useEffect 함수
  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await api.get(`/posts/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const post = response.data;

        // 해당 post의 author과 localStorage에 저장된 userNickname 이 일치하지 않다면 권한 없음!
        if (post.author.nickname !== user.userNickname) {
          alert('403 Forbidden\n권한이 없음.');
          navigate('/');
          return;
        }

        setTitle(post.title);
        setContent(post.content);
        setImage(post.images[0]);
      } catch (e) {
        console.error('게시물을 불러오는 중 오류 발생', e);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    // fetchPostData 함수 호출
    fetchPostData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleTitleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleContentForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.currentTarget.value);
  };

  // html 렌더링 전 accessToken 유무검사
  checkAccessTokenBeforeRendering(accessToken);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <Container className='my-5'>
      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={6}>
          <Card className='shadow-sm'>
            <div className='cardImgContainer'>
              {image ? (
                <Card.Img
                  variant='top'
                  src={`${import.meta.env.VITE_HOST}${image}`}
                  className='cardImg'
                />
              ) : (
                <p>No image available</p>
              )}
            </div>
            <Card.Body>
              <Form>
                <Form.Group className='mb-3'>
                  <Form.Label>제목</Form.Label>
                  <Form.Control
                    type='text'
                    value={title}
                    placeholder='제목을 입력해 주세요.'
                    onChange={handleTitleForm}
                  />
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>내용</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={5}
                    value={content}
                    placeholder='내용을 입력해 주세요.'
                    onChange={handleContentForm}
                  />
                </Form.Group>
                <div className='d-grid'>
                  <Button
                    variant='primary'
                    type='button'
                    onClick={() => {
                      const updateData = {
                        title: title,
                        content: content,
                      };

                      api
                        .patch(`/posts/${postId}`, updateData, {
                          headers: {
                            Authorization: `Bearer ${accessToken}`,
                          },
                        })
                        .then((r) => {
                          console.log(r.data);
                          alert('업데이트 완료!');
                          navigate(-1);
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
                        });
                    }}
                  >
                    Edit Post
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
