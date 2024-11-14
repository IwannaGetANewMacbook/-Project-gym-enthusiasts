import { Container, Row, Col, Image } from 'react-bootstrap';
import '../UserProfile.css';
import { useState } from 'react';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
} from 'react-icons/fa';

export function UserProfile() {
  // User information state
  const [userData] = useState({
    profilePicture: 'https://via.placeholder.com/150',
    nickname: 'john_doe',
    bio: 'This is my bio. Welcome to my profile!',
    city: 'New York',
    country: 'USA',
    socialLinks: {
      facebook: 'https://facebook.com/johndoe',
      twitter: 'https://twitter.com/johndoe',
      instagram: 'https://instagram.com/johndoe',
      linkedin: 'https://www.linkedin.com/johndoe',
      whatsapp: 'https://web.whatsapp.com/johndoe',
    },
    publicEmail: 'john.doe@example.com',
    joinDate: 'Joined January 2022',
    postsCount: 128,
  });

  return (
    <Container className='user-profile-container'>
      <Row className='justify-content-center'>
        <Col md={10} lg={8}>
          <div className='profile-header text-center my-4'>
            <Image
              src={userData.profilePicture}
              roundedCircle
              className='profile-picture mb-3'
            />
            <h3 className='nickname'>{userData.nickname}</h3>
            <p className='bio'>{userData.bio}</p>
            <div className='social-links'>
              {userData.socialLinks.facebook ? (
                <a
                  href={userData.socialLinks.facebook}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link'
                >
                  <FaFacebook />
                </a>
              ) : null}
              {userData.socialLinks.twitter ? (
                <a
                  href={userData.socialLinks.twitter}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link'
                >
                  <FaTwitter />
                </a>
              ) : null}
              {userData.socialLinks.instagram ? (
                <a
                  href={userData.socialLinks.instagram}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link'
                >
                  <FaInstagram />
                </a>
              ) : null}

              {userData.socialLinks.linkedin ? (
                <a
                  href={userData.socialLinks.linkedin}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link'
                >
                  <FaLinkedin />
                </a>
              ) : null}

              {userData.socialLinks.whatsapp ? (
                <a
                  href={userData.socialLinks.whatsapp}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='social-link'
                >
                  <FaWhatsapp />
                </a>
              ) : null}
            </div>
          </div>
          <div className='profile-stats'>
            <div className='profile-stat'>
              <div className='profile-stat-number'>{userData.postsCount}</div>
              <div className='profile-stat-label'>Posts</div>
            </div>
          </div>
          <div className='profile-details mt-4'>
            <h5>Location</h5>
            <p className='location'>{`${userData.city}, ${userData.country}`}</p>
            <h6>Public Email</h6>
            <p>{userData.publicEmail}</p>
            <p className='join-date'>{userData.joinDate}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
