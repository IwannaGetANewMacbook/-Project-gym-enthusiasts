import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Registraion } from './components/Registration';
import { PostPosts } from './components/PostPosts';
import { CardsDetail } from './components/CardsDetail';
import NotFoundPage from './components/NotFoundPage';
import { EditPost } from './components/EditPost';
import { CardsPagination } from './components/CardsPagination';
import { UserProfile } from './components/UserProfile';
import { EditProfilePicture } from './components/EditProfilePicture';
import { EditProfileInfo } from './components/EditProfileInfo';
import { Layout } from './components/Layout';
import { EditSocialLink } from './components/EditSocialLink';
import { GetUserPosts } from './components/GetUserPosts';
import { AuthRedirect } from './components/AuthRedirect';
import { GoogleOAuthProvider } from '@react-oauth/google';
const env = import.meta.env;
const clientId = env.VITE_GOOGLE_CLIENT_ID;

function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <Suspense
          fallback={
            <span className='loader' style={{ display: 'loader' }}></span>
          }
        >
          <Routes>
            <Route
              path='/'
              element={
                <Layout>
                  <CardsPagination />
                </Layout>
              }
            />

            <Route
              path='/detail/:id'
              element={
                <Layout>
                  <CardsDetail />
                </Layout>
              }
            />

            {/* 로그인 페이지로 접속 시, 기존 로그인 유무에따라 redirect 수행*/}
            <Route
              path='/auth/login/email'
              element={
                <AuthRedirect redirectTo='/'>
                  <Layout>
                    <Login />
                  </Layout>
                </AuthRedirect>
              }
            />

            {/* 회원가입입 페이지로 접속 시, 기존 로그인 유무에따라 redirect 수행*/}
            <Route
              path='/auth/register/email'
              element={
                <AuthRedirect redirectTo='/'>
                  <Layout>
                    <Registraion />
                  </Layout>
                </AuthRedirect>
              }
            />

            <Route
              path='/post'
              element={
                <Layout>
                  <PostPosts />
                </Layout>
              }
            />

            <Route
              path='/posts/edit/:postId'
              element={
                <Layout>
                  <EditPost />
                </Layout>
              }
            />

            <Route
              path='/user/profile/:username'
              element={
                <Layout>
                  <UserProfile />
                  <br />
                  <GetUserPosts />
                </Layout>
              }
            />

            <Route
              path='/user/profile/edit/socialLinks'
              element={
                <Layout>
                  <EditSocialLink></EditSocialLink>
                </Layout>
              }
            />

            <Route
              path='/user/profile/edit'
              element={
                <Layout>
                  <EditProfilePicture></EditProfilePicture>
                  <EditProfileInfo></EditProfileInfo>
                </Layout>
              }
            />

            <Route
              path='/test'
              element={
                <Layout>
                  {/* <EditProfile></EditProfile> */}
                  {/* <EditProfilePicture></EditProfilePicture> */}
                  <EditProfileInfo></EditProfileInfo>
                </Layout>
              }
            />

            {/* 등록된 Routes 외 모든 경로 처리 */}
            <Route
              path='*'
              element={
                <Layout>
                  <NotFoundPage />
                </Layout>
              }
            />
          </Routes>
        </Suspense>
      </GoogleOAuthProvider>
    </>
  );
}

export default App;
