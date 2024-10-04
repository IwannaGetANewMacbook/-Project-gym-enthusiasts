import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import NavDropdown from 'react-bootstrap/NavDropdown';
import { NavLogout } from './nav.logout';
import { NavLogin } from './nav.login';
import { useNavigate } from 'react-router-dom';

export function NavBar() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(localStorage.getItem('user'));

  const token = localStorage.getItem('accessToken');

  return (
    <Navbar expand='lg' className='bg-body-tertiary'>
      <Container>
        <Navbar.Brand className='navHover'>LIMITLESS</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='me-auto'>
            {token ? (
              <Nav.Link
                onClick={() => {
                  navigate('/');
                }}
              >
                Home
              </Nav.Link>
            ) : null}

            {token ? (
              <Nav.Link
                onClick={() => {
                  navigate('/post');
                }}
              >
                Post
              </Nav.Link>
            ) : null}

            {token ? (
              <Nav.Link
                onClick={() => {
                  navigate('/posts/mypage/:username');
                }}
              >
                MyPage
              </Nav.Link>
            ) : null}

            {token ? null : <NavLogin></NavLogin>}
            {/* <NavDropdown title='Dropdown' id='basic-nav-dropdown'>
              <NavDropdown.Item href='#action/3.1'>Action</NavDropdown.Item>
              <NavDropdown.Item href='#action/3.2'>
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href='#action/3.3'>Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href='#action/3.4'>
                Separated link
              </NavDropdown.Item>
            </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
      <br />

      <Nav className='me-auto text-center user-info-nav'>
        <div className='d-flex align-items-center'>
          {localStorage.getItem('user') ? (
            <span className='me-3 text-nowrap'>{userInfo.userNickname}님</span>
          ) : null}

          {token ? <NavLogout></NavLogout> : null}
        </div>
      </Nav>
    </Navbar>
  );
}
