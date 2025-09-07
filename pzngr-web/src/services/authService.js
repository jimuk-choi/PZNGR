// ========================================
// 인증 관련 서비스 함수들
// ========================================

import { getUserByEmail, getUserById, mockUsers } from '../data/mockUsers';
import { hashPasswordWithValidation, verifyPasswordSmart, hashPassword } from '../utils/passwordUtils';
import { generateTokenPair, generateToken } from '../utils/jwtUtils';

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
    
    // JWT 토큰 쌍 생성
    console.log('🎫 JWT 토큰 생성 중...');
    const tokenResult = await generateTokenPair({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      sub: user.id, // JWT 표준 subject
      sessionId: `session_${Date.now()}_${user.id}`
    });
    
    if (!tokenResult.success) {
      console.error('❌ JWT 토큰 생성 실패:', tokenResult.error);
      return {
        success: false,
        message: '인증 토큰 생성에 실패했습니다. 다시 시도해 주세요.'
      };
    }
    
    console.log('✅ 로그인 성공:', {
      email: user.email,
      name: user.name,
      passwordUpgraded: passwordVerification.needsUpgrade ? '✓' : 'N/A',
      tokensGenerated: '✓'
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
      tokens: tokenResult.tokens,
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

// ========================================
// 비밀번호 찾기 및 재설정 관련 함수들
// ========================================

// 비밀번호 재설정 토큰 저장소 (실제로는 데이터베이스나 Redis 사용)
const passwordResetTokens = new Map();

// 비밀번호 찾기 요청 처리
export const requestPasswordReset = async (email) => {
  try {
    console.log('🔐 비밀번호 찾기 요청:', email);
    
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 이메일로 사용자 조회
    const user = getUserByEmail(email.toLowerCase().trim());
    
    if (!user) {
      // 보안상 실제 존재 여부를 알려주지 않음
      return {
        success: true,
        message: '해당 이메일로 비밀번호 재설정 링크를 발송했습니다.'
      };
    }
    
    if (user.status !== 'active') {
      return {
        success: false,
        message: '정지된 계정입니다. 고객센터에 문의해 주세요.'
      };
    }
    
    // 재설정 토큰 생성 (15분 유효)
    const resetToken = await generateToken({
      userId: user.id,
      email: user.email,
      type: 'password_reset',
      purpose: 'reset_password'
    }, {
      type: 'password_reset',
      expiresIn: '15m' // 15분
    });
    
    if (!resetToken.success) {
      console.error('❌ 재설정 토큰 생성 실패:', resetToken.error);
      return {
        success: false,
        message: '토큰 생성 중 오류가 발생했습니다. 다시 시도해 주세요.'
      };
    }
    
    // 토큰을 메모리에 저장 (실제로는 데이터베이스)
    const tokenData = {
      token: resetToken.token,
      userId: user.id,
      email: user.email,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15분 후
      used: false
    };
    
    passwordResetTokens.set(resetToken.token, tokenData);
    
    // 이메일 발송 (실제로는 이메일 서비스 호출)
    const resetLink = `${window.location.origin}/auth/reset-password?token=${resetToken.token}&email=${encodeURIComponent(user.email)}`;
    
    console.log('📧 비밀번호 재설정 이메일 발송 시뮬레이션:');
    console.log('수신자:', user.email);
    console.log('재설정 링크:', resetLink);
    console.log('토큰 만료시간:', tokenData.expiresAt);
    
    return {
      success: true,
      message: '해당 이메일로 비밀번호 재설정 링크를 발송했습니다.',
      // 개발용으로만 토큰 반환 (실제로는 반환하지 않음)
      _dev: {
        resetLink,
        token: resetToken.token,
        expiresAt: tokenData.expiresAt
      }
    };
    
  } catch (error) {
    console.error('❌ 비밀번호 찾기 처리 오류:', error);
    return {
      success: false,
      message: '비밀번호 찾기 요청 중 오류가 발생했습니다. 다시 시도해 주세요.'
    };
  }
};

// 비밀번호 재설정 토큰 검증
export const verifyPasswordResetToken = async (token, email) => {
  try {
    console.log('🔐 비밀번호 재설정 토큰 검증:', { token: token.substring(0, 20) + '...', email });
    
    // 토큰 저장소에서 조회
    const tokenData = passwordResetTokens.get(token);
    
    if (!tokenData) {
      return {
        success: false,
        error: 'Invalid token',
        message: '유효하지 않은 토큰입니다.'
      };
    }
    
    // 이메일 일치 확인
    if (tokenData.email !== email.toLowerCase().trim()) {
      return {
        success: false,
        error: 'Email mismatch',
        message: '토큰과 이메일이 일치하지 않습니다.'
      };
    }
    
    // 만료 시간 확인
    if (new Date() > new Date(tokenData.expiresAt)) {
      // 만료된 토큰 제거
      passwordResetTokens.delete(token);
      return {
        success: false,
        error: 'Token expired',
        message: '토큰이 만료되었습니다. 비밀번호 찾기를 다시 시도해주세요.'
      };
    }
    
    // 이미 사용된 토큰인지 확인
    if (tokenData.used) {
      return {
        success: false,
        error: 'Token already used',
        message: '이미 사용된 토큰입니다.'
      };
    }
    
    console.log('✅ 비밀번호 재설정 토큰 검증 성공');
    
    return {
      success: true,
      tokenData: {
        userId: tokenData.userId,
        email: tokenData.email,
        expiresAt: tokenData.expiresAt
      }
    };
    
  } catch (error) {
    console.error('❌ 토큰 검증 오류:', error);
    return {
      success: false,
      error: 'Verification failed',
      message: '토큰 검증 중 오류가 발생했습니다.'
    };
  }
};

// 비밀번호 재설정 실행
export const resetPassword = async (token, email, newPassword) => {
  try {
    console.log('🔐 비밀번호 재설정 실행:', { email, token: token.substring(0, 20) + '...' });
    
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 토큰 검증
    const tokenVerification = await verifyPasswordResetToken(token, email);
    
    if (!tokenVerification.success) {
      return tokenVerification;
    }
    
    // 사용자 조회
    const user = getUserByEmail(email.toLowerCase().trim());
    
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    // 새 비밀번호 해시화
    console.log('🔐 새 비밀번호 해시화 중...');
    const passwordResult = await hashPasswordWithValidation(newPassword);
    
    if (!passwordResult.success) {
      return {
        success: false,
        message: passwordResult.error
      };
    }
    
    // 비밀번호 업데이트
    user.password = passwordResult.hashedPassword;
    user.updatedAt = new Date().toISOString();
    
    // 토큰을 사용됨으로 표시
    const tokenData = passwordResetTokens.get(token);
    if (tokenData) {
      tokenData.used = true;
      tokenData.usedAt = new Date().toISOString();
    }
    
    console.log('✅ 비밀번호 재설정 완료:', {
      email: user.email,
      userId: user.id,
      updatedAt: user.updatedAt
    });
    
    return {
      success: true,
      message: '비밀번호가 성공적으로 재설정되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
    
  } catch (error) {
    console.error('❌ 비밀번호 재설정 오류:', error);
    return {
      success: false,
      message: '비밀번호 재설정 중 오류가 발생했습니다. 다시 시도해 주세요.'
    };
  }
};

// 개발용: 저장된 토큰들 조회
export const getPasswordResetTokens = () => {
  const tokens = [];
  for (const [token, data] of passwordResetTokens.entries()) {
    tokens.push({
      token: token.substring(0, 20) + '...',
      email: data.email,
      createdAt: data.createdAt,
      expiresAt: data.expiresAt,
      used: data.used,
      usedAt: data.usedAt
    });
  }
  return tokens;
};

// 만료된 토큰 정리 (주기적으로 실행)
export const cleanupExpiredTokens = () => {
  const now = new Date();
  let cleanedCount = 0;
  
  for (const [token, data] of passwordResetTokens.entries()) {
    if (now > new Date(data.expiresAt)) {
      passwordResetTokens.delete(token);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`🧹 만료된 비밀번호 재설정 토큰 ${cleanedCount}개 정리됨`);
  }
  
  return cleanedCount;
};

// ========================
// 회원 정보 수정 관련 함수들
// ========================

// 회원 정보 업데이트
export const updateUserProfile = async (userId, profileData) => {
  try {
    console.log('👤 회원 정보 업데이트 중...', { userId, profileData: { ...profileData, password: undefined } });
    
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = getUserById(userId);
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    // 이메일 변경 시 중복 체크
    if (profileData.email && profileData.email !== user.email) {
      const emailExists = getUserByEmail(profileData.email);
      if (emailExists && emailExists.id !== userId) {
        return {
          success: false,
          message: '이미 사용 중인 이메일 주소입니다.'
        };
      }
    }
    
    // 사용자 정보 업데이트
    const updatedUser = {
      ...user,
      name: profileData.name || user.name,
      email: profileData.email || user.email,
      phone: profileData.phone || user.phone,
      birthDate: profileData.birthDate || user.birthDate,
      updatedAt: new Date().toISOString()
    };
    
    // 메모리에서 사용자 정보 업데이트 (실제로는 mockUsers 배열에서 업데이트)
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex >= 0) {
      mockUsers[userIndex] = updatedUser;
    }
    
    console.log('✅ 회원 정보 업데이트 성공:', updatedUser.email);
    
    return {
      success: true,
      message: '회원 정보가 성공적으로 업데이트되었습니다.',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        phone: updatedUser.phone,
        birthDate: updatedUser.birthDate,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt
      }
    };
    
  } catch (error) {
    console.error('❌ 회원 정보 업데이트 오류:', error);
    return {
      success: false,
      message: '회원 정보 업데이트 중 오류가 발생했습니다. 다시 시도해 주세요.'
    };
  }
};

// 비밀번호 변경
export const changePassword = async (email, currentPassword, newPassword) => {
  try {
    console.log('🔐 비밀번호 변경 중...', { email });
    
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    // 현재 비밀번호 확인
    const passwordVerification = await verifyPasswordSmart(currentPassword, user.password);
    if (!passwordVerification.isValid) {
      return {
        success: false,
        message: '현재 비밀번호가 올바르지 않습니다.'
      };
    }
    
    // 새 비밀번호 암호화
    const hashedNewPassword = await hashPassword(newPassword);
    
    // 사용자 비밀번호 업데이트
    user.password = hashedNewPassword;
    user.updatedAt = new Date().toISOString();
    
    console.log('✅ 비밀번호 변경 성공:', user.email);
    
    return {
      success: true,
      message: '비밀번호가 성공적으로 변경되었습니다.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
    
  } catch (error) {
    console.error('❌ 비밀번호 변경 오류:', error);
    return {
      success: false,
      message: '비밀번호 변경 중 오류가 발생했습니다. 다시 시도해 주세요.'
    };
  }
};

// ========================
// 회원 탈퇴 관련 함수들
// ========================

// 회원 탈퇴 처리
export const deleteUserAccount = async (email, password, reason) => {
  try {
    console.log('🗑️ 회원 탈퇴 처리 중...', { email, reason });
    
    // 실제 API 호출을 모방하기 위해 약간의 지연 추가
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const user = getUserByEmail(email.toLowerCase().trim());
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    // 현재 비밀번호 확인
    const passwordVerification = await verifyPasswordSmart(password, user.password);
    if (!passwordVerification.isValid) {
      return {
        success: false,
        message: '현재 비밀번호가 올바르지 않습니다.'
      };
    }
    
    // 사용자 계정 비활성화 (완전 삭제 대신 상태 변경)
    user.status = 'deleted';
    user.deletedAt = new Date().toISOString();
    user.deletionReason = reason;
    user.updatedAt = new Date().toISOString();
    
    // 개인정보 익명화 처리 (GDPR 준수)
    const anonymizedUser = {
      ...user,
      name: '탈퇴한 사용자',
      phone: null,
      birthDate: null,
      // 이메일은 중복 가입 방지를 위해 해시로 변경
      email: `deleted_${user.id}@deleted.local`,
      password: null, // 비밀번호 완전 삭제
    };
    
    // mockUsers에서 사용자 정보 업데이트
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      mockUsers[userIndex] = anonymizedUser;
    }
    
    console.log('✅ 회원 탈퇴 완료:', user.email, '→', anonymizedUser.email);
    
    // 탈퇴 로그 기록 (실제 환경에서는 별도 로그 시스템)
    console.log('📊 탈퇴 통계:', {
      userId: user.id,
      originalEmail: email,
      reason: reason,
      deletedAt: anonymizedUser.deletedAt,
      accountAge: calculateAccountAge(user.createdAt)
    });
    
    return {
      success: true,
      message: '회원 탈퇴가 완료되었습니다.',
      deletedUser: {
        id: user.id,
        deletedAt: anonymizedUser.deletedAt,
        reason: reason
      }
    };
    
  } catch (error) {
    console.error('❌ 회원 탈퇴 처리 오류:', error);
    return {
      success: false,
      message: '회원 탈퇴 처리 중 오류가 발생했습니다. 고객센터에 문의해 주세요.'
    };
  }
};

// 계정 사용 기간 계산 헬퍼 함수
const calculateAccountAge = (createdAt) => {
  const created = new Date(createdAt);
  const now = new Date();
  const diffTime = Math.abs(now - created);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) {
    return `${diffDays}일`;
  } else if (diffDays < 365) {
    return `${Math.floor(diffDays / 30)}개월`;
  } else {
    return `${Math.floor(diffDays / 365)}년`;
  }
};

// 탈퇴한 사용자 복구 (관리자 전용, 30일 이내)
export const restoreDeletedUser = async (userId, adminId) => {
  try {
    console.log('🔄 탈퇴 사용자 복구 시도:', { userId, adminId });
    
    const user = getUserById(userId);
    if (!user || user.status !== 'deleted') {
      return {
        success: false,
        message: '복구할 수 있는 사용자를 찾을 수 없습니다.'
      };
    }
    
    // 30일 이내 복구 가능 여부 확인
    const deletedDate = new Date(user.deletedAt);
    const now = new Date();
    const daysSinceDeleted = Math.floor((now - deletedDate) / (1000 * 60 * 60 * 24));
    
    if (daysSinceDeleted > 30) {
      return {
        success: false,
        message: '탈퇴한 지 30일이 지나 복구할 수 없습니다.'
      };
    }
    
    // 사용자 계정 복구 (실제로는 별도 백업에서 복원)
    return {
      success: false,
      message: '계정 복구 기능은 관리자 시스템에서만 사용 가능합니다.'
    };
    
  } catch (error) {
    console.error('❌ 계정 복구 오류:', error);
    return {
      success: false,
      message: '계정 복구 중 오류가 발생했습니다.'
    };
  }
};

// ========================================
// Google OAuth 관련 함수들
// ========================================

// JWT 토큰 디코딩 (Google OAuth 토큰 검증용)
const decodeGoogleJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 토큰 디코딩 오류:', error);
    return null;
  }
};

// Google OAuth 로그인 처리
export const handleGoogleLogin = async (credentialResponse) => {
  try {
    console.log('🔐 Google OAuth 로그인 처리 중...');
    
    if (!credentialResponse || !credentialResponse.credential) {
      return {
        success: false,
        message: 'Google 인증 정보를 받지 못했습니다.'
      };
    }
    
    // Google JWT 토큰 디코딩
    const googleUserInfo = decodeGoogleJWT(credentialResponse.credential);
    
    if (!googleUserInfo) {
      return {
        success: false,
        message: 'Google 사용자 정보를 처리할 수 없습니다.'
      };
    }
    
    console.log('📋 Google 사용자 정보:', {
      email: googleUserInfo.email,
      name: googleUserInfo.name,
      picture: googleUserInfo.picture,
      email_verified: googleUserInfo.email_verified
    });
    
    // 기존 사용자 확인
    let existingUser = getUserByEmail(googleUserInfo.email);
    
    if (existingUser) {
      // 기존 사용자가 일반 계정인 경우 소셜 로그인 정보 추가
      if (!existingUser.socialLogins) {
        existingUser.socialLogins = {};
      }
      
      if (!existingUser.socialLogins.google) {
        existingUser.socialLogins.google = {
          id: googleUserInfo.sub,
          email: googleUserInfo.email,
          name: googleUserInfo.name,
          picture: googleUserInfo.picture,
          connectedAt: new Date().toISOString()
        };
        
        // mockUsers 업데이트
        const userIndex = mockUsers.findIndex(u => u.id === existingUser.id);
        if (userIndex >= 0) {
          mockUsers[userIndex] = existingUser;
        }
        
        console.log('✅ 기존 계정에 Google 로그인 연동 완료');
      }
      
      // JWT 토큰 생성
      const tokenResult = await generateTokenPair({
        userId: existingUser.id,
        email: existingUser.email,
        name: existingUser.name,
        role: existingUser.role
      });
      
      if (!tokenResult.success) {
        return {
          success: false,
          message: '토큰 생성 중 오류가 발생했습니다.'
        };
      }
      
      console.log('✅ Google OAuth 로그인 성공 (기존 사용자):', existingUser.email);
      
      return {
        success: true,
        message: 'Google 계정으로 로그인되었습니다.',
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          phone: existingUser.phone || null,
          birthDate: existingUser.birthDate || null,
          role: existingUser.role,
          profileImage: googleUserInfo.picture || existingUser.profileImage
        },
        token: tokenResult.accessToken,
        refreshToken: tokenResult.refreshToken
      };
    } else {
      // 새 사용자 생성 (Google OAuth)
      const newUserId = Date.now().toString();
      const newUser = {
        id: newUserId,
        email: googleUserInfo.email,
        name: googleUserInfo.name,
        phone: null,
        birthDate: null,
        password: null, // 소셜 로그인은 비밀번호 없음
        role: 'user',
        profileImage: googleUserInfo.picture,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isEmailVerified: googleUserInfo.email_verified || false,
        status: 'active',
        loginProvider: 'google', // 메인 로그인 방식
        socialLogins: {
          google: {
            id: googleUserInfo.sub,
            email: googleUserInfo.email,
            name: googleUserInfo.name,
            picture: googleUserInfo.picture,
            connectedAt: new Date().toISOString()
          }
        }
      };
      
      // mockUsers에 추가
      mockUsers.push(newUser);
      
      // JWT 토큰 생성
      const tokenResult = await generateTokenPair({
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      });
      
      if (!tokenResult.success) {
        // 사용자 생성 롤백
        const index = mockUsers.findIndex(u => u.id === newUserId);
        if (index >= 0) {
          mockUsers.splice(index, 1);
        }
        
        return {
          success: false,
          message: '토큰 생성 중 오류가 발생했습니다.'
        };
      }
      
      console.log('✅ Google OAuth 로그인 성공 (신규 사용자):', newUser.email);
      
      return {
        success: true,
        message: 'Google 계정으로 가입 및 로그인되었습니다.',
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          phone: newUser.phone,
          birthDate: newUser.birthDate,
          role: newUser.role,
          profileImage: newUser.profileImage
        },
        token: tokenResult.accessToken,
        refreshToken: tokenResult.refreshToken,
        isNewUser: true
      };
    }
    
  } catch (error) {
    console.error('❌ Google OAuth 로그인 오류:', error);
    return {
      success: false,
      message: 'Google 로그인 처리 중 오류가 발생했습니다. 다시 시도해 주세요.'
    };
  }
};

// Google OAuth 연결 해제
export const disconnectGoogleAccount = async (userId) => {
  try {
    console.log('🔗 Google 계정 연결 해제 중...', { userId });
    
    const user = getUserById(userId);
    if (!user) {
      return {
        success: false,
        message: '사용자를 찾을 수 없습니다.'
      };
    }
    
    if (!user.socialLogins || !user.socialLogins.google) {
      return {
        success: false,
        message: '연결된 Google 계정을 찾을 수 없습니다.'
      };
    }
    
    // Google 로그인이 메인 로그인 방식인 경우 연결 해제 불가
    if (user.loginProvider === 'google' && !user.password) {
      return {
        success: false,
        message: 'Google 계정이 유일한 로그인 방식입니다. 먼저 비밀번호를 설정해주세요.'
      };
    }
    
    // Google 계정 연결 해제
    delete user.socialLogins.google;
    
    // 소셜 로그인이 더 이상 없는 경우
    if (Object.keys(user.socialLogins).length === 0) {
      delete user.socialLogins;
    }
    
    // mockUsers 업데이트
    const userIndex = mockUsers.findIndex(u => u.id === user.id);
    if (userIndex >= 0) {
      mockUsers[userIndex] = user;
    }
    
    console.log('✅ Google 계정 연결 해제 완료:', user.email);
    
    return {
      success: true,
      message: 'Google 계정 연결이 해제되었습니다.'
    };
    
  } catch (error) {
    console.error('❌ Google 계정 연결 해제 오류:', error);
    return {
      success: false,
      message: 'Google 계정 연결 해제 중 오류가 발생했습니다.'
    };
  }
};