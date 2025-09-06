import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layouts';
import { Text } from '../../components/atoms';
import { requestPasswordReset } from '../../services/authService';
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

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error' | ''
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 중에는 메시지 초기화
    if (submitMessage) {
      setSubmitMessage('');
      setMessageType('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // 폼 검증
    if (!formData.email.trim()) {
      setSubmitMessage('이메일을 입력해주세요.');
      setMessageType('error');
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setSubmitMessage('올바른 이메일 형식이 아닙니다.');
      setMessageType('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // 비밀번호 찾기 서비스 호출
      console.log('🔐 비밀번호 찾기 요청:', formData.email);
      const result = await requestPasswordReset(formData.email);
      
      if (!result.success) {
        throw new Error(result.message || '비밀번호 찾기 요청에 실패했습니다.');
      }
      
      // 성공 메시지 표시
      setSubmitMessage(
        `${formData.email}로 비밀번호 재설정 링크를 발송했습니다. ` +
        '이메일을 확인해주세요.'
      );
      setMessageType('success');
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
      
    } catch (error) {
      console.error('비밀번호 찾기 오류:', error);
      setSubmitMessage('비밀번호 찾기 요청 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <StyledLoginPage>
        <FormContainer>
          <Text variant="h1" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            비밀번호 찾기
          </Text>
          
          <Text 
            variant="body2" 
            style={{ 
              marginBottom: '2rem', 
              textAlign: 'center', 
              color: '#666',
              lineHeight: '1.5'
            }}
          >
            등록하신 이메일 주소를 입력하시면<br />
            비밀번호 재설정 링크를 보내드립니다.
          </Text>
          
          <form onSubmit={handleSubmit}>
            <FormSection>
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor="email">이메일 주소 *</FormLabel>
                  <FormInput
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="이메일을 입력해주세요"
                    required
                    autoComplete="email"
                  />
                </FormGroup>
              </FormRow>
            </FormSection>
            
            {submitMessage && (
              <FormMessage type={messageType}>
                {submitMessage}
              </FormMessage>
            )}
            
            <FormButton 
              type="submit" 
              disabled={isSubmitting}
              style={{
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? '발송 중...' : '재설정 링크 발송'}
            </FormButton>
          </form>
          
          <LinkContainer>
            <FormLink as={Link} to="/auth/login">
              로그인으로 돌아가기
            </FormLink>
            <span> | </span>
            <FormLink as={Link} to="/auth/register">
              회원가입
            </FormLink>
          </LinkContainer>
        </FormContainer>
      </StyledLoginPage>
    </MainLayout>
  );
};

export default ForgotPassword;