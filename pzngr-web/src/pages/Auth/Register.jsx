import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledRegisterPage, FormContainer, FormSection, FormRow, ErrorMessage, SuccessMessage } from './Auth.styles';
import { validateRegistrationForm, formatPhoneNumber, getPasswordStrengthText, getPasswordStrengthColor } from '../../utils/validation';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/Text';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    birthDate: '',
    termsAccepted: false,
    privacyAccepted: false,
    marketingAccepted: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState({ strength: 'weak' });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let processedValue = value;
    
    // 전화번호 자동 포맷팅
    if (name === 'phone') {
      processedValue = formatPhoneNumber(value);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    // 실시간 유효성 검사
    if (errors[name]) {
      const updatedErrors = { ...errors };
      delete updatedErrors[name];
      setErrors(updatedErrors);
    }

    // 비밀번호 강도 실시간 체크
    if (name === 'password') {
      const { validatePassword } = require('../../utils/validation');
      const strengthResult = validatePassword(processedValue);
      setPasswordStrength(strengthResult);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    // 폼 유효성 검증
    const validationResult = validateRegistrationForm(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 실제 회원가입 로직은 나중에 구현 예정 (현재는 모의 구현)
      console.log('회원가입 데이터:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        birthDate: formData.birthDate
      });

      // 임시로 성공 메시지 표시
      setSubmitMessage('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
      
      // 2초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.error('회원가입 오류:', error);
      setSubmitMessage('회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <StyledRegisterPage>
        <FormContainer>
          <Text variant="h1" style={{ marginBottom: '2rem', textAlign: 'center' }}>
            회원가입
          </Text>
          
          <form onSubmit={handleSubmit}>
            <FormSection>
              <Text variant="h3" style={{ marginBottom: '1rem' }}>기본 정보</Text>
              
              <FormRow>
                <label htmlFor="name">이름 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="이름을 입력해주세요"
                  disabled={isSubmitting}
                />
                {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
              </FormRow>

              <FormRow>
                <label htmlFor="email">이메일 *</label>
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
                <label htmlFor="phone">휴대폰 번호 *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="010-1234-5678"
                  disabled={isSubmitting}
                />
                {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
              </FormRow>

              <FormRow>
                <label htmlFor="birthDate">생년월일</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {errors.birthDate && <ErrorMessage>{errors.birthDate}</ErrorMessage>}
              </FormRow>
            </FormSection>

            <FormSection>
              <Text variant="h3" style={{ marginBottom: '1rem' }}>비밀번호 설정</Text>
              
              <FormRow>
                <label htmlFor="password">비밀번호 *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="8자 이상, 대/소문자, 숫자, 특수문자 포함"
                  disabled={isSubmitting}
                />
                {formData.password && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: getPasswordStrengthColor(passwordStrength.strength),
                    marginTop: '0.5rem'
                  }}>
                    비밀번호 강도: {getPasswordStrengthText(passwordStrength.strength)}
                  </div>
                )}
                {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
              </FormRow>

              <FormRow>
                <label htmlFor="confirmPassword">비밀번호 확인 *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="비밀번호를 다시 입력해주세요"
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword}</ErrorMessage>}
              </FormRow>
            </FormSection>

            <FormSection>
              <Text variant="h3" style={{ marginBottom: '1rem' }}>약관 동의</Text>
              
              <FormRow>
                <label>
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formData.termsAccepted}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span>이용약관에 동의합니다. (필수)</span>
                </label>
                {errors.termsAccepted && <ErrorMessage>{errors.termsAccepted}</ErrorMessage>}
              </FormRow>

              <FormRow>
                <label>
                  <input
                    type="checkbox"
                    name="privacyAccepted"
                    checked={formData.privacyAccepted}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span>개인정보처리방침에 동의합니다. (필수)</span>
                </label>
                {errors.privacyAccepted && <ErrorMessage>{errors.privacyAccepted}</ErrorMessage>}
              </FormRow>

              <FormRow>
                <label>
                  <input
                    type="checkbox"
                    name="marketingAccepted"
                    checked={formData.marketingAccepted}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  <span>마케팅 정보 수신에 동의합니다. (선택)</span>
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
                {isSubmitting ? '가입 중...' : '회원가입'}
              </Button>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate('/login')}
                disabled={isSubmitting}
              >
                이미 계정이 있으신가요? 로그인
              </Button>
            </div>
          </form>
        </FormContainer>
      </StyledRegisterPage>
    </MainLayout>
  );
};

export default Register;