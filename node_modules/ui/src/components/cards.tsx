import axios from 'axios';
import { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';

import { getPost } from '../store/post';
import { useAppDispatch, useAppSelector } from '../hooks';
import { RootState } from '../store';
import { useNavigate } from 'react-router-dom';

export function Cards() {
  const navigate = useNavigate();

  const accessToken = window.localStorage.getItem('accessToken');

  const dispatch = useAppDispatch();

  const postSlice = useAppSelector((state: RootState) => state.postSlice);

  const env = import.meta.env;

  useEffect(() => {
    if (!accessToken) {
      alert('토큰이 없습니다. 로그인 해 주십시오');
      navigate('/auth/login/email');
    }
    axios
      .get(`${env.VITE_HOST}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((r) => {
        dispatch(getPost(r.data));
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

  return postSlice.map((v, i) => {
    return (
      <Col sm={4} key={i}>
        <Card style={{ maxWidth: '300px' }}>
          <div style={{ textAlign: 'center' }}>
            <Card.Img
              variant='top'
              src={`../../public/wk${i + 1}.jpg`}
              className='cardImg'
            />
          </div>
          <Card.Body>
            <Card.Title>{v.title}</Card.Title>
            <Card.Text>{v.content}</Card.Text>
          </Card.Body>
          <ListGroup className='list-group-flush'>
            <ListGroup.Item>{v.username}</ListGroup.Item>
            <ListGroup.Item>{v.time}</ListGroup.Item>
            <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
          </ListGroup>
          <Card.Footer>
            <small className='text-muted'>Last updated 3 mins ago</small>
          </Card.Footer>
        </Card>
        <br />
      </Col>
    );
  });
}
