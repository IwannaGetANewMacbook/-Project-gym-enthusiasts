/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

// import { getPost } from '../store/post';
// import { useAppDispatch, useAppSelector } from '../hooks';
// import { RootState } from '../store';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NoPosts from './NoPosts';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import { LoadingSpinner } from './LoadingSpinner';
import api from '../common/api';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { deletePost } from '../common/deletePosts';
import { CardDropdown } from './CardDropdown';
import { convertPostDates } from '../common/convertPostDates';
import { itemsPerPage } from '../common/const';
import { Button, Container, Row } from 'react-bootstrap';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function MyPosts() {
  const env = import.meta.env;

  const navigate = useNavigate();

  const user = JSON.parse(window.localStorage.getItem('user'));

  const accessToken = window.localStorage.getItem('accessToken');

  // 가져온 카드 데이터를 저장하는 상태
  const [cards, setCards] = useState([]);

  /**
   * 현재 페이지 번호를 저장하는 상태
   * Lazy Initialization을 사용해 currentPage 설정.
   * (컴포넌트가 처음 렌더링 될 때 한 번만 호출됨.)
   */
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const savedPage = parseInt(
      // url의 쿼리파라미터 값에 page 속성이 없으면 기본값으로 '1'사용.
      new URLSearchParams(window.location.search).get('page') || '1'
    );
    // 변환된 값이 숫자가 아닌 경우(예: 잘못된 쿼리 값이 있을 때) 기본값 1을 사용.
    return isNaN(savedPage) ? 1 : savedPage;
  });

  // 데이터 로딩 중을 나타내는 상태
  const [loading, setLoading] = useState<boolean>(true);

  // 총 페이지 수를 저장하는 상태
  const [totalPages, setTotalPages] = useState<number>(1);

  // URL의 쿼리 파라미터를 사용하기 위한 훅
  // setSerchParams: 새 쿼리 파라미터를 설정하면 URL이 업데이트되고, 컴포넌트가 URL에 맞게 다시 렌더링
  const [serchParams, setSerchParams] = useSearchParams();

  const username = user.userNickname;

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    // fetchData 함수 선언
    const fetchData = async () => {
      setLoading(true); // 데이터 가져오기 시작 시 로딩 시작
      try {
        const page = serchParams.get('page') || '1';

        // 페이지네이션 파라미터를 사용하여 포스트를 가져오는 API 호출
        const response = await api.get(`/posts/myposts/${username}`, {
          params: {
            take: itemsPerPage, // 페이지당 항목 수
            page: page, // 현재 페이지 번호
            order__createdAt: 'DESC', // 최신 게시물이 제일 위로 오도록 정렬
          },
        });

        // post들의 날짜 변경
        const convertedData = convertPostDates(response.data.data);

        // 응답으로 받은 카드 데이터 설정
        setCards(convertedData);

        // 현재 페이지 번호를 업데이트
        setCurrentPage(parseInt(page));

        // 총 페이지 수 설정
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } catch (e: any) {
        console.log(e);
        handleTokenExpiration(navigate);
      } finally {
        setLoading(false);
      }
    };

    // fetchData 함수 호출
    fetchData();
    // 의존성 배열에 어떠한 변수도 넣지않고 컴포넌트 마운트시 딱 한번만 실행(의도적으로.)
  }, [serchParams]); // serchParams가 변경될 때마다 실행

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    /**
     * 페이지를 이동할 때 쿼리 파라미터를 변경하여 URL에 반영
     * 뒤로가기, 앞으로가기 할 때 상태유지 가능
     */
    setSerchParams({ page: page.toString() });
  };

  // 서버 요청이 아직 로딩중인 경우 로딩스피너를 표시
  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (cards.length === 0) {
    return <NoPosts username={username}></NoPosts>;
  }

  // Handle post deletion
  const handleDeletePost = (postId: number) => {
    deletePost(postId, accessToken)
      .then(() => {
        // 상태 업데이트 하여 삭제된 게시물 제거
        setCards([...cards].filter((post) => post.id !== postId));
      })
      .catch((e) => {
        console.error(e);
      });
  };

  // html 랜더링
  return (
    <Container>
      {/* 카드들을 행으로 표시 */}
      <Row>
        {cards.map((v) => (
          <Col sm={4} key={v.id}>
            <Card style={{ maxWidth: '300px' }}>
              <div className='cardImgContainer'>
                <Card.Img
                  variant='top'
                  src={`${env.VITE_HOST}${v.images[0]}`}
                  className='cardImg'
                />
                <CardDropdown
                  postId={v.id} // 여기서 postId를 전달
                  onDelete={() => handleDeletePost(v.id)}
                ></CardDropdown>
              </div>
              <Card.Body>
                <Card.Title className='cardTitleFixed'>{v.title}</Card.Title>
                <Card.Text className='cardBodyFixed'>{v.content}</Card.Text>
              </Card.Body>
              <ListGroup className='list-group-flush'>
                {/* <ListGroup.Item>Vestibulum at eros</ListGroup.Item> */}
                <ListGroup.Item>작성자: {v.author.nickname}</ListGroup.Item>
              </ListGroup>
              <Card.Footer className='d-flex justify-content-between align-items-center'>
                <small className='text-muted'>{v.createdAt}</small>
              </Card.Footer>
            </Card>
            <br />
          </Col>
        ))}
      </Row>
      {/* 페이지네이션 바 */}
      <div className='d-flex justify-content-center my-4'>
        <Button
          variant='primary'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className='me-2'
        >
          이전 페이지
        </Button>
        <Button
          variant='primary'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          다음 페이지
        </Button>
      </div>
    </Container>
  );
}
