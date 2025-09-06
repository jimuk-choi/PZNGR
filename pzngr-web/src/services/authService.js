// ========================================
// 인증 관련 서비스 함수들
// ========================================

import { getUserByEmail, mockUsers } from '../data/mockUsers';
import { hashPasswordWithValidation, verifyPasswordSmart } from '../utils/passwordUtils';

// 이메일 중복 체크
export const checkEmailDuplicate = async (email) => {
  try {
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const existingUser = getUserByEmail(email.toLowerCase().trim());
    
    return {
      success: true,
      isAvailable: !existingUser, // 사용자가 없으면 사용 가능
      message: existingUser 
        ? '이미 사용 중인 이메일입니다.' 
        : '사용 가능한 이메일입니다.'
    };
  } catch (error) {
    console.error('이메일 중복 체크 오류:', error);
    return {
      success: false,
      isAvailable: false,
      message: '이메일 중복 체크 중 오류가 발생했습니다.'
    };
  }
};

// 이메일 형식과 중복을 함께 체크
export const validateAndCheckEmail = async (email) => {
  // 이메일 형식 검증
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!email) {
    return {
      success: true,
      isValid: false,
      isAvailable: false,
      message: '이메일을 입력해주세요.'
    };
  }
  
  if (!emailRegex.test(email)) {
    return {
      success: true,
      isValid: false,
      isAvailable: false,
      message: '올바른 이메일 형식이 아닙니다.'
    };
  }
  
  // 형식이 올바르면 중복 체크
  const duplicateResult = await checkEmailDuplicate(email);
  
  return {
    success: duplicateResult.success,
    isValid: true,
    isAvailable: duplicateResult.isAvailable,
    message: duplicateResult.message
  };
};

// 회원가입 처리
export const registerUser = async (userData) => {
  try {
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 이메일 중복 최종 체크
    const emailCheck = await checkEmailDuplicate(userData.email);
    if (!emailCheck.isAvailable) {
      return {
        success: false,
        message: '이미 사용 중인 이메일입니다.'
      };
    }
    
    // 비밀번호 해시화
    console.log('🔐 비밀번호 해시화 시작...');
    const passwordResult = await hashPasswordWithValidation(userData.password);
    
    if (!passwordResult.success) {
      return {
        success: false,
        message: passwordResult.error
      };
    }
    
    // 새 사용자 ID 생성
    const newUserId = `user_${Date.now()}`;
    
    // 새 사용자 데이터 생성 (실제로는 서버에서 처리)
    const newUser = {
      id: newUserId,
      email: userData.email.toLowerCase().trim(),
      password: passwordResult.hashedPassword, // bcrypt로 암호화된 비밀번호
      name: userData.name,
      phone: userData.phone,
      birthDate: userData.birthDate || null,
      role: 'user',
      status: 'active',
      membershipTier: 'bronze',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLoginAt: null,
      totalSpent: 0,
      orderCount: 0,
      emailNotifications: true,
      smsNotifications: true,
      marketingConsent: userData.marketingAccepted || false,
      defaultAddress: null,
      profileImage: null
    };
    
    // mockUsers에 추가 (실제로는 서버 DB에 저장)
    mockUsers.push(newUser);
    
    console.log('✅ 새 사용자 등록 완료:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      passwordHashed: '✓'
    });
    
    return {
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        phone: newUser.phone
      },
      message: '회원가입이 완료되었습니다.'
    };
    
  } catch (error) {
    console.error('❌ 회원가입 처리 오류:', error);
    return {
      success: false,
      message: '회원가입 중 오류가 발생했습니다. 다시 시도해 주세요.'
    };
  }
};

// 로그인 처리
export const loginUser = async (email, password) => {
  try {
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = getUserByEmail(email.toLowerCase().trim());
    
    if (!user) {
      return {
        success: false,
        message: '등록되지 않은 이메일입니다.'
      };
    }
    
    if (user.status !== 'active') {
      return {
        success: false,
        message: '정지된 계정입니다. 고객센터에 문의해 주세요.'
      };
    }
    
    // bcrypt를 사용한 비밀번호 검증 (기존 평문 비밀번호도 처리)
    console.log('🔐 비밀번호 검증 중...');
    const passwordVerification = await verifyPasswordSmart(password, user.password);
    
    if (!passwordVerification.isValid) {
      return {
        success: false,
        message: '비밀번호가 올바르지 않습니다.'
      };
    }
    
    // 비밀번호가 평문이었다면 해시로 업그레이드
    if (passwordVerification.needsUpgrade) {
      console.log('🔄 비밀번호를 해시로 업그레이드 중...');
      user.password = passwordVerification.newHash;
      user.updatedAt = new Date().toISOString();
    }
    
    // 로그인 시간 업데이트
    user.lastLoginAt = new Date().toISOString();
    
    console.log('✅ 로그인 성공:', {
      email: user.email,
      name: user.name,
      passwordUpgraded: passwordVerification.needsUpgrade ? '✓' : 'N/A'
    });
    
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        isAdmin: user.role === 'admin'
      },
      message: '로그인이 완료되었습니다.'
    };
    
  } catch (error) {
    console.error('❌ 로그인 처리 오류:', error);
    return {
      success: false,
      message: '로그인 중 오류가 발생했습니다. 다시 시도해 주세요.'
    };
  }
};

// 기존 테스트 이메일 목록 (개발용)
export const getTestEmails = () => {
  return mockUsers.map(user => ({
    email: user.email,
    name: user.name,
    status: user.status
  }));
};

// 이메일 중복 체크 디바운스 함수
export const createEmailCheckDebounce = (delay = 800) => {
  let timeoutId = null;
  
  return (email, callback) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(async () => {
      if (email && email.trim()) {
        const result = await validateAndCheckEmail(email);
        callback(result);
      }
    }, delay);
  };
};