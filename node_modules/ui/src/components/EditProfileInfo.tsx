/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import styles from './styles/EditProfile.module.css'; // CSS 모듈을 임포트하여 컴포넌트에 스타일 적용
import api from '../common/api';
import { useNavigate } from 'react-router-dom';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { handleTokenExpiration } from '../common/handleTokenExpiration';

import { LoadingSpinner } from './LoadingSpinner';

export function EditProfileInfo() {
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem('accessToken');

  // 초기 사용자 정보 상태 설정
  const [userData, setUserData] = useState({
    bio: '',
    city: '',
  });

  // 데이터를 로딩 중인지 나타내는 상태
  const [loading, setLoading] = useState<boolean>(false);

  // HTML 렌더링 전에 accessToken 유효성 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    setLoading(true);
    // 사용자 데이터를 백엔드에서 가져오는 함수 정의
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/myProfile');
        // 사용자 데이터를 응답에서 설정하거나 기본값으로 설정
        setUserData({
          bio: response.data.bio || '',
          city: response.data.city || '',
        });

        setLoading(false); // 데이터 가져오기 완료 시 로딩 상태 변경
      } catch (e) {
        console.log(e);
        handleTokenExpiration(navigate); // 토큰 만료 시 처리
      } finally {
        setLoading(false);
      }
    };

    fetchUserData(); // 사용자 데이터 가져오기 함수 호출
  }, []);

  // 입력 필드 값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // 이벤트 타겟에서 이름과 값을 구조분해 할당
    setUserData((prevData) => ({ ...prevData, [name]: value })); // 기존 데이터를 유지하면서 새로운 값을 업데이트
  };

  // 프로필 변경사항 저장 버튼 클릭 시 호출되는 함수
  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      // 백엔드에 PUT 요청을 보내서 프로필 업데이트
      const result = await api.put(
        '/users/updateUserProfileInfo',
        userData,
        {}
      );

      console.log('응답응답:::::', result.data);

      alert('프로필이 성공적으로 업데이트되었습니다!'); // 성공 시 사용자에게 알림
      setLoading(false);
      navigate('/posts/myposts/:username'); // 사용자 프로필 페이지로 이동
    } catch (e) {
      console.log('프로필 업데이트 오류:', e); // 업데이트 실패 시 오류 로그
    }
  };

  // 데이터를 로딩 중인 경우 로딩 메시지 표시
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  // JSX를 통해 프로필 편집 폼 렌더링
  return (
    <Container className={`${styles.editProfileContainer} my-5`}>
      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={6}>
          <h2 className='text-center mb-4'>Edit Profile</h2>
          <Form>
            {/* Bio 필드 */}
            <Form.Group controlId='formBio' className='mb-3'>
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                name='bio'
                value={userData.bio}
                onChange={handleInputChange}
                placeholder='당신에 대해 알려주세요'
              />
            </Form.Group>

            {/* City 필드 */}
            <Form.Group controlId='formCity' className='mb-3'>
              <Form.Label>City</Form.Label>
              <Form.Control
                type='text'
                name='city'
                value={userData.city}
                onChange={handleInputChange}
                placeholder='도시를 입력해주세요'
              />
            </Form.Group>

            {/* 변경사항 저장 버튼 */}
            <div className='d-grid mt-4'>
              <Button variant='primary' onClick={handleSaveChanges}>
                Save Changes
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
