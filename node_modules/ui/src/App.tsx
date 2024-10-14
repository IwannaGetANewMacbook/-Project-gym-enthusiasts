import './App.css';

import { NavBar } from './components/navBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Cards } from './components/cards';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import { MainBg } from './components/mainBg';
import { Suspense, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/login';
import { Registraion } from './components/registration';
import { Post } from './components/Post';
import { CardsDetail } from './components/cards.detail';
import { Footer } from './components/footer';
import { MyPage } from './components/myPage';
import NotFoundPage from './components/notFoundPage';
import { newAccessToken } from './common/renewAccessToken';

function App() {
  // useEffect(() => {
  //   // 7초마다 newAccessToken 함수 호출하여 토큰 갱신
  //   const interval = setInterval(() => {
  //     newAccessToken().then((newToken) => {
  //       if (newToken) {
  //         window.localStorage.setItem('accessToken', newToken);
  //         console.log('accessToken 갱신 완료.');
  //       }
  //     });
  //   }, 7000); // 7초마다 실행

  //   // 컴포넌트가 언마운트 될 때 interval 정리
  //   return () => clearInterval(interval);
  // });

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
            path='posts/mypage/:username'
            element={
              <>
                <NavBar></NavBar>
                <MainBg />
                <br />
                <Container>
                  <Row>
                    <MyPage></MyPage>
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
