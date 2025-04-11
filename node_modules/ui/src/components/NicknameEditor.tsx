import { useState } from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import api from '../common/api';
import { useNavigate } from 'react-router-dom';

// 부모 컴포넌트(UserProfile)에서 받아올 props 정의
interface NicknameEditorProps {
  // 이 유저가 닉네임을 변경할 수 있는지 여부 (true일 때만 변경 버튼이 보임)
  canChange: boolean;
  // 닉네임이 성공적으로 변경되었을 때, 부모 컴포넌트에 그 사실을 알려주는 콜백 함수
  onNicknameChange: (newNickname: string) => void;
}

export function NicknameEditor({
  canChange,
  onNicknameChange,
}: NicknameEditorProps) {
  // isEditing -> 닉네임 수정UI(인풋창)이 열려있는지 여부
  const [isEditing, setIsEditing] = useState(false);
  // newNickname -> 사용자가 입력한 새 닉네임
  const [newNickname, setNewNickname] = useState('');
  // error -> 에러 메시지 상태를 저장 (예: 빈 입력값, 서버 에러 등)
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleUpdate = async () => {
    if (newNickname.trim() === '') {
      setError('닉네임은 비워둘 수 없습니다.');
      return;
    }

    try {
      const response = await api.patch('/users/nickname/update-once', {
        newNickname: newNickname,
      });

      alert(response.data.message);

      // ✅ localStorage 안의 user 정보도 즉시 업데이트
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        parsedUser.userNickname = newNickname;
        localStorage.setItem('user', JSON.stringify(parsedUser));
      }

      onNicknameChange(newNickname); // 부모 컴포넌트에 알림
      navigate(`/user/profile/${newNickname}`); // 닉네임 변경 후 해당 페이지로 이동

      setIsEditing(false); // 수정 모드 종료
      setError('');
    } catch (err: any) {
      setError(err.response?.data.message || '닉네임 변경 실패');
    }
  };

  if (!canChange) {
    return;
  }

  return (
    <div className='d-flex flex-column align-items-center'>
      {!isEditing ? (
        <div className='d-flex flex-column align-items-center'>
          <Button
            variant='outline-secondary'
            size='sm'
            onClick={() => setIsEditing(true)}
            className='mb-1'
          >
            닉네임 변경
          </Button>
          {/* OverlayTrigger 를 활용한 UI/UX 개선선 */}
          <OverlayTrigger
            placement='top'
            overlay={
              <Tooltip id='tooltip-nickname-info'>
                한번 변경 후에는 다시 수정할 수 없습니다.
              </Tooltip>
            }
          >
            <div
              className='text-warning small text-center'
              style={{ cursor: 'help' }}
            >
              <i className='bi bi-exclamation-circle me-1'></i>
              닉네임은 계정당 단 한 번 변경할 수 있습니다.
            </div>
          </OverlayTrigger>
          {/* OverlayTrigger 를 활용한 UI/UX 개선선 */}
        </div>
      ) : (
        <>
          <input
            type='text'
            className='form-control mb-2'
            value={newNickname}
            placeholder='새 닉네임 입력'
            onChange={(e) => setNewNickname(e.target.value)}
          />
          {error && <p className='text-danger'>{error}</p>}
          <div>
            <Button
              variant='primary'
              size='sm'
              className='me-2'
              onClick={handleUpdate}
            >
              저장
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => {
                setIsEditing(false);
                setError('');
              }}
            >
              취소
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
