import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import api from '../common/api';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { CardDropdown } from './CardDropdown';
import { deletePost } from '../common/deletePosts';
import { convertPostDates } from '../common/convertPostDates';

import styles from './styles/CardsDetail.module.css';
import { ImageSlider } from './ImageSlider';
import { extractAccessTokenFromLocalStorage } from '../common/extratAccessTokenFromLocalStorage';
import { extractUserFromLocalStorage } from '../common/extractUserFromLocalStorage';
import { LoadingSpinner } from './LoadingSpinner';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function CardsDetail() {
  const navigate = useNavigate();

  const accessToken = extractAccessTokenFromLocalStorage();

  const user = extractUserFromLocalStorage();

  const env = import.meta.env;

  const { id } = useParams();

  const [cards, setCards] = useState([]);

  const [loading, setLoading] = useState(false);

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    /**
     * app전역으로 토큰유효성 검사를 하기때문에 개별 컴포넌트에서는 중복적으로 하지 않음.
     */

    // 데이터 가져오기 함수 정의.
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await api.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        // post들의 날짜 변경
        const copy = [result.data];
        const convertedData = convertPostDates(copy);
        setCards(convertedData);
      } catch (e: any) {
        console.log(e.response?.data.message);
        handleTokenExpiration(navigate);
      } finally {
        setLoading(false);
      }
    };
    // fetchData 함수 호출
    fetchData();
  }, [accessToken, env.VITE_HOST, id, navigate]);

  // Handle post deletion
  const handleDeletePost = (postId: number) => {
    deletePost(postId, accessToken)
      .then(() => {
        // 상태 업데이트 하여 삭제된 게시물 제거
        setCards([...cards].filter((post) => post.id !== postId));
        navigate('/');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  return cards.map((v, i) => (
    <div key={i} className='center-align'>
      <Col
        sm={4}
        key={v.id}
        className='mb-4'
        style={{ margin: '0 auto' }}
        // onClick={() => {
        //   navigate(`/detail/${v.id}`);
        // }}
      >
        <Card style={{ maxWidth: '600px', cursor: 'pointer' }}>
          <Card.Header className={styles.cardTitleFixed}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/user/profile/${v.author.nickname}`);
              }}
            >
              <img
                src={`${v.author.images[0]}`}
                alt='User'
                className={styles.cardUserImg}
              />
              <strong style={{ fontSize: '13px' }}>{v.author.nickname}</strong>
              {(user?.userNickname === v.author.nickname ||
                user?.userNickname === 'Admin') && (
                <CardDropdown
                  postId={v.id}
                  onDelete={() => handleDeletePost(v.id)}
                />
              )}
            </div>
          </Card.Header>
          {/* <div className={styles.cardImgContainer}> */}
          {v.images.length > 1 ? (
            <ImageSlider images={v.images.map((img: string) => `${img}`)} />
          ) : (
            <div className={styles.cardImgContainer}>
              <Card.Img
                variant='top'
                src={`${v.images[0]}`}
                className={styles.cardImg}
              />
            </div>
          )}
          {/* <Card.Img
              variant='top'
              src={`${v.images[0]}`}
              className={styles.cardImg}
            /> */}
          {/* </div> */}
          <Card.Body>
            <Card.Title className={`${styles.cardTitleFixed}`}>
              {v.title}
            </Card.Title>
            <Card.Text className={`${styles.cardBodyFixed}`}>
              {v.content}
            </Card.Text>
          </Card.Body>
          <ListGroup className='list-group-flush'></ListGroup>
          <Card.Footer className={styles.cardFooter}>
            <small className='text-muted'>{v.createdAt}</small>
          </Card.Footer>
        </Card>
        <br />
      </Col>
    </div>
  ));
}
