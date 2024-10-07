import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button'; // Button 컴포넌트 import
import moment from 'moment-timezone';

// import { getPost } from '../store/post';
// import { useAppDispatch, useAppSelector } from '../hooks';
// import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import NoPosts from './noPosts';
interface User {
  userEmail: string;
  userNickname: string;
  userId: number;
}

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function MyPage() {
  useEffect(() => {
    if (!accessToken) {
      alert('토큰이 없습니다. 로그인 해 주십시오');
      navigate('/auth/login/email');
    }

    axios
      .get(`${env.VITE_HOST}/posts/mypage/${username}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((r) => {
        // const copy = [...r.data.data];
        // setDataFromServer(copy.reverse());
        const convertedData = r.data.map(
          (v: { createdAt: string | Date; updatedAt: string | Date }) => {
            // UTC에서 KST (Asia/Seoul) 시간대로 변환한 다음 "Relative Time" 형식으로 변환
            v.createdAt = moment(v.createdAt).tz('Asia/Seoul').fromNow();
            v.updatedAt = moment(v.updatedAt).tz('Asia/Seoul').fromNow();
            return v;
          }
        );
        setDataFromServer(convertedData.reverse());
      })
      .catch((e) => {
        console.log(e.response?.data);
        if (localStorage.getItem('accessToken')) {
          alert(
            `${e.response?.data.message}\n토큰이 만료되었습니다. 다시 로그인 해주세요.`
          );
          navigate('/auth/login/email');
          return localStorage.clear();
        }
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const env = import.meta.env;

  const navigate = useNavigate();

  const [dataFromServer, setDataFromServer] = useState([]);

  const accessToken = window.localStorage.getItem('accessToken');

  const user: User = JSON.parse(window.localStorage.getItem('user'));
  if (!user) {
    alert('로그인을 해 주십시오.');
    window.location.replace('/auth/login/email');
    return;
  }
  const username = user.userNickname;

  if (dataFromServer.length === 0) {
    return <NoPosts username={username}></NoPosts>;
  }
  // Handle post deletion
  const handleDeletePost = (postId: number) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      axios
        .delete(`${env.VITE_HOST}/posts/${postId}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((r) => {
          console.log(r.data);
          alert('게시물이 삭제되었습니다.');

          // 상태 업데이트하여 삭제된 게시물 제거
          setDataFromServer(
            dataFromServer.filter((post) => post.id !== postId)
          );
        })
        .catch((e) => {
          console.log(e);
          alert('게시물 삭제에 실패했습니다.');
        });
    }
  };

  // html 랜더링
  return dataFromServer.map((v, i) => {
    return (
      <Col sm={4} key={i}>
        <Card style={{ maxWidth: '300px' }}>
          <div className='cardImgContainer'>
            <Card.Img
              variant='top'
              src={`${env.VITE_HOST}${v.images[0]}`}
              className='cardImg'
            />
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
            {/* 삭제 버튼 추가 */}
            <Button
              variant='danger'
              size='sm'
              onClick={() => {
                handleDeletePost(v.id);
              }}
            >
              삭제
            </Button>
          </Card.Footer>
        </Card>
        <br />
      </Col>
    );
  });
}
