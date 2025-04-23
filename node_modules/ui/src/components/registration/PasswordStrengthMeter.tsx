import zxcvbn from 'zxcvbn';
import { ProgressBar } from 'react-bootstrap';

interface PasswordStrengthMeterProps {
  password: string;
}

const strengthLabels = ['매우 약함', '약함', '보통', '강함', '매우 강함'];
const strengthVariants = ['danger', 'danger', 'warning', 'info', 'success'];

export function PasswordStrengthMeter({
  password,
}: PasswordStrengthMeterProps) {
  const result = zxcvbn(password);
  const score = result.score;
  const feedback = result.feedback.suggestions.join(' ');

  if (!password) {
    return null; // 비밀번호가 비어있을 때는 아무것도 렌더링하지 않음
  }

  return (
    <div style={{ fontSize: '0.85rem' }}>
      <ProgressBar
        now={(score + 1) * 20}
        variant={strengthVariants[score]}
        label={strengthLabels[score]}
        animated
      />
      {feedback && <div className='text-muted small mt-1'>{feedback}</div>}
    </div>
  );
}
