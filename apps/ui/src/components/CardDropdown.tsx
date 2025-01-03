import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';

export function CardDropdown({
  postId,
  onDelete,
}: {
  postId: number;
  onDelete: () => void;
}) {
  // const postId = useParams();

  const navigate = useNavigate();

  return (
    <Dropdown
      align='end'
      className='card-dropdown'
      style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 1,
        marginTop: '-20px',
      }}
    >
      <Dropdown.Toggle
        variant='light'
        bsPrefix='btn btn-link'
        id='dropdown-basic'
        style={{ color: 'black', fontSize: '1.5em' }}
      >
        &#8942;
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={() => navigate(`/posts/edit/${postId}`)}>
          Edit
        </Dropdown.Item>
        <Dropdown.Item onClick={onDelete}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
