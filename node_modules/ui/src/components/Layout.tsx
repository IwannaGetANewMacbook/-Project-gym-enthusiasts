import { Container, Row } from 'react-bootstrap';
import { MainBg } from './MainBg';
import { NavBar } from './NavBar';
import { Footer } from './Footer';

type LayoutProps = {
  children: React.ReactNode;
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <NavBar />
      <MainBg />
      <br />
      <Container>
        <Row>{children}</Row>
      </Container>
      <Footer />
    </>
  );
}
