import './App.css';

import { NavBar } from './components/NavBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cards } from './components/Cards';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { MainBg } from './components/MainBg';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Registraion } from './components/Registration';
import { Post } from './components/Post';
import { CardsDetail } from './components/CardsDetail';
import { Footer } from './components/Footer';
import NotFoundPage from './components/NotFoundPage';
import { MyPosts } from './components/MyPosts';
import { EditPost } from './components/EditPost';

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
            path='/posts/edit/:postId'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <EditPost></EditPost>
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
