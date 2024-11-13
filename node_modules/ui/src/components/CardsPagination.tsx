import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import api from '../common/api';
import { LoadingSpinner } from './LoadingSpinner';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { convertPostDates } from '../common/convertPostDates';

export function CardsPagination() {
  const navigate = useNavigate();
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
  // 페이지당 항목 수
  const itemsPerPage = 6;
  // 총 페이지 수를 저장하는 상태
  const [totalPages, setTotalPages] = useState<number>(1);

  // URL의 쿼리 파라미터를 사용하기 위한 훅
  // setSerchParams: 새 쿼리 파라미터를 설정하면 URL이 업데이트되고, 컴포넌트가 URL에 맞게 다시 렌더링
  const [searchParams, setSearchParams] = useSearchParams();

  // 첫 번째 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // 데이터 가져오기 시작 시 로딩 시작
      try {
        const page = searchParams.get('page') || '1';
        // 페이지네이션 파라미터를 사용하여 포스트를 가져오는 API 호출
        const response = await api.get(`/posts`, {
          params: {
            take: itemsPerPage, // 페이지당 항목 수
            page: page, // 현재 페이지 번호
            order__createdAt: 'DESC', // 최신 게시물이 제일 위로 오도록 정렬 순서 설정
          },
        });

        // post들의 날짜 변경
        const convertedData = convertPostDates(response.data.data);

        // 응답으로 받은 카드 데이터를 설정
        setCards(convertedData);
        // 현재 페이지 번호를 업데이트
        setCurrentPage(parseInt(page));
        // 총 페이지 수 설정
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } catch (error) {
        console.error('데이터 가져오기 오류', error); // 오류가 발생하면 로그 출력
      } finally {
        setLoading(false); // 데이터 가져오기 완료 또는 오류 발생 후 로딩 종료
      }
    };
    fetchData();
  }, [searchParams]); // searchParams가 변경될 때마다 실행

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    /**
     * 페이지를 이동할 때 쿼리 파라미터를 변경하여 URL에 반영.
     * 뒤로가기, 앞으로가기 할 때 상태유지 가능
     */
    setSearchParams({ page: page.toString() });
    // 페이지 변경 시 화면 맨 위로 스크롤
    window.scrollTo(0, 0);
  };

  // 서버 요청이 아직 로딩중인 경우 로딩스피너를 표시
  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container>
      {/* 카드들을 행으로 표시 */}
      <Row>
        {cards.map((v) => (
          <Col
            sm={4}
            key={v.id}
            onClick={() => {
              navigate(`/detail/${v.id}`);
            }}
          >
            <Card style={{ maxWidth: '300px', cursor: 'pointer' }}>
              <div className='cardImgContainer'>
                <Card.Img
                  variant='top'
                  src={`${import.meta.env.VITE_HOST}${v.images[0]}`}
                  className='cardImg'
                />
              </div>
              <ListGroup className='list-group-flush'></ListGroup>
              <Card.Footer>
                <small className='text-muted'>
                  <strong>{v.author.nickname}</strong> <div></div> {v.createdAt}
                </small>
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
