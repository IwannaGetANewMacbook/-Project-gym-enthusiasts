/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment-timezone';

// import { getPost } from '../store/post';
// import { useAppDispatch, useAppSelector } from '../hooks';
// import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';
import NoPosts from './noPosts';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import { LoadingSpinner } from './loadingSpinner';
import api from '../common/api';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { deletePost } from '../common/deletePosts';
import { CardDropdown } from './CardDropdown';

interface User {
  userEmail: string;
  userNickname: string;
  userId: number;
}

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function MyPosts() {
  const env = import.meta.env;

  const navigate = useNavigate();

  const user: User = JSON.parse(window.localStorage.getItem('user'));

  const accessToken = window.localStorage.getItem('accessToken');

  const [dataFromServer, setDataFromServer] = useState([]);

  const [loading, setLoading] = useState(true);

  const username = user.userNickname;

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    // fetchData 함수 선언
    const fetchData = async () => {
      try {
        // api get 요청.
        const result = await api.get(`/posts/myposts/${username}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        // post들의날짜 변경
        const convertedData = [...result.data]
          .reverse()
          .map((v: { createdAt: string | Date; updatedAt: string | Date }) => {
            v.createdAt = moment(v.createdAt).tz('Asia/Seoul').fromNow();
            v.updatedAt = moment(v.updatedAt).tz('Asia/Seoul').fromNow();
            return v;
          });

        setDataFromServer(convertedData);
      } catch (e: any) {
        console.log(e.response?.data);
        handleTokenExpiration(navigate);
      } finally {
        setLoading(false);
      }
    };

    // fetchData 함수 호출
    fetchData();
    // 의존성 배열에 어떠한 변수도 넣지않고 컴포넌트 마운트시 딱 한번만 실행(의도적으로.)
  }, []);

  if (loading) {
    return <LoadingSpinner></LoadingSpinner>;
  }

  if (dataFromServer.length === 0) {
    return <NoPosts username={username}></NoPosts>;
  }

  // Handle post deletion
  const handleDeletePost = (postId: number) => {
    deletePost(postId, accessToken)
      .then(() => {
        // 상태 업데이트 하여 삭제된 게시물 제거
        setDataFromServer(
          [...dataFromServer].filter((post) => post.id !== postId)
        );
      })
      .catch((e) => {
        console.error(e);
      });
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
    );
  });
}