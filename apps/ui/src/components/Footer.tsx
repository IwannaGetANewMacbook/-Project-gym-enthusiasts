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
                <li className='list-inline-item mx-2'>
                  <a
                    href='https://github.com/IwannaGetANewMacbook'
                    className='text-light'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i
                      className='bi bi-github'
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </a>
                </li>
                <li className='list-inline-item mx-2'>
                  <a
                    href='https://www.linkedin.com/in/%EC%88%98%ED%98%84-%EA%B9%80-bb934b2b6/'
                    className='text-light'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i
                      className='bi bi-linkedin'
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </a>
                </li>
                <li className='list-inline-item mx-2'>
                  <a
                    href='https://www.instagram.com/suhyeon.ts/'
                    className='text-light'
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <i
                      className='bi bi-instagram'
                      style={{ fontSize: '1.5rem' }}
                    ></i>
                  </a>
                </li>
              </ul>
            </Col>
          </Row>
          <hr className='bg-light' />

          {/* 정책 링크 섹션 */}
          <div className='text-center mb-2'>
            <a
              href='/privacy-policy.html'
              className='text-light me-3'
              style={{ textDecoration: 'underline' }}
            >
              개인정보처리방침
            </a>
            <a
              href='/terms-of-service.html'
              className='text-light'
              style={{ textDecoration: 'underline' }}
            >
              서비스 약관
            </a>
          </div>

          <div className='text-center'>
            <p className='mb-0'>© 2025 Suhyeon Kim. All Rights Reserved.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
}
