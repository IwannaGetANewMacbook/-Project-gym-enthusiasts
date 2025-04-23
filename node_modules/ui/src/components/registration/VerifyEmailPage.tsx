import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../common/api';
import { Spinner } from 'react-bootstrap';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await api.get(`/mail/verify-email?token=${token}`);
        setMessage(res.data.message || '이메일 인증이 완료되었습니다.');
        // 이렇게 로컬스토리지에 저장하면 회원가입탭에서 'storage event'를 통해 localStorage를 감지할 수 잇음.
        localStorage.setItem('isEmailVerified', 'true');
      } catch (e: any) {
        setMessage(
          e.response?.data.message || '이메일 인증 중 오류가 발생했습니다.'
        );
        localStorage.setItem('isEmailVerified', 'false');
      } finally {
        setLoading(false);

        // ✅ 탭 자동으로 닫기 (조심스레 안내)
        setTimeout(() => {
          window.close();
        }, 3000);
      }
    };

    if (token) {
      verify();
    } else {
      setMessage('인증 토큰이 유효하지 않습니다.');
      setLoading(false);
    }
  }, [token]);

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-light'>
      {loading ? (
        <div className='text-center'>
          <Spinner animation='border' variant='primary' />
          <p className='mt-3'>이메일 인증 중입니다. 잠시만 기다려주세요...</p>
        </div>
      ) : (
        <div
          className='p-4 rounded shadow'
          style={{
            backgroundColor: 'white',
            maxWidth: '400px',
            textAlign: 'center',
          }}
        >
          <h3 className='mb-3'>📬 이메일 인증 결과</h3>
          <p className='fs-5'>{message}</p>
          <p className='text-muted mt-4'>이 창은 3초 후 자동으로 닫힙니다.</p>
        </div>
      )}
    </div>
  );
}
