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
// import defaultProfile from '../assets/No-photo.jpg';
import styles from './styles/PostPosts.module.css';
import axios from 'axios';
import api from '../common/api';
import { LoadingSpinner } from './LoadingSpinner';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { extractAccessTokenFromLocalStorage } from '../common/extratAccessTokenFromLocalStorage';
import { convertImagesToJpeg } from '../common/imageConverter';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function PostPosts() {
  const navigate = useNavigate();

  const accessToken = extractAccessTokenFromLocalStorage();

  const env = import.meta.env;

  const [loading, setLoading] = useState<boolean>(false);

  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [title, setTitle] = useState('');

  const [content, setContent] = useState('');

  const [btnDisable, SetBtnDisable] = useState(false);

  /**
   * 이미지 미리보기 삭제기능
   */
  const removeImage = (index: number) => {
    const updatedFiles = imageFiles.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  const handleImgForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []);
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    /**
     * 파일 업로드 크기, 갯수 제한 및 검증.
     */
    const validFiles = files.filter((v) => {
      return v.size <= maxFileSize;
    });
    if (validFiles.length !== files.length) {
      SetBtnDisable(true);
      alert('파일 크기는 10MB 를 초과할 수 없습니다.');
      return;
    } else if (validFiles.length > 3) {
      alert('파일은 총 3장까지만 업로드 가능합니다.');
      SetBtnDisable(true);
      return;
    } else {
      SetBtnDisable(false);
    }

    setImageFiles(validFiles);

    // 이미지 미리보기 생성
    if (validFiles) {
      const previews = validFiles.map((v) => URL.createObjectURL(v));
      setImagePreviews(previews);
    }
  };

  const handleTitleForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.currentTarget.value);
  };

  const handleContentForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.currentTarget.value);
  };

  const handlePost = async () => {
    // 사용자가 이미지를 업로드 하지 않은 경우 예외처리.
    if (imageFiles.length === 0) {
      alert('사진을 업로드 해주세요.');
      throw new Error('사진을 업로드 해주세요.');
    }
    // 사용자가 제목 또는 내용을 입력하지 않은 경우 예외처리.
    if (title.length === 0 || content.length === 0) {
      alert('제목과 내용을 입력해주세요.');
      throw new Error('제목과 내용을 입력해주세요.');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);

    // 이미지 확장자 변환 로직 적용
    const convertedImages = await convertImagesToJpeg(imageFiles);
    convertedImages.forEach((v) => {
      formData.append('images', v);
    });

    // submitPost로 formData 전달
    submitPost(formData);
  };

  const submitPost = async (formData: FormData) => {
    try {
      setLoading(true);

      const result = await api.post(`${env.VITE_HOST}/posts`, formData, {});
      console.log(result.data);
      alert('포스팅 완료!');
      navigate('/');
    } catch (e: any) {
      alert('세션이 만료되었거나 토큰이 없습니다\n다시 로그인 해주세요.6');
      console.log('Error: ', e);
      alert(e.response?.data.message);
      // navigate('/auth/login/email');
      // window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  // 데이터를 로딩 중인 경우 로딩 메시지 표시
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }
  return (
    <Container className='my-5'>
      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={6}>
          <Card className='shadow-sm'>
            <Card.Body>
              <Form>
                <Form.Group controlId='formFileMultiple' className='mb-3'>
                  <div className={styles.fileUploadContainer}>
                    <Form.Control
                      type='file'
                      id='fileInput'
                      multiple
                      onChange={handleImgForm}
                      hidden={true}
                      isInvalid={imageFiles.length === 0}
                    />

                    {/* <input
                      type='file'
                      id='fileInput'
                      multiple
                      onChange={handleImgForm}
                      style={{ display: 'none' }}
                    /> */}
                    <Button
                      variant='outline-primary'
                      onClick={() =>
                        document.getElementById('fileInput')?.click()
                      }
                    >
                      사진 선택
                    </Button>
                    <Form.Control.Feedback type='invalid'>
                      사진을 업로드 해주세요.
                    </Form.Control.Feedback>
                    <p className='text-muted mt-2'>
                      최대 3개의 파일을 업로드할 수 있습니다.
                    </p>
                  </div>
                </Form.Group>
                {imagePreviews.length > 0 && (
                  <div className='text-center mb-3'>
                    {imagePreviews.map((v, i) => {
                      return (
                        <div key={i} className={styles.previewContainer}>
                          <div className={styles.imageWrapper}>
                            <span className={styles.imageIndex}>{i + 1}</span>
                            <Image
                              src={v}
                              alt={`Preview ${i + 1}`}
                              fluid
                              className={styles.previewImage}
                            />
                          </div>
                          <Button
                            variant='danger'
                            size='sm'
                            onClick={() => removeImage(i)}
                            className={styles.removeButton}
                          >
                            X
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
                <Form.Group className='mb-3'>
                  <Form.Label>제목</Form.Label>
                  <Form.Control
                    type='text'
                    placeholder='제목을 입력해 주세요.'
                    onChange={handleTitleForm}
                    isInvalid={title.length === 0}
                  />
                  <Form.Control.Feedback type='invalid'>
                    제목을 입력해 주세요.
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group className='mb-3'>
                  <Form.Label>내용</Form.Label>
                  <Form.Control
                    as='textarea'
                    rows={5}
                    placeholder='내용을 입력해 주세요.'
                    onChange={handleContentForm}
                    isInvalid={content.length === 0}
                  />
                  <Form.Control.Feedback type='invalid'>
                    내용을 입력해 주세요.
                  </Form.Control.Feedback>
                </Form.Group>
                <div className='d-grid'>
                  <Button
                    variant='primary'
                    type='button'
                    onClick={handlePost}
                    disabled={
                      !title ||
                      !content ||
                      btnDisable ||
                      imageFiles.length === 0
                    }
                  >
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
