import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export function Footer() {
  return (
    <div style={{ marginTop: '200px' }}>
      <footer className='bg-dark text-light py-3'>
        <Container>
          {/* justify-content-center를 추가하여 중앙 정렬 */}
          <Row className='text-center text-md-start justify-content-center'>
            {/* Column 1: About Us */}
            <Col md={4} className='mb-3'>
              <h5>About Suhyeon</h5>
              <p className='small'>
                I am Suhyeon who values quality and service. Stay connected with
                me through social media!
              </p>
            </Col>

            {/* Column 2: Social Media */}
            <Col md={4} className='mb-3'>
              <h5>Follow Us</h5>
              <ul className='list-inline'>
                <li className='list-inline-item'>
                  <a
                    href='https://github.com/IwannaGetANewMacbook'
                    className='text-light'
                  >
                    GitHub
                  </a>
                </li>
                <li className='list-inline-item'>
                  <a
                    href='https://www.linkedin.com/in/%EC%88%98%ED%98%84-%EA%B9%80-bb934b2b6/'
                    className='text-light'
                  >
                    LinkedIn
                  </a>
                </li>
                <li className='list-inline-item'>
                  <a
                    href='https://www.instagram.com/suhyeon.ts/'
                    className='text-light'
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <hr className='bg-light' />
          <div className='text-center'>
            <p className='mb-0'>© 2025 Suhyeon Kim. All Rights Reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
