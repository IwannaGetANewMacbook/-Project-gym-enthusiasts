/**
 *
 */
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import React from 'react';

interface NicknameInputSectionProps {
  nickname: string;
  isNicknameValid: boolean;
  isNicknameChecked: boolean;
  nicknameCheckMessage: string;
  onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheckNickname: () => void;
}

export function NicknameInputSection({
  nickname,
  isNicknameValid,
  isNicknameChecked,
  nicknameCheckMessage,
  onNicknameChange,
  onCheckNickname,
}: NicknameInputSectionProps) {
  const showInvalid =
    (nickname.length > 0 && !isNicknameValid) || // 닉네임 형식이 맞지 않음
    (!isNicknameChecked && isNicknameValid); // 닉네임 형식은 맞지만 중복 체크는 안한 케이스
  const showValid = isNicknameChecked && isNicknameValid;

  return (
    <Form.Group as={Row} className='mb-3' controlId='formHorizontalNickname'>
      <Form.Label column sm={2}>
        nickname
      </Form.Label>
      <Col sm={5}>
        <Form.Control
          type='text'
          placeholder='nickname'
          value={nickname}
          onChange={onNicknameChange}
          isInvalid={showInvalid}
          isValid={showValid}
        />
        <Form.Control.Feedback type='invalid'>
          {!isNicknameValid
            ? '닉네임은 한글/영문/숫자 조합 2~12자, 숫자만은 불가능합니다.'
            : nicknameCheckMessage.length === 0
              ? '닉네임 중복 확인이 필요합니다.'
              : nicknameCheckMessage}
        </Form.Control.Feedback>
        <Form.Control.Feedback type='valid'>
          사용가능한 닉네임 입니다.
        </Form.Control.Feedback>
      </Col>
      <Col sm='auto'>
        <Button
          variant='outline-info'
          size='sm'
          disabled={!nickname}
          onClick={onCheckNickname}
        >
          중복 확인
        </Button>
      </Col>
    </Form.Group>
  );
}
