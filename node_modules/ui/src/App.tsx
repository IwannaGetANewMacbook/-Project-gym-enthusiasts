import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import { Registraion } from './components/Registration';
import { PostPosts } from './components/PostPosts';
import { CardsDetail } from './components/CardsDetail';
import NotFoundPage from './components/NotFoundPage';
import { MyPosts } from './components/MyPosts';
import { EditPost } from './components/EditPost';
import { CardsPagination } from './components/CardsPagination';
import { UserProfile } from './components/UserProfile';
import { EditProfilePicture } from './components/EditProfilePicture';
import { EditProfileInfo } from './components/EditProfileInfo';
import { Layout } from './components/Layout';
import { EditSocialLink } from './components/EditSocialLink';

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

          <Route
            path='/auth/login/email'
            element={
              <Layout>
                <Login />
              </Layout>
            }
          />

          <Route
            path='/auth/register/email'
            element={
              <Layout>
                <Registraion />
              </Layout>
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
            path='posts/myposts/:username'
            element={
              <Layout>
                <UserProfile />
                <br />
                <MyPosts />
              </Layout>
            }
          />

          <Route
            path='/user/profile'
            element={
              <Layout>
                <UserProfile />
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
    </>
  );
}

export default App;
