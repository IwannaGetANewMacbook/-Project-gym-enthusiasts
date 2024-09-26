/* eslint-disable @typescript-eslint/no-unused-vars */
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

export function Cards() {
  const navigate = useNavigate();

  const accessToken = window.localStorage.getItem('accessToken');

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
      .get(`${env.VITE_HOST}/posts`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((r) => {
        // const copy = [...r.data.data];
        // setDataFromServer(copy.reverse());
        const convertedData = r.data.data.map(
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
      <Col sm={4} key={i}>
        <Card style={{ maxWidth: '300px' }}>
          <div style={{ textAlign: 'center' }}>
            <Card.Img
              variant='top'
              src={`${env.VITE_HOST}${v.images[0]}`}
              className='cardImg'
            />
          </div>
          <Card.Body>
            <Card.Title>{v.title}</Card.Title>
            <Card.Text>{v.content}</Card.Text>
          </Card.Body>
          <ListGroup className='list-group-flush'>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
            <ListGroup.Item>작성자: {v.author.nickname}</ListGroup.Item>
          </ListGroup>
          <Card.Footer>
            <small className='text-muted'>{v.createdAt}</small>
          </Card.Footer>
        </Card>
        <br />
      </Col>
    );
  });
}
