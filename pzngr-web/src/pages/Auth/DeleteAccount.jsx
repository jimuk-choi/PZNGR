import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layouts';
import { Text } from '../../components/atoms';
import { useUserStore } from '../../stores/userStore';
import { deleteUserAccount } from '../../services/authService';
import { 
  StyledLoginPage, 
  FormContainer, 
  FormSection, 
  FormRow, 
  FormGroup, 
  FormLabel, 
  FormInput, 
  FormButton,
  FormMessage,
  LinkContainer,
  FormLink
} from './Auth.styles';

const DeleteAccount = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useUserStore();
  const [confirmationData, setConfirmationData] = useState({
    password: '',
    confirmText: '',
    reason: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [errors, setErrors] = useState({});
  const [showFinalStep, setShowFinalStep] = useState(false);
  
  // 로그인 여부 확인
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/auth/login');
      return;
    }
  }, [isLoggedIn, user, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    setConfirmationData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 중에는 메시지와 에러 초기화
    if (submitMessage) {
      setSubmitMessage('');
      setMessageType('');
    }
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!confirmationData.password) {
      newErrors.password = '현재 비밀번호를 입력해주세요.';
    }
    
    if (!confirmationData.reason) {
      newErrors.reason = '탈퇴 사유를 선택해주세요.';
    }
    
    if (confirmationData.confirmText !== '회원탈퇴') {
      newErrors.confirmText = '정확히 "회원탈퇴"라고 입력해주세요.';
    }
    
    return newErrors;
  };

  const handleFirstStep = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setShowFinalStep(true);
    setSubmitMessage('');
    setMessageType('');
  };

  const handleFinalDelete = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const result = await deleteUserAccount(user.email, confirmationData.password, confirmationData.reason);
      
      if (result.success) {
        setSubmitMessage('회원 탈퇴가 완료되었습니다. 그동안 이용해 주셔서 감사합니다.');
        setMessageType('success');
        
        // 로그아웃 처리 후 메인 페이지로 이동
        setTimeout(() => {
          logout();
          navigate('/');
        }, 3000);
      } else {
        setSubmitMessage(result.message || '회원 탈퇴 처리 중 오류가 발생했습니다.');
        setMessageType('error');
        setShowFinalStep(false);
      }
      
    } catch (error) {
      console.error('회원 탈퇴 오류:', error);
      setSubmitMessage('회원 탈퇴 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setMessageType('error');
      setShowFinalStep(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (showFinalStep) {
      setShowFinalStep(false);
    } else {
      navigate('/auth/edit-profile');
    }
  };

  if (!isLoggedIn || !user) {
    return null; // 로그인 리다이렉트 처리 중
  }

  return (
    <MainLayout>
      <StyledLoginPage>
        <FormContainer>
          <Text variant="h1" style={{ marginBottom: '1rem', textAlign: 'center', color: '#dc3545' }}>
            {showFinalStep ? '⚠️ 최종 확인' : '회원 탈퇴'}
          </Text>
          
          {!showFinalStep ? (
            <>
              <div style={{ 
                backgroundColor: '#fff3cd', 
                border: '1px solid #ffeaa7', 
                borderRadius: '6px',
                padding: '1rem',
                marginBottom: '2rem'
              }}>
                <Text variant="small" style={{ color: '#856404', lineHeight: '1.5' }}>
                  ⚠️ <strong>주의사항</strong><br />
                  • 회원 탈퇴 시 모든 개인정보가 삭제됩니다<br />
                  • 주문 내역, 적립금, 쿠폰이 모두 삭제됩니다<br />
                  • 탈퇴 후에는 동일한 이메일로 재가입할 수 없습니다<br />
                  • <strong>이 작업은 되돌릴 수 없습니다</strong>
                </Text>
              </div>
              
              <form onSubmit={handleFirstStep}>
                <FormSection>
                  <FormRow>
                    <FormGroup>
                      <FormLabel htmlFor="password">현재 비밀번호 확인 *</FormLabel>
                      <FormInput
                        type="password"
                        id="password"
                        name="password"
                        value={confirmationData.password}
                        onChange={handleInputChange}
                        placeholder="현재 비밀번호를 입력해주세요"
                        disabled={isSubmitting}
                      />
                      {errors.password && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.password}</Text>}
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel htmlFor="reason">탈퇴 사유 *</FormLabel>
                      <select
                        id="reason"
                        name="reason"
                        value={confirmationData.reason}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          fontSize: '1rem'
                        }}
                      >
                        <option value="">탈퇴 사유를 선택해주세요</option>
                        <option value="서비스_불만">서비스에 대한 불만</option>
                        <option value="사용_빈도_낮음">사용 빈도가 낮음</option>
                        <option value="개인정보_우려">개인정보 보호 우려</option>
                        <option value="다른_서비스_이용">다른 서비스 이용</option>
                        <option value="기타">기타</option>
                      </select>
                      {errors.reason && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.reason}</Text>}
                    </FormGroup>
                  </FormRow>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel htmlFor="confirmText">확인 문구 입력 *</FormLabel>
                      <FormInput
                        type="text"
                        id="confirmText"
                        name="confirmText"
                        value={confirmationData.confirmText}
                        onChange={handleInputChange}
                        placeholder='정확히 "회원탈퇴"라고 입력해주세요'
                        disabled={isSubmitting}
                      />
                      <Text variant="small" style={{color: '#666', marginTop: '0.25rem'}}>
                        탈퇴 의사를 확인하기 위해 "회원탈퇴"라고 정확히 입력해주세요.
                      </Text>
                      {errors.confirmText && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.confirmText}</Text>}
                    </FormGroup>
                  </FormRow>
                </FormSection>
                
                {submitMessage && (
                  <FormMessage type={messageType}>
                    {submitMessage}
                  </FormMessage>
                )}
                
                <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                  <FormButton 
                    type="button"
                    onClick={handleCancel}
                    style={{
                      backgroundColor: '#6c757d',
                      flex: '1'
                    }}
                  >
                    취소
                  </FormButton>
                  
                  <FormButton 
                    type="submit" 
                    disabled={isSubmitting}
                    style={{
                      backgroundColor: '#dc3545',
                      opacity: isSubmitting ? 0.7 : 1,
                      cursor: isSubmitting ? 'not-allowed' : 'pointer',
                      flex: '1'
                    }}
                  >
                    {isSubmitting ? '확인 중...' : '다음 단계'}
                  </FormButton>
                </div>
              </form>
            </>
          ) : (
            <div>
              <div style={{ 
                backgroundColor: '#f8d7da', 
                border: '1px solid #f5c6cb', 
                borderRadius: '6px',
                padding: '1.5rem',
                marginBottom: '2rem',
                textAlign: 'center'
              }}>
                <Text variant="h3" style={{ color: '#721c24', marginBottom: '1rem' }}>
                  🚨 정말로 탈퇴하시겠습니까?
                </Text>
                <Text style={{ color: '#721c24', lineHeight: '1.5', marginBottom: '1rem' }}>
                  <strong>{user.email}</strong> 계정이 완전히 삭제됩니다.<br />
                  이 작업은 되돌릴 수 없으며, 모든 데이터가 영구적으로 삭제됩니다.
                </Text>
                <Text variant="small" style={{ color: '#721c24' }}>
                  탈퇴 사유: <strong>
                    {confirmationData.reason === '서비스_불만' ? '서비스에 대한 불만' :
                     confirmationData.reason === '사용_빈도_낮음' ? '사용 빈도가 낮음' :
                     confirmationData.reason === '개인정보_우려' ? '개인정보 보호 우려' :
                     confirmationData.reason === '다른_서비스_이용' ? '다른 서비스 이용' :
                     '기타'}
                  </strong>
                </Text>
              </div>
              
              {submitMessage && (
                <FormMessage type={messageType}>
                  {submitMessage}
                </FormMessage>
              )}
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <FormButton 
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#28a745',
                    flex: '1'
                  }}
                >
                  아니오, 계속 사용할게요
                </FormButton>
                
                <FormButton 
                  type="button"
                  onClick={handleFinalDelete}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#dc3545',
                    opacity: isSubmitting ? 0.7 : 1,
                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                    flex: '1'
                  }}
                >
                  {isSubmitting ? '탈퇴 처리 중...' : '네, 탈퇴하겠습니다'}
                </FormButton>
              </div>
            </div>
          )}
          
          <LinkContainer style={{ marginTop: '2rem' }}>
            <FormLink onClick={() => navigate('/auth/edit-profile')} style={{cursor: 'pointer'}}>
              회원 정보 수정으로 돌아가기
            </FormLink>
          </LinkContainer>
        </FormContainer>
      </StyledLoginPage>
    </MainLayout>
  );
};

export default DeleteAccount;