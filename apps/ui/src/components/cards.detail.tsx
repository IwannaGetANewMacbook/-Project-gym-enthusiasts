import axios from 'axios';
import { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import moment from 'moment-timezone';
import { useParams } from 'react-router-dom';

import { useNavigate } from 'react-router-dom';

export function CardsDetail() {
  const navigate = useNavigate();

  const accessToken = window.localStorage.getItem('accessToken');

  const env = import.meta.env;

  const { id } = useParams();

  const [dataFromServer, setDataFromServer] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      alert('토큰이 없습니다. 로그인 해 주십시오');
      navigate('/auth/login/email');
    }

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
        console.log(e);
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
