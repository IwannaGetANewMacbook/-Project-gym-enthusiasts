import Nav from 'react-bootstrap/Nav';
import { logout } from '../common/logout';

export function NavLogout() {
  return (
    <Nav.Link
      onClick={() => {
        logout('/auth/login/email', true);
      }}
    >
      logout
    </Nav.Link>
  );
}
