import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import styles from './styles/UserProfile.module.css'; // Import CSS Module
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import api from '../common/api';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import { LoadingSpinner } from './LoadingSpinner';
import linkIcon from '../assets/link.svg';
import { extractAccessTokenFromLocalStorage } from '../common/extratAccessTokenFromLocalStorage';
import { extractUserFromLocalStorage } from '../common/extractUserFromLocalStorage';
import { NicknameEditor } from './NicknameEditor';

export function UserProfile() {
  const navigate = useNavigate();

  const accessToken = extractAccessTokenFromLocalStorage();

  const user = extractUserFromLocalStorage();

  // 데이터 로딩 중을 나타내는 상태
  const [loading, setLoading] = useState<boolean>(false);

  const [userData, setUserData] = useState(null);

  const { username } = useParams();

  const isMyProfile = username === user.userNickname;

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    // fetchData 함수 선언
    const fetchData = async () => {
      setLoading(true); // 데이터 가져오기 시작 시 로딩 시작
      try {
        const targetUsername = isMyProfile ? user.userNickname : username;

        const response = await api.get(`/users/profile/${targetUsername}`);

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
  }, [username]);

  // API 호출이 완료되고 userData가 유효할 때만 렌더링되도록 설정했습니다.
  if (loading || !userData) {
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
                src={`${userData.images[0]}`}
                roundedCircle
                className={`${styles.profilePicture} mb-3`}
              />
            </div>
            <h3 className={styles.nickname}>{userData.nickname}</h3>

            <NicknameEditor
              canChange={isMyProfile && userData.canChangeNicknameOnce}
              onNicknameChange={(newNickname) =>
                setUserData((prev: any) => ({ ...prev, nickname: newNickname }))
              }
            />

            <p className={styles.bio}>{userData.bio}</p>
            {/* 프로필 편집 버튼 추가 */}
            {isMyProfile && (
              <Button
                variant='outline-primary'
                className={`${styles.editProfileButton} mt-3`}
                onClick={() => navigate('/user/profile/edit')}
              >
                Edit Profile
              </Button>
            )}
          </div>
          <div className={styles.profileStats}>
            <div className={styles.profileStat}>
              <div className={styles.profileStatNumber}>{userData.pc}</div>
              <div className={styles.profileStatLabel}>Posts</div>
            </div>
          </div>
          <div className={`${styles.profileDetails} mt-4`}>
            <Row className={`${styles.profileDetailsRow}`}>
              {/* 왼쪽 정보 섹션 */}
              <Col md={6} className={styles.leftInfo}>
                <h5 className={styles.stickyHeader}>Location</h5>
                <p className={styles.location}>{`${userData.city}`}</p>
                <h6 className={styles.stickyHeader}>Public Email</h6>
                <p>{userData.email}</p>
                <p className={styles.joinDate}>{userData.createdAt} 가입</p>
              </Col>

              {/* 오른쪽 소셜 링크 섹션 */}
              <Col md={6} className={styles.rightLinks}>
                <h5 className={styles.stickyHeader}>Social Links</h5>
                <div className={`${styles.socialLinks}`}>
                  {userData.socialLinks && userData.socialLinks.length > 0 ? (
                    userData.socialLinks.map((link: any) => (
                      <div key={link.id} className={styles.socialLinkItem}>
                        <img
                          src={linkIcon}
                          alt='Link Icon'
                          className={styles.linkIcon}
                        />
                        <a
                          href={link.url}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          {link.title}
                        </a>
                      </div>
                    ))
                  ) : (
                    <p>No social links available.</p>
                  )}
                </div>
                {/* 소셜 링크 편집 버튼 */}
                {isMyProfile && (
                  <Button
                    variant='outline-success'
                    className={styles.manageButton}
                    onClick={() => navigate('/user/profile/edit/socialLinks')}
                  >
                    Edit Social Links
                  </Button>
                )}
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
