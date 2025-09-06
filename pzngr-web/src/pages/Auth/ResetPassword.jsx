import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layouts';
import { Text } from '../../components/atoms';
import { verifyPasswordResetToken, resetPassword } from '../../services/authService';
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

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' | 'error' | ''
  const [isValidToken, setIsValidToken] = useState(null); // null | true | false
  
  // URL에서 토큰 추출
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  useEffect(() => {
    const verifyToken = async () => {
      // 토큰 유효성 검사
      if (!token || !email) {
        setIsValidToken(false);
        setSubmitMessage('잘못된 접근입니다. 비밀번호 찾기를 다시 시도해주세요.');
        setMessageType('error');
        return;
      }
      
      try {
        // 서버에서 토큰 유효성 검증
        console.log('🔐 토큰 검증:', { token, email });
        const result = await verifyPasswordResetToken(email, token);
        
        if (result.success) {
          setIsValidToken(true);
        } else {
          setIsValidToken(false);
          setSubmitMessage(result.message || '토큰이 유효하지 않거나 만료되었습니다.');
          setMessageType('error');
        }
      } catch (error) {
        console.error('토큰 검증 오류:', error);
        setIsValidToken(false);
        setSubmitMessage('토큰 검증 중 오류가 발생했습니다.');
        setMessageType('error');
      }
    };
    
    verifyToken();
  }, [token, email]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 입력 중에는 메시지 초기화
    if (submitMessage && messageType === 'error') {
      setSubmitMessage('');
      setMessageType('');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return '비밀번호는 8자 이상이어야 합니다.';
    }
    if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(password)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting || !isValidToken) return;
    
    const { newPassword, confirmPassword } = formData;
    
    // 폼 검증
    if (!newPassword.trim()) {
      setSubmitMessage('새 비밀번호를 입력해주세요.');
      setMessageType('error');
      return;
    }
    
    const passwordValidation = validatePassword(newPassword);
    if (passwordValidation) {
      setSubmitMessage(passwordValidation);
      setMessageType('error');
      return;
    }
    
    if (!confirmPassword.trim()) {
      setSubmitMessage('비밀번호 확인을 입력해주세요.');
      setMessageType('error');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setSubmitMessage('비밀번호가 일치하지 않습니다.');
      setMessageType('error');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      // 비밀번호 재설정 서비스 호출
      console.log('🔐 비밀번호 재설정:', { email, token, newPassword: '***' });
      const result = await resetPassword(email, token, newPassword);
      
      if (!result.success) {
        throw new Error(result.message || '비밀번호 재설정에 실패했습니다.');
      }
      
      // 성공 메시지 표시
      setSubmitMessage('비밀번호가 성공적으로 재설정되었습니다. 로그인 페이지로 이동합니다.');
      setMessageType('success');
      
      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
      
    } catch (error) {
      console.error('비밀번호 재설정 오류:', error);
      setSubmitMessage('비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 토큰이 유효하지 않은 경우
  if (isValidToken === false) {
    return (
      <MainLayout>
        <StyledLoginPage>
          <FormContainer>
            <Text variant="h1" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              비밀번호 재설정
            </Text>
            
            <FormMessage type="error" style={{ marginBottom: '2rem' }}>
              {submitMessage}
            </FormMessage>
            
            <LinkContainer>
              <FormLink as={Link} to="/auth/forgot-password">
                비밀번호 찾기
              </FormLink>
              <span> | </span>
              <FormLink as={Link} to="/auth/login">
                로그인
              </FormLink>
            </LinkContainer>
          </FormContainer>
        </StyledLoginPage>
      </MainLayout>
    );
  }

  // 토큰 검증 중
  if (isValidToken === null) {
    return (
      <MainLayout>
        <StyledLoginPage>
          <FormContainer>
            <Text variant="h1" style={{ marginBottom: '2rem', textAlign: 'center' }}>
              비밀번호 재설정
            </Text>
            
            <Text style={{ textAlign: 'center' }}>
              토큰을 확인하는 중...
            </Text>
          </FormContainer>
        </StyledLoginPage>
      </MainLayout>
    );
  }

  // 정상적인 비밀번호 재설정 폼
  return (
    <MainLayout>
      <StyledLoginPage>
        <FormContainer>
          <Text variant="h1" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            비밀번호 재설정
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
            {email}의 새로운 비밀번호를 입력해주세요.
          </Text>
          
          <form onSubmit={handleSubmit}>
            <FormSection>
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor="newPassword">새 비밀번호 *</FormLabel>
                  <FormInput
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="8자 이상, 영문+숫자 포함"
                    required
                    autoComplete="new-password"
                  />
                </FormGroup>
              </FormRow>
              
              <FormRow>
                <FormGroup>
                  <FormLabel htmlFor="confirmPassword">비밀번호 확인 *</FormLabel>
                  <FormInput
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 다시 입력해주세요"
                    required
                    autoComplete="new-password"
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
              disabled={isSubmitting || !isValidToken}
              style={{
                opacity: (isSubmitting || !isValidToken) ? 0.7 : 1,
                cursor: (isSubmitting || !isValidToken) ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? '재설정 중...' : '비밀번호 재설정'}
            </FormButton>
          </form>
          
          <LinkContainer>
            <FormLink as={Link} to="/auth/login">
              로그인으로 돌아가기
            </FormLink>
          </LinkContainer>
        </FormContainer>
      </StyledLoginPage>
    </MainLayout>
  );
};

export default ResetPassword;