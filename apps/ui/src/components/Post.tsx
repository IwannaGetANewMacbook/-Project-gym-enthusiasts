import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';

import Form from 'react-bootstrap/Form';

export function Post() {
  const navigate = useNavigate();
  const accessToken = window.localStorage.getItem('accessToken');

  useEffect(() => {
    if (!accessToken) {
      alert('토큰이 없습니다. 로그인 해 주십시오');
      navigate('/auth/login/email');
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'left',
      }}
    >
      <Card style={{ width: '80%' }}>
        <Form.Group controlId='formFileMultiple' className='mb-3'>
          <Form.Label>사진을 올려주세요.</Form.Label>
          <Form.Control type='file' multiple />
        </Form.Group>
        {/* <Card.Img variant='top' src='holder.js/100px180?text=Image cap' /> */}
        <Card.Title>
          <Form.Control as='textarea' placeholder='제목을 입력해 주세요.' />
        </Card.Title>
        <Card.Body>
          <Form.Control
            as='textarea'
            placeholder='내용을 입력해 주세요.'
            style={{ height: '300px' }}
          />
        </Card.Body>
      </Card>
    </div>
  );
}
