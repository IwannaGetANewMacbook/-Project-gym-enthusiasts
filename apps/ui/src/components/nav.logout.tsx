import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

export function NavLogout() {
  const navigate = useNavigate();

  return (
    <Nav.Link
      onClick={() => {
        localStorage.clear();
        navigate('/auth/login/email');
      }}
    >
      logout
    </Nav.Link>
  );
}
