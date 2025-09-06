import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layouts';
import { Text } from '../../components/atoms';
import { useUserStore } from '../../stores/userStore';
import { updateUserProfile, changePassword } from '../../services/authService';
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
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'password'
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
          </div>
          
          {activeTab === 'profile' ? (
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
          ) : (
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