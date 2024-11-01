import Nav from 'react-bootstrap/Nav';
import { useNavigate } from 'react-router-dom';

export function NavLogin() {
  const navigate = useNavigate();

  return (
    <Nav.Link
      onClick={() => {
        navigate('/auth/login/email');
      }}
    >
      login
    </Nav.Link>
  );
}
