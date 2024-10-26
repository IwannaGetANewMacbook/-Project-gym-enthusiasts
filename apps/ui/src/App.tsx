import './App.css';

import { NavBar } from './components/navBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cards } from './components/cards';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { MainBg } from './components/mainBg';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/login';
import { Registraion } from './components/registration';
import { Post } from './components/Post';
import { CardsDetail } from './components/cards.detail';
import { Footer } from './components/footer';
import NotFoundPage from './components/notFoundPage';
import { MyPosts } from './components/myPosts';

function App() {
  return (
    <>
      <Suspense
        fallback={
          <span className='loader' style={{ display: 'loader' }}></span>
        }
      >
        <Routes>
          <Route
            path='/'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Container>
                  <Row>
                    <Cards></Cards>
                  </Row>
                </Container>
                <Footer></Footer>
              </>
            }
          />
          <Route
            path='/detail/:id'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Container>
                  <Row>
                    <CardsDetail></CardsDetail>
                  </Row>
                </Container>
                <Footer></Footer>
              </>
            }
          />
          <Route
            path='/auth/login/email'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Login></Login>
                <Footer></Footer>
              </>
            }
          />
          <Route
            path='/auth/register/email'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Registraion></Registraion>
                <Footer></Footer>
              </>
            }
          />
          <Route
            path='/post'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Post></Post>
                <Footer></Footer>
              </>
            }
          />
          <Route
            path='posts/myposts/:username'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Container>
                  <Row>
                    <MyPosts></MyPosts>
                  </Row>
                </Container>
                <Footer></Footer>
              </>
            }
          />
          <Route
            path='/test'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Footer></Footer>
              </>
            }
          />
          {/* 등록된 Routes 외 모든 경로 처리 */}
          <Route
            path='*'
            element={
              <>
                <NotFoundPage></NotFoundPage>
                <Footer></Footer>
              </>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
