/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import api from '../common/api';
import { checkAccessTokenBeforeRendering } from '../common/checkAccessTokenBeforeRendering';
import { CardDropdown } from './CardDropdown';
import { deletePost } from '../common/deletePosts';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function CardsDetail() {
  const navigate = useNavigate();

  const accessToken = window.localStorage.getItem('accessToken');

  const env = import.meta.env;

  const { id } = useParams();

  const [dataFromServer, setDataFromServer] = useState([]);

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // html 렌더링 전 accessToken 유무 검사
  checkAccessTokenBeforeRendering(accessToken);

  useEffect(() => {
    /**
     * app전역으로 토큰유효성 검사를 하기때문에 개별 컴포넌트에서는 중복적으로 하지 않음.
     */

    // 데이터 가져오기 함수 정의.
    const fetchData = async () => {
      try {
        const response = await api.get(`/posts/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const copy = [response.data];

        const convertedData = copy.map(
          (v: { createdAt: string | Date; updatedAt: string | Date }) => {
            v.createdAt = moment(v.createdAt).tz('Asia/Seoul').fromNow();
            v.updatedAt = moment(v.updatedAt).tz('Asia/Seoul').fromNow();
            return v;
          }
        );

        setDataFromServer(convertedData);
      } catch (e: any) {
        console.log(e.response?.data.message);
        handleTokenExpiration(navigate);
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
        setDataFromServer(
          [...dataFromServer].filter((post) => post.id !== postId)
        );
        navigate('/');
      })
      .catch((e) => {
        console.error(e);
      });
  };

  return dataFromServer.map((v, i) => {
    return (
      <div key={i} className='center-align'>
        <Col sm={4}>
          <Card style={{ maxWidth: '300px' }}>
            <div className='cardImgContainer'>
              <Card.Img
                variant='top'
                src={`${env.VITE_HOST}${v.images[0]}`}
                className='cardImg'
              />
              {user?.userNickname === v.author.nickname && (
                <CardDropdown onDelete={() => handleDeletePost(v.id)} />
              )}
            </div>
            <Card.Body>
              <Card.Title className='cardTitleFixed'>{v.title}</Card.Title>
              <Card.Text className='cardBodyFixed'>{v.content}</Card.Text>
            </Card.Body>
            <ListGroup className='list-group-flush'>
              {/* <ListGroup.Item>Vestibulum at eros</ListGroup.Item> */}
              <ListGroup.Item>작성자: {v.author.nickname}</ListGroup.Item>
            </ListGroup>
            <Card.Footer>
              <small className='text-muted'>{v.createdAt}</small>
            </Card.Footer>
          </Card>
          <br />
        </Col>
      </div>
    );
  });
}
