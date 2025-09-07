import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layouts';
import { Text } from '../../components/atoms';
import { useUserStore } from '../../stores/userStore';
import { updateUserProfile, changePassword, handleGoogleLogin, disconnectGoogleAccount } from '../../services/authService';
import GoogleLoginButton from '../../components/atoms/GoogleLoginButton';
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

const EditProfile = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, updateUserInfo } = useUserStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password' | 'social'
  const [errors, setErrors] = useState({});
  
  // 로그인 여부 확인
  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/auth/login');
      return;
    }
    
    // 사용자 정보로 폼 초기화
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      birthDate: user.birthDate || ''
    });
  }, [isLoggedIn, user, navigate]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (activeTab === 'profile') {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setPasswordData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }
    
    if (formData.phone && !/^[0-9-+\s()]+$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다.';
    }
    
    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = '비밀번호는 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(passwordData.newPassword)) {
      newErrors.newPassword = '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요.';
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const validationErrors = validateProfileForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const result = await updateUserProfile(user.id, formData);
      
      if (result.success) {
        setSubmitMessage('회원 정보가 성공적으로 수정되었습니다.');
        setMessageType('success');
        
        // userStore의 사용자 정보 업데이트
        updateUserInfo({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          birthDate: formData.birthDate
        });
        
        setTimeout(() => {
          navigate('/my-page');
        }, 2000);
      } else {
        setSubmitMessage(result.message || '회원 정보 수정에 실패했습니다.');
        setMessageType('error');
      }
      
    } catch (error) {
      console.error('회원 정보 수정 오류:', error);
      setSubmitMessage('회원 정보 수정 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage('');
    
    try {
      const result = await changePassword(user.email, passwordData.currentPassword, passwordData.newPassword);
      
      if (result.success) {
        setSubmitMessage('비밀번호가 성공적으로 변경되었습니다.');
        setMessageType('success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setSubmitMessage(result.message || '비밀번호 변경에 실패했습니다.');
        setMessageType('error');
      }
      
    } catch (error) {
      console.error('비밀번호 변경 오류:', error);
      setSubmitMessage('비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google 계정 연결
  const handleGoogleConnect = async (credentialResponse) => {
    try {
      setIsSubmitting(true);
      setSubmitMessage('');
      setMessageType('');
      
      console.log('Google 계정 연결 중...', credentialResponse);
      
      const result = await handleGoogleLogin(credentialResponse);
      
      if (result.success) {
        // 기존 계정에 Google 정보 추가
        updateUserInfo({
          socialLogins: {
            ...user.socialLogins,
            google: result.user.socialLogins?.google
          },
          profileImage: result.user.profileImage || user.profileImage
        });
        
        setSubmitMessage('Google 계정이 성공적으로 연결되었습니다.');
        setMessageType('success');
      } else {
        setSubmitMessage(result.message || 'Google 계정 연결에 실패했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Google 계정 연결 오류:', error);
      setSubmitMessage('Google 계정 연결 중 오류가 발생했습니다.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google 계정 연결 해제
  const handleGoogleDisconnect = async () => {
    try {
      setIsSubmitting(true);
      setSubmitMessage('');
      setMessageType('');
      
      // 마지막 로그인 방법인지 확인
      if (user.loginProvider === 'google' && !user.password) {
        setSubmitMessage('Google 계정이 유일한 로그인 방식입니다. 먼저 비밀번호를 설정해주세요.');
        setMessageType('error');
        setActiveTab('password');
        return;
      }
      
      const result = await disconnectGoogleAccount(user.id);
      
      if (result.success) {
        // 사용자 정보에서 Google 연결 정보 제거
        const updatedSocialLogins = { ...user.socialLogins };
        delete updatedSocialLogins.google;
        
        updateUserInfo({
          socialLogins: Object.keys(updatedSocialLogins).length > 0 ? updatedSocialLogins : undefined
        });
        
        setSubmitMessage('Google 계정 연결이 해제되었습니다.');
        setMessageType('success');
      } else {
        setSubmitMessage(result.message || 'Google 계정 연결 해제에 실패했습니다.');
        setMessageType('error');
      }
    } catch (error) {
      console.error('Google 계정 연결 해제 오류:', error);
      setSubmitMessage('Google 계정 연결 해제 중 오류가 발생했습니다.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn || !user) {
    return null; // 로그인 리다이렉트 처리 중
  }

  return (
    <MainLayout>
      <StyledLoginPage>
        <FormContainer>
          <Text variant="h1" style={{ marginBottom: '1rem', textAlign: 'center' }}>
            회원 정보 수정
          </Text>
          
          {/* 탭 버튼 */}
          <div style={{ 
            display: 'flex', 
            marginBottom: '2rem', 
            borderBottom: '1px solid #ddd' 
          }}>
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: activeTab === 'profile' ? '#f8f9fa' : 'transparent',
                borderBottom: activeTab === 'profile' ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === 'profile' ? 'bold' : 'normal'
              }}
            >
              기본 정보
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('password')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: activeTab === 'password' ? '#f8f9fa' : 'transparent',
                borderBottom: activeTab === 'password' ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === 'password' ? 'bold' : 'normal'
              }}
            >
              비밀번호 변경
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: activeTab === 'social' ? '#f8f9fa' : 'transparent',
                borderBottom: activeTab === 'social' ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: activeTab === 'social' ? 'bold' : 'normal'
              }}
            >
              소셜 계정 연결
            </button>
          </div>
          
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit}>
              <FormSection>
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="name">이름 *</FormLabel>
                    <FormInput
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="이름을 입력해주세요"
                      disabled={isSubmitting}
                    />
                    {errors.name && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.name}</Text>}
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="email">이메일 *</FormLabel>
                    <FormInput
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="이메일을 입력해주세요"
                      disabled={isSubmitting}
                    />
                    {errors.email && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.email}</Text>}
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="phone">전화번호</FormLabel>
                    <FormInput
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="전화번호를 입력해주세요"
                      disabled={isSubmitting}
                    />
                    {errors.phone && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.phone}</Text>}
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="birthDate">생년월일</FormLabel>
                    <FormInput
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={formData.birthDate}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
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
                {isSubmitting ? '수정 중...' : '정보 수정'}
              </FormButton>
            </form>
          )}

          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit}>
              <FormSection>
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="currentPassword">현재 비밀번호 *</FormLabel>
                    <FormInput
                      type="password"
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handleInputChange}
                      placeholder="현재 비밀번호를 입력해주세요"
                      disabled={isSubmitting}
                    />
                    {errors.currentPassword && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.currentPassword}</Text>}
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="newPassword">새 비밀번호 *</FormLabel>
                    <FormInput
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handleInputChange}
                      placeholder="8자 이상, 영문+숫자 포함"
                      disabled={isSubmitting}
                    />
                    {errors.newPassword && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.newPassword}</Text>}
                  </FormGroup>
                </FormRow>
                
                <FormRow>
                  <FormGroup>
                    <FormLabel htmlFor="confirmPassword">새 비밀번호 확인 *</FormLabel>
                    <FormInput
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handleInputChange}
                      placeholder="새 비밀번호를 다시 입력해주세요"
                      disabled={isSubmitting}
                    />
                    {errors.confirmPassword && <Text variant="small" style={{color: '#dc3545', marginTop: '0.25rem'}}>{errors.confirmPassword}</Text>}
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
                {isSubmitting ? '변경 중...' : '비밀번호 변경'}
              </FormButton>
            </form>
          )}

          {activeTab === 'social' && (
            <div>
              <FormSection>
                <div style={{ marginBottom: '1.5rem' }}>
                  <Text variant="h3" style={{ marginBottom: '1rem', color: '#333' }}>
                    연결된 소셜 계정
                  </Text>
                  <Text variant="small" style={{ color: '#666', lineHeight: '1.5' }}>
                    소셜 계정을 연결하면 해당 계정으로도 로그인할 수 있습니다.
                  </Text>
                </div>

                {/* Google 계정 연결 상태 */}
                <div style={{
                  padding: '1rem',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  backgroundColor: '#f8f9fa'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#4285f4',
                        marginRight: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        G
                      </div>
                      <div>
                        <Text variant="body" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          Google 계정
                        </Text>
                        <Text variant="small" style={{ color: '#666' }}>
                          {user?.socialLogins?.google ? 
                            `연결됨: ${user.socialLogins.google.email}` : 
                            '연결되지 않음'
                          }
                        </Text>
                      </div>
                    </div>
                    
                    {user?.socialLogins?.google ? (
                      <button
                        type="button"
                        onClick={handleGoogleDisconnect}
                        disabled={isSubmitting}
                        style={{
                          padding: '0.5rem 1rem',
                          border: '1px solid #dc3545',
                          backgroundColor: 'transparent',
                          color: '#dc3545',
                          borderRadius: '4px',
                          cursor: isSubmitting ? 'not-allowed' : 'pointer',
                          fontSize: '0.875rem',
                          opacity: isSubmitting ? 0.7 : 1
                        }}
                      >
                        {isSubmitting ? '처리 중...' : '연결 해제'}
                      </button>
                    ) : (
                      <div style={{ minWidth: '100px' }}>
                        <GoogleLoginButton 
                          onSuccess={handleGoogleConnect}
                          onError={(error) => {
                            console.error('Google 연결 오류:', error);
                            setSubmitMessage('Google 계정 연결에 실패했습니다.');
                            setMessageType('error');
                          }}
                          showDivider={false}
                        />
                      </div>
                    )}
                  </div>
                  
                  {user?.socialLogins?.google && (
                    <Text variant="small" style={{ color: '#666' }}>
                      연결일: {new Date(user.socialLogins.google.connectedAt).toLocaleDateString()}
                    </Text>
                  )}
                </div>

                {/* Kakao 계정 (향후 구현 예정) */}
                <div style={{
                  padding: '1rem',
                  border: '1px solid #e1e5e9',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  backgroundColor: '#f8f8f8',
                  opacity: 0.6
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <div style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: '#fee500',
                        marginRight: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#000',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        K
                      </div>
                      <div>
                        <Text variant="body" style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                          Kakao 계정
                        </Text>
                        <Text variant="small" style={{ color: '#666' }}>
                          향후 지원 예정
                        </Text>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      disabled
                      style={{
                        padding: '0.5rem 1rem',
                        border: '1px solid #ccc',
                        backgroundColor: '#f8f9fa',
                        color: '#666',
                        borderRadius: '4px',
                        cursor: 'not-allowed',
                        fontSize: '0.875rem'
                      }}
                    >
                      준비 중
                    </button>
                  </div>
                </div>

                {/* 안전 설정 안내 */}
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#e7f3ff',
                  border: '1px solid #b3d9ff',
                  borderRadius: '8px',
                  marginTop: '1.5rem'
                }}>
                  <Text variant="small" style={{ color: '#0066cc', lineHeight: '1.5' }}>
                    💡 <strong>보안 팁:</strong><br/>
                    • 소셜 계정 연결 시 해당 계정으로도 로그인할 수 있습니다.<br/>
                    • 메인 로그인 방식을 해제하려면 먼저 다른 로그인 방법을 설정하세요.<br/>
                    • 비밀번호가 없는 소셜 전용 계정의 경우 연결 해제 전 비밀번호를 설정하세요.
                  </Text>
                </div>
              </FormSection>
            </div>
          )}
          
          <LinkContainer>
            <FormLink onClick={() => navigate('/my-page')} style={{cursor: 'pointer'}}>
              마이페이지로 돌아가기
            </FormLink>
            <span> | </span>
            <FormLink 
              onClick={() => navigate('/auth/delete-account')} 
              style={{cursor: 'pointer', color: '#dc3545'}}
            >
              회원 탈퇴
            </FormLink>
          </LinkContainer>
        </FormContainer>
      </StyledLoginPage>
    </MainLayout>
  );
};

export default EditProfile;