import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface TermsAgreementProps {
  termsAgreed: boolean;
  privacyAgreed: boolean;
  onTermsChange: (checked: boolean) => void;
  onPrivacyChange: (checked: boolean) => void;
}

export function TermsAgreement({
  termsAgreed,
  privacyAgreed,
  onTermsChange,
  onPrivacyChange,
}: TermsAgreementProps) {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [termsHtml, setTermsHtml] = useState('');
  const [privacyHtml, setPrivacyHtml] = useState('');

  const allAgreed = termsAgreed && privacyAgreed;

  const handleAllChange = (checked: boolean) => {
    onTermsChange(checked);
    onPrivacyChange(checked);
  };

  useEffect(() => {
    fetch('/terms-of-service.html')
      .then((res) => res.text())
      .then(setTermsHtml);

    fetch('/privacy-policy.html')
      .then((res) => res.text())
      .then(setPrivacyHtml);
  }, []);

  return (
    <>
      <Form.Group as={Row} className='mb-3'>
        <Col sm={{ span: 10, offset: 2 }}>
          <Form.Check
            type='checkbox'
            id='terms'
            label={
              <>
                <span
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: 'blue',
                  }}
                  onClick={() => setShowTermsModal(true)}
                >
                  이용약관
                </span>
                에 동의합니다.
              </>
            }
            checked={termsAgreed}
            onChange={(e) => onTermsChange(e.currentTarget.checked)}
          />

          <Form.Check
            type='checkbox'
            id='privacy'
            label={
              <>
                <span
                  style={{
                    textDecoration: 'underline',
                    cursor: 'pointer',
                    color: 'blue',
                  }}
                  onClick={() => setShowPrivacyModal(true)}
                >
                  개인정보 처리방침
                </span>
                에 동의합니다.
              </>
            }
            checked={privacyAgreed}
            onChange={(e) => onPrivacyChange(e.currentTarget.checked)}
            className='mt-2'
          />

          <Form.Check
            type='checkbox'
            id='all'
            label={<strong>전체 동의합니다</strong>}
            checked={allAgreed}
            onChange={(e) => handleAllChange(e.currentTarget.checked)}
            className='mb-2'
          />
        </Col>
      </Form.Group>

      {/* 이용약관 모달 */}
      <Modal
        show={showTermsModal}
        onHide={() => setShowTermsModal(false)}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>이용약관</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: termsHtml }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setShowTermsModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 개인정보 처리방침 모달 */}
      <Modal
        show={showPrivacyModal}
        onHide={() => setShowPrivacyModal(false)}
        size='lg'
      >
        <Modal.Header closeButton>
          <Modal.Title>개인정보 처리방침</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          <div dangerouslySetInnerHTML={{ __html: privacyHtml }} />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setShowPrivacyModal(false)}
          >
            닫기
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
