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
import { handleTokenExpiration } from '../common/handleTokenExpiration';
import api from '../common/api';

// 클라이언트 측에서 요청 시 쿠키를 포함하고, 응답 시 서버로부터 전달된 쿠키를 브라우저에 저장할 수 있도록 하는 역할
// 모든 요청과 응답에 쿠키를 포함할 수 있도록 하기 위하여 전역으로 true로 설정.
axios.defaults.withCredentials = true;

export function Cards() {
  const navigate = useNavigate();

  const accessToken = window.localStorage.getItem('accessToken');

  const env = import.meta.env;

  const [dataFromServer, setDataFromServer] = useState([]);

  useEffect(() => {
    if (!accessToken) {
      handleTokenExpiration(navigate);
      return;
    }
    /**
     * app전역으로 토큰유효성 검사를 하기때문에 개별 컴포넌트에서는 중복적으로 하지 않음.
     */
    const fetchData = async () => {
      try {
        const response = await api.get(`/posts`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const convertedData = [...response.data.data]
          .reverse()
          .map((v: { createdAt: string | Date; updatedAt: string | Date }) => {
            v.createdAt = moment(v.createdAt).tz('Asia/Seoul').fromNow();
            v.updatedAt = moment(v.updatedAt).tz('Asia/Seoul').fromNow();
            return v;
          });

        setDataFromServer(convertedData);
      } catch (e: any) {
        console.log(e.response?.data.message);
        handleTokenExpiration(navigate);
      }
    };

    // fetchData 호출.
    fetchData();
  }, [accessToken, env.VITE_HOST, navigate]);

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
