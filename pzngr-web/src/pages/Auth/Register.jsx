import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledRegisterPage, FormContainer, FormSection, FormRow, ErrorMessage, SuccessMessage } from './Auth.styles';
import { validateRegistrationForm, formatPhoneNumber, getPasswordStrengthText, getPasswordStrengthColor } from '../../utils/validation';
import { createEmailCheckDebounce, registerUser, getTestEmails } from '../../services/authService';
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
  
  // 이메일 중복 체크 관련 상태
  const [emailCheck, setEmailCheck] = useState({
    isChecking: false,
    isChecked: false,
    isAvailable: false,
    message: ''
  });

  // 테스트 이메일 목록
  const [testEmails, setTestEmails] = useState([]);

  // 이메일 중복 체크 디바운스 함수
  const debouncedEmailCheck = useCallback(
    () => createEmailCheckDebounce(800),
    []
  );

  // 이메일 중복 체크 결과 처리
  const handleEmailCheckResult = useCallback((result) => {
    setEmailCheck({
      isChecking: false,
      isChecked: true,
      isAvailable: result.isValid && result.isAvailable,
      message: result.message
    });

    // 에러 상태 업데이트
    if (!result.isValid || !result.isAvailable) {
      setErrors(prev => ({
        ...prev,
        email: result.message
      }));
    } else {
      setErrors(prev => {
        const updatedErrors = { ...prev };
        delete updatedErrors.email;
        return updatedErrors;
      });
    }
  }, []);

  // 이메일 중복 체크 실행
  const checkEmailAvailability = useCallback((email) => {
    if (!email || email.trim() === '') {
      setEmailCheck({
        isChecking: false,
        isChecked: false,
        isAvailable: false,
        message: ''
      });
      return;
    }

    setEmailCheck(prev => ({
      ...prev,
      isChecking: true,
      isChecked: false
    }));

    debouncedEmailCheck()(email, handleEmailCheckResult);
  }, [debouncedEmailCheck, handleEmailCheckResult]);

  // 컴포넌트 마운트 시 테스트 이메일 로드
  useEffect(() => {
    try {
      const emails = getTestEmails();
      setTestEmails(emails);
    } catch (error) {
      console.error('테스트 이메일 로드 오류:', error);
      setTestEmails([]);
    }
  }, []);

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

    // 이메일 중복 체크
    if (name === 'email') {
      checkEmailAvailability(processedValue);
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
    
    // 이메일 중복 체크가 완료되지 않았거나 사용 불가능한 경우
    if (!emailCheck.isChecked || !emailCheck.isAvailable) {
      setSubmitMessage('이메일 중복 체크를 완료해 주세요.');
      setIsSubmitting(false);
      return;
    }
    
    // 폼 유효성 검증
    const validationResult = validateRegistrationForm(formData);
    
    if (!validationResult.isValid) {
      setErrors(validationResult.errors);
      setIsSubmitting(false);
      return;
    }

    try {
      // 실제 회원가입 처리
      const registerResult = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        birthDate: formData.birthDate,
        marketingAccepted: formData.marketingAccepted
      });

      if (registerResult.success) {
        setSubmitMessage(registerResult.message + ' 로그인 페이지로 이동합니다.');
        
        // 2초 후 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setSubmitMessage(registerResult.message);
      }

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
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com"
                    disabled={isSubmitting}
                    style={{
                      paddingRight: emailCheck.isChecking ? '40px' : '12px'
                    }}
                  />
                  {emailCheck.isChecking && (
                    <div style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      color: '#666'
                    }}>
                      ⏳
                    </div>
                  )}
                </div>
                
                {/* 이메일 중복 체크 상태 표시 */}
                {emailCheck.message && !errors.email && (
                  <div style={{
                    fontSize: '0.875rem',
                    marginTop: '0.5rem',
                    color: emailCheck.isAvailable ? '#28a745' : '#dc3545',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {emailCheck.isAvailable ? '✓' : '⚠'} {emailCheck.message}
                  </div>
                )}
                
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
                  placeholder="안전한 비밀번호를 입력해주세요"
                  disabled={isSubmitting}
                />
                
                {/* 비밀번호 규칙 안내 */}
                <div style={{
                  fontSize: '0.75rem',
                  color: '#666',
                  marginTop: '0.5rem',
                  padding: '0.75rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '6px',
                  border: '1px solid #e9ecef'
                }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', color: '#495057' }}>
                    비밀번호 규칙:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: passwordStrength.checks?.length ? '#28a745' : '#6c757d'
                    }}>
                      <span style={{ marginRight: '0.5rem' }}>
                        {passwordStrength.checks?.length ? '✓' : '○'}
                      </span>
                      8자 이상
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: passwordStrength.checks?.uppercase ? '#28a745' : '#6c757d'
                    }}>
                      <span style={{ marginRight: '0.5rem' }}>
                        {passwordStrength.checks?.uppercase ? '✓' : '○'}
                      </span>
                      대문자 포함 (A-Z)
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: passwordStrength.checks?.lowercase ? '#28a745' : '#6c757d'
                    }}>
                      <span style={{ marginRight: '0.5rem' }}>
                        {passwordStrength.checks?.lowercase ? '✓' : '○'}
                      </span>
                      소문자 포함 (a-z)
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: passwordStrength.checks?.number ? '#28a745' : '#6c757d'
                    }}>
                      <span style={{ marginRight: '0.5rem' }}>
                        {passwordStrength.checks?.number ? '✓' : '○'}
                      </span>
                      숫자 포함 (0-9)
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      color: passwordStrength.checks?.special ? '#28a745' : '#6c757d'
                    }}>
                      <span style={{ marginRight: '0.5rem' }}>
                        {passwordStrength.checks?.special ? '✓' : '○'}
                      </span>
                      특수문자 포함 (!@#$%^&* 등)
                    </div>
                  </div>
                </div>

                {/* 비밀번호 강도 표시 */}
                {formData.password && (
                  <div style={{
                    fontSize: '0.875rem',
                    color: getPasswordStrengthColor(passwordStrength.strength),
                    marginTop: '0.5rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <span style={{ marginRight: '0.5rem' }}>
                      {passwordStrength.strength === 'strong' ? '🔐' : 
                       passwordStrength.strength === 'medium' ? '🔒' : '🔓'}
                    </span>
                    비밀번호 강도: {getPasswordStrengthText(passwordStrength.strength)}
                    {passwordStrength.strength === 'strong' && (
                      <span style={{ color: '#28a745', marginLeft: '0.5rem' }}>✨ 매우 안전</span>
                    )}
                    {passwordStrength.strength === 'medium' && (
                      <span style={{ color: '#ffc107', marginLeft: '0.5rem' }}>⚡ 더 강하게 만들어보세요</span>
                    )}
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

            {/* 개발용: 기존 테스트 이메일 목록 */}
            <div style={{ 
              marginTop: '2rem', 
              padding: '1rem', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              fontSize: '0.875rem'
            }}>
              <Text variant="small" style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                개발용 - 기존 테스트 이메일 (중복 체크 테스트용):
              </Text>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {testEmails.map((testUser, index) => (
                  <span 
                    key={index}
                    style={{ 
                      padding: '4px 8px',
                      backgroundColor: testUser.status === 'active' ? '#e7f3ff' : '#ffebee',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      color: testUser.status === 'active' ? '#1976d2' : '#d32f2f'
                    }}
                  >
                    {testUser.email}
                  </span>
                ))}
              </div>
              <Text variant="small" style={{ marginTop: '0.5rem', color: '#666' }}>
                위 이메일들은 이미 사용 중입니다.
              </Text>
            </div>
          </form>
        </FormContainer>
      </StyledRegisterPage>
    </MainLayout>
  );
};

export default Register;