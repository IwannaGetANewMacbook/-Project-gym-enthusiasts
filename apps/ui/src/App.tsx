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
              </>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
