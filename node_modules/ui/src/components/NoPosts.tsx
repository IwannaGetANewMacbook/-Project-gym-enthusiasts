import { Container, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NoPosts = ({ username }: { username: string }) => {
  const navigate = useNavigate();
  return (
    <Container
      className='d-flex justify-content-center align-items-center'
      style={{ height: '100vh' }}
    >
      <Card
        className='text-center shadow'
        style={{
          padding: '30px',
          maxWidth: '400px',
          borderRadius: '10px',
          marginTop: '-300px',
        }}
      >
        <Card.Img
          variant='top'
          src='https://cdn.pixabay.com/photo/2017/01/31/13/14/animal-2023924_960_720.png'
          alt='No Posts Illustration'
          style={{ width: '150px', margin: '0 auto' }}
        />
        <Card.Body>
          <Card.Title>No Posts Yet!</Card.Title>
          <Card.Text>{username} hasn't created any posts yet.</Card.Text>
          <Button
            variant='primary'
            onClick={() => {
              navigate('/post');
            }}
          >
            Go to post
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default NoPosts;
