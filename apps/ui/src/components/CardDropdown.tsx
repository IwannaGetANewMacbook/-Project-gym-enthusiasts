import Dropdown from 'react-bootstrap/Dropdown';

export function CardDropdown({ onDelete }: { onDelete: () => void }) {
  return (
    <Dropdown
      align='end'
      className='card-dropdown'
      style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1 }}
    >
      <Dropdown.Toggle
        variant='light'
        bsPrefix='btn btn-link'
        id='dropdown-basic'
        style={{ color: 'white', fontSize: '1.5em' }}
      >
        &#8942;
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href='#'>Edit</Dropdown.Item>
        <Dropdown.Item href='#' onClick={onDelete}>
          Delete
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
