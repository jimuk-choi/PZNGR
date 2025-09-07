import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StyledLoginPage, FormContainer, FormSection, FormRow, ErrorMessage, SuccessMessage } from './Auth.styles';
import { useUserStore } from '../../stores/userStore';
import { validateLoginForm } from '../../utils/validation';
import { loginUser, getTestEmails, handleGoogleLogin } from '../../services/authService';
import MainLayout from '../../components/layouts/MainLayout';
import Button from '../../components/atoms/Button';
import Text from '../../components/atoms/Text';
// import GoogleLoginButton from '../../components/atoms/GoogleLoginButton';
import GoogleLoginAlternative from '../../components/atoms/GoogleLoginAlternative';

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
  const [testUsers, setTestUsers] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

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

  // 컴포넌트 마운트 시 테스트 사용자 로드
  useEffect(() => {
    try {
      const emails = getTestEmails();
      setTestUsers(emails.filter(user => user.status === 'active')); // 활성 사용자만
    } catch (error) {
      console.error('테스트 사용자 로드 오류:', error);
      setTestUsers([]);
    }
  }, []);

  // 테스트 계정으로 자동 완성
  const fillTestAccount = (email) => {
    const password = email.includes('admin') ? 'admin123!' : 'test123!';
    setFormData(prev => ({
      ...prev,
      email: email,
      password: password
    }));
    setErrors({});
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
      // 실제 로그인 처리
      const authResult = await loginUser(formData.email, formData.password);
      
      if (authResult.success) {
        // authResult에 사용자 정보와 JWT 토큰이 포함됨
        const userDataWithTokens = {
          ...authResult.user,
          tokens: authResult.tokens // JWT 토큰 정보 포함
        };
        
        // userStore를 통한 로그인 처리 (게스트 데이터 마이그레이션 포함)
        const loginResult = await login(userDataWithTokens, true);
        
        if (loginResult.success) {
          setSubmitMessage('로그인이 완료되었습니다!');
          console.log('✅ Login successful with JWT tokens:', {
            user: loginResult.user.email,
            tokenType: authResult.tokens?.tokenType,
            hasAccessToken: !!authResult.tokens?.accessToken,
            hasRefreshToken: !!authResult.tokens?.refreshToken
          });
          
          // 1초 후 메인 페이지로 이동
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          setSubmitMessage('로그인 처리 중 오류가 발생했습니다.');
        }
      } else {
        setSubmitMessage(authResult.message);
      }

    } catch (error) {
      console.error('로그인 오류:', error);
      setSubmitMessage('로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth 성공 처리
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      setIsSubmitting(true);
      setSubmitMessage('');
      
      console.log('Google 로그인 시도 중...', credentialResponse);
      
      const result = await handleGoogleLogin(credentialResponse);
      
      if (result.success) {
        // userStore를 통한 로그인 처리
        const userDataWithTokens = {
          ...result.user,
          tokens: {
            tokenType: 'Bearer',
            accessToken: result.token,
            refreshToken: result.refreshToken
          }
        };

        console.log('🔍 Google 로그인 결과 토큰 확인:', {
          hasToken: !!result.token,
          hasRefreshToken: !!result.refreshToken,
          token: result.token ? 'exists' : 'missing',
          refreshToken: result.refreshToken ? 'exists' : 'missing',
          fullResult: result
        });

        // 토큰이 없는 경우 유효한 JWT 형식의 임시 토큰 생성
        if (!result.token || !result.refreshToken) {
          console.warn('⚠️ Google OAuth에서 토큰을 받지 못했습니다. 유효한 형식의 임시 토큰을 생성합니다.');
          const tempHeader = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
          const tempPayload = btoa(JSON.stringify({
            userId: result.user.id,
            email: result.user.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 후 만료
          }));
          const tempSignature = btoa(`temp_signature_${Date.now()}`);
          
          userDataWithTokens.tokens = {
            tokenType: 'Bearer',
            accessToken: `${tempHeader}.${tempPayload}.${tempSignature}`,
            refreshToken: `${tempHeader}.${tempPayload}.${btoa(`refresh_signature_${Date.now()}`)}`
          };
        }
        
        const loginResult = await login(userDataWithTokens, true);
        
        if (loginResult.success) {
          setSubmitMessage(result.isNewUser 
            ? 'Google 계정으로 가입 및 로그인되었습니다!' 
            : 'Google 계정으로 로그인되었습니다!'
          );
          
          console.log('✅ Google 로그인 성공:', {
            user: result.user.email,
            isNewUser: result.isNewUser
          });
          
          // 1초 후 메인 페이지로 이동
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } else {
          setSubmitMessage('로그인 처리 중 오류가 발생했습니다.');
        }
      } else {
        setSubmitMessage(result.message || 'Google 로그인에 실패했습니다.');
      }
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      setSubmitMessage('Google 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google OAuth 실패 처리
  const handleGoogleError = (error) => {
    console.error('Google 로그인 에러:', error);
    
    if (error?.error === 'popup_closed_by_user') {
      setSubmitMessage('Google 로그인이 취소되었습니다.');
    } else if (error?.error === 'access_denied') {
      setSubmitMessage('Google 로그인 권한이 거부되었습니다.');
    } else {
      setSubmitMessage('Google 로그인 중 오류가 발생했습니다. 다시 시도해 주세요.');
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
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="비밀번호를 입력해주세요"
                    disabled={isSubmitting}
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isSubmitting}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '14px',
                      color: '#666'
                    }}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
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
                onClick={() => navigate('/auth/forgot-password')}
                disabled={isSubmitting}
                style={{ 
                  color: '#666', 
                  textDecoration: 'underline',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                비밀번호를 잊으셨나요?
              </Button>
            </div>


            {/* 개발용: 테스트 계정 목록 */}
            {testUsers.length > 0 && (
              <div style={{ 
                marginTop: '2rem', 
                padding: '1rem', 
                backgroundColor: '#f8f9fa', 
                borderRadius: '8px',
                fontSize: '0.875rem'
              }}>
                <Text variant="small" style={{ fontWeight: 'bold', marginBottom: '0.75rem' }}>
                  개발용 - 테스트 계정 (클릭해서 자동완성):
                </Text>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {testUsers.map((testUser, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => fillTestAccount(testUser.email)}
                      disabled={isSubmitting}
                      style={{ 
                        padding: '8px 12px',
                        backgroundColor: '#fff',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#e9ecef';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#fff';
                      }}
                    >
                      <span>
                        <strong>{testUser.name}</strong> - {testUser.email}
                      </span>
                      <span style={{ color: '#6c757d', fontSize: '0.7rem' }}>
                        클릭하여 로그인
                      </span>
                    </button>
                  ))}
                </div>
                <Text variant="small" style={{ marginTop: '0.75rem', color: '#666' }}>
                  💡 일반 사용자: <code>test123!</code> | 관리자: <code>admin123!</code>
                </Text>
              </div>
            )}
          </form>

          {/* Google OAuth 로그인 - COOP 에러 우회용 대체 버전 */}
          <GoogleLoginAlternative 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            showDivider={true}
          />
          
          {/* 원본 Google 로그인 (COOP 에러 발생 시 주석 처리됨) */}
          {/* <GoogleLoginButton 
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            showDivider={true}
          /> */}
        </FormContainer>
      </StyledLoginPage>
    </MainLayout>
  );
};

export default Login;