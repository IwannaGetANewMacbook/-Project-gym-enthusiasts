/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import styles from './styles/UserProfile.module.css'; // Import CSS Module
import { useEffect, useState } from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaCamera,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import api from '../common/api';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import { LoadingSpinner } from './LoadingSpinner';

export function UserProfile() {
  const env = import.meta.env;

  const navigate = useNavigate();

  const accessToken = window.localStorage.getItem('accessToken');

  // 데이터 로딩 중을 나타내는 상태
  const [loading, setLoading] = useState<boolean>(true);

  const [userData, setUserData] = useState(null);

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    // fetchData 함수 선언
    const fetchData = async () => {
      setLoading(true); // 데이터 가져오기 시작 시 로딩 시작
      try {
        const response = await api.get('/users/myProfile');

        // 기존의 createdAt 형식에서 시간 부분을 제외하고 createdAt 재구성.
        response.data.createdAt = new Date(
          response.data.createdAt
        ).toLocaleDateString();

        response.data.pc = response.data.posts.length;

        setUserData(response.data);
        console.log('유저정보:', response.data);
      } catch (e) {
        console.log(e);
        handleTokenExpiration(navigate);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 서버 요청이 아직 로딩중인 경우 로딩스피너를 표시
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className={styles.userProfileContainer}>
      <Row className='justify-content-center'>
        <Col md={10} lg={8}>
          <div
            className={`${styles.profileHeader} text-center my-4 position-relative`}
          >
            <div
              className={`${styles.profilePictureWrapper} position-relative d-inline-block`}
            >
              <Image
                src={`${env.VITE_HOST}${userData.images[0]}`}
                roundedCircle
                className={`${styles.profilePicture} mb-3`}
              />
            </div>
            <h3 className={styles.nickname}>{userData.nickname}</h3>
            <p className={styles.bio}>{userData.bio}</p>
            {/* 프로필 편집 버튼 추가 */}
            <Button
              variant='outline-primary'
              className={`${styles.editProfileButton} mt-3`}
              onClick={() => navigate('/user/profile/edit')}
            >
              Edit Profile
            </Button>
          </div>
          <div className={styles.profileStats}>
            <div className={styles.profileStat}>
              <div className={styles.profileStatNumber}>{userData.pc}</div>
              <div className={styles.profileStatLabel}>Posts</div>
            </div>
          </div>
          <div className={`${styles.profileDetails} mt-4`}>
            <h5>Location</h5>
            <p className={styles.location}>{`${userData.city}`}</p>
            <h6>Public Email</h6>
            <p>{userData.email}</p>
            <p className={styles.joinDate}>{userData.createdAt} 가입</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
