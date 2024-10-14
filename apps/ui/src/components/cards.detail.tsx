import axios, { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';
import { newAccessToken } from '../common/renewAccessToken';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function CardsDetail() {
  const navigate = useNavigate();

  const accessToken = window.localStorage.getItem('accessToken');

  const env = import.meta.env;

  const { id } = useParams();

  const [dataFromServer, setDataFromServer] = useState([]);

  if (!accessToken) {
    alert('토큰이 없습니다. 로그인 해 주십시오');
    window.location.replace('/auth/login/email');
  }

  useEffect(() => {
    // accessToken 검증.
    const validateAccessToken = axios
      .get(`${env.VITE_HOST}/auth/validateAccessToken`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then(() => {
        console.log('유효한 토큰입니다');
      })
      .catch((e: AxiosError) => {
        console.log('만료된 토큰', e);
      });

    if (validateAccessToken) {
      axios
        .get(`${env.VITE_HOST}/posts/${id}`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        .then((r) => {
          const copy = [r.data];
          const convertedData = copy.map(
            (v: { createdAt: string | Date; updatedAt: string | Date }) => {
              v.createdAt = moment(v.createdAt).tz('Asia/Seoul').fromNow();
              v.updatedAt = moment(v.updatedAt).tz('Asia/Seoul').fromNow();
              return v;
            }
          );
          setDataFromServer(convertedData);
        })
        .catch((e) => {
          // console.log(e);
          alert(
            `${e.response?.data.message}\n토큰이 만료되었습니다. 다시 로그인 해주세요.`
          );
          navigate('/auth/login/email');
          return localStorage.clear();
        });
    }

    // 7초마다 newAccessToken 함수 호출하여 토큰 갱신
    const interval = setInterval(() => {
      newAccessToken().then((newToken) => {
        if (newToken) {
          window.localStorage.setItem('accessToken', newToken);
        }
      });
    }, 7000); // 3분 = 180,000 밀리초

    // 컴포넌트가 언마운트될 때 interval 정리
    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
