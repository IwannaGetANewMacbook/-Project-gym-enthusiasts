import React, { useEffect, useState } from 'react';
import { Form, Button, Image } from 'react-bootstrap';
import styles from './styles/EditProfilePicture.module.css'; // CSS 모듈을 임포트하여 컴포넌트에 스타일 적용
import api from '../common/api';
import { useNavigate } from 'react-router-dom';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import { LoadingSpinner } from './LoadingSpinner';
import { extractAccessTokenFromLocalStorage } from '../common/extratAccessTokenFromLocalStorage';

export function EditProfilePicture() {
  const env = import.meta.env;

  const navigate = useNavigate();

  const accessToken = extractAccessTokenFromLocalStorage();

  // 데이터를 로딩 중인지 나타내는 상태
  const [loading, setLoading] = useState<boolean>(false);

  // 선택한 프로필 이미지 파일 상태
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // 프로필 이미지 미리보기 URL 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // HTML 렌더링 전에 accessToken 유효성 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    setLoading(true);
    // 사용자 데이터를 백엔드에서 가져오는 함수 정의
    const fetchUserData = async () => {
      try {
        const response = await api.get('/users/myProfile');

        // 사용자 이미지가 있는 경우 이미지 미리보기 URL 설정
        setImagePreview(
          response.data.images ? `${response.data.images[0]}` : null
        );
        setLoading(false); // 데이터 가져오기 완료 시 로딩 상태 변경
        navigate('');
      } catch (e) {
        console.log(e);
        handleTokenExpiration(navigate); // 토큰 만료 시 처리
      }
    };

    fetchUserData(); // 사용자 데이터 가져오기 함수 호출
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 프로필 이미지 선택 시 호출되는 함수
  const handleImgForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []); // 선택한 파일을 가져옴
    const maxFileSize = 10 * 1024 * 1024; // 10MB

    /**
     * 파일 업로드 크기, 갯수 제한 및 검증.
     */
    const validFiles = files.filter((v) => {
      return v.size <= maxFileSize;
    });
    if (validFiles.length !== files.length) {
      alert('파일 크기는 10MB를 초과할 수 없습니다.');
      return;
    } else if (validFiles.length > 1) {
      alert('파일은 1개만 업로드 가능합니다.');
      return;
    }
    setImageFiles(validFiles); // 이미지 파일 상태 설정

    if (files) {
      setImagePreview(URL.createObjectURL(files[0])); // 이미지 미리보기 URL 설정
    }
  };

  // 프로필 사진 저장 버튼 클릭 시 호출되는 함수
  const handleSaveProfilePicture = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      if (imageFiles.length > 0) {
        imageFiles.forEach((v) => {
          // 'images' 라는 필드로 배열 전송
          formData.append('images', v);
        });
      }

      // 백엔드에 post 요청을 보내서 프로필 사진 업데이트
      await api.post(
        `${env.VITE_HOST}/users/updateUserProfilePicture`,
        formData,
        {
          headers: { Authorization: `Bearer ${accessToken}` }, // 인증 헤더 추가
          timeout: 120000, // 2분 (기본값보다 크게 설정)
          maxContentLength: Infinity, // 최대 요청 데이터 크기 무제한
          maxBodyLength: Infinity, // 최대 요청 바디 크기 무제한
          withCredentials: true, // 쿠키를 자동으로 전송
        }
      );
      alert('프로필 사진이 성공적으로 업데이트되었습니다!'); // 성공 시 사용자에게 알림

      // 리렌더링
      window.location.reload();

      setLoading(false);
    } catch (e) {
      alert(`프로필 사진 업데이트 오류: ${e}`);
      console.log('프로필 사진 업데이트 오류:', e); // 업데이트 실패 시 오류 로그
    } finally {
      setLoading(false); // 로딩 상태 변경
    }
  };

  // 데이터를 로딩 중인 경우 로딩 메시지 표시
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return (
    <div className='text-center mb-3'>
      <br />

      {/* 프로필 사진 미리보기, 클릭하여 파일 선택 */}
      <Form.Group className='mb-3'>
        <label htmlFor='formFile' className={`${styles.imagePreviewLabel}`}>
          <Image
            src={imagePreview}
            alt='Profile Preview'
            fluid
            roundedCircle
            className={`${styles.imagePreview} mb-3`}
            style={{ cursor: 'pointer' }}
          />
        </label>
        {/* 파일 선택을 위한 폼 컨트롤, 숨김 */}
        <Form.Control
          type='file'
          onChange={handleImgForm}
          id='formFile'
          className='d-none'
        />
      </Form.Group>
      {/* 프로필 사진 저장 버튼 */}
      <Button
        variant='secondary'
        onClick={handleSaveProfilePicture}
        disabled={!imageFiles[0]} // 이미지 파일이 없을 때 버튼 비활성화
      >
        Save Profile Picture
      </Button>
    </div>
  );
}
