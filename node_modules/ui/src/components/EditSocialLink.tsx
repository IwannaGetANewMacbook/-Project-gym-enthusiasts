/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import styles from './styles/EditProfile.module.css'; // 기존 CSS 모듈을 사용
import api from '../common/api';
import { useNavigate } from 'react-router-dom';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import { LoadingSpinner } from './LoadingSpinner';

export function EditSocialLink() {
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem('accessToken');

  // 초기 상태 설정 (새로 추가되는 social link은 id가 없기 때때문에 id는 optional로 설정)
  const [socialLinks, setSocialLinks] = useState<
    { id?: number; title: string; url: string }[]
  >([]);

  // 삭제된 Social Link ID 저장
  const [deletedLinkIds, setDeletedLinkIds] = useState<number[]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  // AccessToken 유효성 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    setLoading(true);
    const fetchSocialLinks = async () => {
      try {
        const response = await api.get('/users/mySocialLinks');
        setSocialLinks(response.data || []);
      } catch (e) {
        console.log(e);
        handleTokenExpiration(navigate);
      } finally {
        setLoading(false);
      }
    };
    fetchSocialLinks();
  }, []);

  // URL 유효성 검사 함수
  const isValidUrl = (url: string) => {
    try {
      new URL(url); // URL 객체로 변환이 성공하면 유효한 URL
      return true;
    } catch {
      return false; // 변환이 실패하면 잘못된 URL
    }
  };

  // Social Link 추가
  const addSocialLink = () => {
    if (socialLinks.length >= 3) {
      alert('Social Links는 최대 3개까지 추가할 수 있습니다.');
      return;
    }
    setSocialLinks([...socialLinks, { title: '', url: '' }]);
  };

  // Social Link 삭제
  const removeSocialLink = (index: number) => {
    const removedLink = socialLinks[index];

    // socialLinks 배열에서 socialLink의 id가 존재 할 때(기존에 등록된 Social Link 일때)
    if (removedLink.id) {
      setDeletedLinkIds([...deletedLinkIds, removedLink.id]); // 삭제된 ID 저장
    }

    // socialLinks 배열에서 socialLink의 id가 존재하지 않을 때(새로 추가된 Social Link 일때)
    const updatedLinks = socialLinks.filter((_, idx) => idx !== index);
    setSocialLinks(updatedLinks);
  };

  // 입력 필드 값 변경
  const handleInputChange = (
    index: number,
    field: 'title' | 'url',
    value: string
  ) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index][field] = value;
    setSocialLinks(updatedLinks);
  };

  // 중복 체크 함수
  const hasDuplicateLinks = () => {
    // trim()을 사용하여 앞뒤 공백 제거 && lowercase로 변환하여 대소문자 구분하지 않음
    const urls = socialLinks.map((link) => link.url.trim().toLowerCase());
    return new Set(urls).size !== urls.length; // 중복된 URL이 있으면 true 반환
  };

  // Social Links 업데이트(Save Changes 버튼 클릭 시)
  const handleSaveChanges = async () => {
    try {
      setLoading(true);

      // 유효성 검사
      for (const link of socialLinks) {
        //
        if (!link.title.trim()) {
          alert(`Title은 비어 있을 수 없습니다.`);
          setLoading(false);
          return;
        }

        if (!isValidUrl(link.url)) {
          alert(`올바르지 않은 URL: ${link.url}`);
          setLoading(false);
          return;
        }
      }

      // 중복된 URL이 있는지 확인하는 유효성 검사
      if (hasDuplicateLinks()) {
        alert('Social Links에 중복된 URL이 있습니다.');
        setLoading(false);
        return;
      }

      // 삭제된 Social Link 삭제 요청
      await Promise.all(
        deletedLinkIds.map((id) => {
          return api.delete(`/users/socialLinks/${id}`);
        })
      );

      // 각각의 Social Link 업데이트 요청
      await Promise.all(
        socialLinks.map((link) => {
          // link.id가 존재할 때(기존에 등록된 Social Link 일때)
          if (link.id) {
            return api.patch(`/users/socialLinks/${link.id}`, {
              title: link.title,
              url: link.url,
            });
          } else {
            // link.id가 존재하지 않을 때(새로 추가된 Social Link 일때)
            return api.post('/users/socialLinks', {
              title: link.title,
              url: link.url,
            });
          }
        })
      );

      alert(`Social Links가 성공적으로 업데이트 되었습니다.`);
      navigate('/user/profile');
    } catch (e: any) {
      alert(e.response.data.message);
      console.log('Social Links 업데이트 실패', e);
    } finally {
      setLoading(false);
    }
  };

  // 로딩 중일 때 스피너 표시
  if (loading) {
    return <LoadingSpinner />;
  }

  // JSX 렌더링
  return (
    <Container className={`${styles.editProfileContainer} my-5`}>
      <Row className='justify-content-center'>
        <Col xs={12} md={8} lg={6}>
          <h2 className='text-center mb-4'>Edit Social Links</h2>
          <Form>
            {socialLinks.map((link, index) => (
              <Form.Group key={index} className='mb-3 position-relative'>
                <Form.Label>Social Link {index + 1}</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Title'
                  value={link.title}
                  onChange={(e) =>
                    handleInputChange(index, 'title', e.target.value)
                  }
                  className='mb-2'
                />
                <Form.Control
                  type='url'
                  placeholder='URL'
                  value={link.url}
                  onChange={(e) =>
                    handleInputChange(index, 'url', e.target.value)
                  }
                />
                {/* X 버튼 */}
                <Button
                  variant='danger'
                  size='sm'
                  className={`${styles.removeButton} position-absolute`}
                  style={{ top: '10px', right: '10px' }}
                  onClick={() => removeSocialLink(index)}
                >
                  X
                </Button>
              </Form.Group>
            ))}
            {/* 추가 버튼 */}
            <Button
              variant='outline-primary'
              className='mb-3'
              onClick={addSocialLink}
            >
              Add Social Link
            </Button>
            {/* 저장 버튼 */}
            <div className='d-grid'>
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
