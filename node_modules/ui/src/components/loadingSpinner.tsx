import Spinner from 'react-bootstrap/Spinner';

interface LoadingSpinnerProps {
  animation?: 'border' | 'grow';
  variant?: string;
}

export function LoadingSpinner({
  animation = 'border',
  variant = 'primary',
}: LoadingSpinnerProps) {
  return (
    <div className='loading-container'>
      <Spinner animation={animation} variant={variant} role='status'>
        <span className='visually-hidden'>Loading...</span>
      </Spinner>
    </div>
  );
}
