import Spinner from 'react-bootstrap/Spinner';

interface LoadingSpinnerProps {
  animation?: 'border' | 'grow';
  variant?: string;
  excuse?: 1 | 2 | 3;
}

export function LoadingSpinner({
  animation = 'border',
  variant = 'primary',
  excuse = 1,
}: LoadingSpinnerProps) {
  return (
    <div className='loading-container'>
      <Spinner animation={animation} variant={variant} role='status'></Spinner>
      {excuse === 2 ? (
        <div>
          <span>잠시만 기다려 주세요.</span>
        </div>
      ) : null}
    </div>
  );
}
