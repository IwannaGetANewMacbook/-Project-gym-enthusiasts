import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import { useNavigate } from 'react-router-dom';
import { NavLogout } from './nav.logout';
import { NavLogin } from './nav.login';

export function NavBar() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('user'));

  const token = localStorage.getItem('accessToken');

  // console.log(userInfo);

  return (
    <Navbar bg='light' data-bs-theme='light'>
      <Container>
        <Navbar.Brand>LIMITLESS</Navbar.Brand>
        <Nav className='me-auto'>
          <Nav.Link
            onClick={() => {
              navigate('/');
            }}
          >
            Home
          </Nav.Link>

          {token ? <NavLogout></NavLogout> : <NavLogin></NavLogin>}
        </Nav>
      </Container>
      <Nav className='me-auto' style={{ width: '100px' }}>
        {localStorage.getItem('user') ? `${userInfo.nickname}님` : null}
      </Nav>
    </Navbar>
  );
}
