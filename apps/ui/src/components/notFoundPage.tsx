import { Container, Row, Col, Button } from 'react-bootstrap';

const NotFoundPage = () => {
  return (
    <Container
      className='d-flex flex-column justify-content-center align-items-center'
      style={{ height: '100vh', textAlign: 'center', marginTop: '-100px' }}
    >
      <Row>
        <Col>
          <h1
            style={{ fontSize: '6rem', fontWeight: 'bold', color: '#007bff' }}
          >
            404
          </h1>
          <h2 style={{ fontSize: '2rem', marginBottom: '20px' }}>
            Page Not Found
          </h2>
          <p style={{ marginBottom: '30px', color: '#666' }}>
            The page you're looking for doesn't exist. It may have been moved or
            deleted.
          </p>
          <Button variant='primary' href='/'>
            Go to Homepage
          </Button>
        </Col>
      </Row>
      <Row>
        <Col>
          <img
            src='https://images.unsplash.com/photo-1493612276216-ee3925520721?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
            alt='404 Illustration'
            style={{ width: '300px', marginTop: '30px' }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
