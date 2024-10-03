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

export function MyPage() {
  const navigate = useNavigate();

  interface User {
    userEmail: string;
    userNickname: string;
    userId: number;
  }

  const accessToken = window.localStorage.getItem('accessToken');
  const user: User = JSON.parse(window.localStorage.getItem('user'));
  const username = user.userNickname;

  // const dispatch = useAppDispatch();

  // const postSlice = useAppSelector((state: RootState) => state.postSlice);

  const env = import.meta.env;

  const [dataFromServer, setDataFromServer] = useState([]);

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

  return dataFromServer.map((v, i) => {
    return (
      <Col
        sm={4}
        key={i}
        onClick={() => {
          navigate(`/detail/${v.id}`);
        }}
      >
        <Card style={{ maxWidth: '300px', cursor: 'pointer' }}>
          <div className='cardImgContainer'>
            <Card.Img
              variant='top'
              src={`${env.VITE_HOST}${v.images[0]}`}
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
    );
  });
}
