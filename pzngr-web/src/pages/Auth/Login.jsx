import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledLoginPage, FormContainer, FormSection, FormRow, ErrorMessage, SuccessMessage } from './Auth.styles';
import { useUserStore } from '../../stores/userStore';
import { validateLoginForm } from '../../utils/validation';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/Text';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 실시간 유효성 검사 - 에러 제거
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    // 폼 유효성 검증
    const validationResult = validateLoginForm(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 실제 로그인 로직은 나중에 구현 예정 (현재는 모의 구현)
      console.log('로그인 시도:', {
        email: formData.email,
        rememberMe: formData.rememberMe
      });

      // 임시 사용자 데이터 (실제로는 서버에서 받아올 데이터)
      const mockUserData = {
        id: `user_${Date.now()}`,
        name: '테스트 사용자',
        email: formData.email,
        isAdmin: false
      };

      // 로그인 처리 (게스트 데이터 마이그레이션 포함)
      const loginResult = await login(mockUserData, true);
      
      if (loginResult.success) {
        setSubmitMessage('로그인이 완료되었습니다!');
        
        // 1초 후 메인 페이지로 이동
        setTimeout(() => {
          navigate('/');
        }, 1000);
      } else {
        setSubmitMessage('로그인에 실패했습니다. 다시 시도해 주세요.');
      }

    } catch (error) {
      console.error('로그인 오류:', error);
      setSubmitMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <StyledLoginPage>
        <FormContainer>
          <Text variant="h1" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            로그인
          </Text>
          
          <form onSubmit={handleSubmit}>
            <FormSection>
              <FormRow>
                <label htmlFor="email">이메일</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="email@example.com"
                  disabled={isSubmitting}
                />
                {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
              </FormRow>

              <FormRow>
                <label htmlFor="password">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 입력해주세요"
                  disabled={isSubmitting}
                />
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              </FormRow>

              <FormRow>
                <label>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span>로그인 상태 유지</span>
                </label>
              </FormRow>
            </FormSection>

            {submitMessage && (
              <SuccessMessage>{submitMessage}</SuccessMessage>
            )}

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                style={{ width: '100%', padding: '1rem' }}
              >
                {isSubmitting ? '로그인 중...' : '로그인'}
              </Button>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/register')}
                disabled={isSubmitting}
              >
                아직 계정이 없으신가요? 회원가입
              </Button>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Button
                type="button"
                variant="text"
                onClick={() => navigate('/forgot-password')}
                disabled={isSubmitting}
              >
                비밀번호를 잊으셨나요?
              </Button>
            </div>
          </form>
        </FormContainer>
      </StyledLoginPage>
    </MainLayout>
  );
};

export default Login;