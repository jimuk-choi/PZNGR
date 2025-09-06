// ========================================
// 비밀번호 암호화 및 검증 유틸리티
// ========================================

import bcrypt from 'bcryptjs';

// bcrypt 솔트 라운드 (10-12가 권장, 10은 빠르고 충분히 안전)
const SALT_ROUNDS = 10;

/**
 * 비밀번호를 해시화합니다
 * @param {string} plainPassword - 평문 비밀번호
 * @returns {Promise<string>} 해시화된 비밀번호
 */
export const hashPassword = async (plainPassword) => {
  try {
    if (!plainPassword || typeof plainPassword !== 'string') {
      throw new Error('유효한 비밀번호를 입력해주세요.');
    }

    const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
    console.log('비밀번호 해시화 완료');
    return hashedPassword;
  } catch (error) {
    console.error('비밀번호 해시화 오류:', error);
    throw new Error('비밀번호 암호화 중 오류가 발생했습니다.');
  }
};

/**
 * 비밀번호를 검증합니다
 * @param {string} plainPassword - 평문 비밀번호
 * @param {string} hashedPassword - 해시화된 비밀번호
 * @returns {Promise<boolean>} 비밀번호 일치 여부
 */
export const verifyPassword = async (plainPassword, hashedPassword) => {
  try {
    if (!plainPassword || !hashedPassword) {
      return false;
    }

    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    console.log('비밀번호 검증 완료:', isMatch ? '일치' : '불일치');
    return isMatch;
  } catch (error) {
    console.error('비밀번호 검증 오류:', error);
    return false;
  }
};

/**
 * 비밀번호 강도를 검사하고 해시화합니다
 * @param {string} plainPassword - 평문 비밀번호
 * @returns {Promise<{success: boolean, hashedPassword?: string, error?: string}>}
 */
export const hashPasswordWithValidation = async (plainPassword) => {
  try {
    // 기본 검증
    if (!plainPassword || typeof plainPassword !== 'string') {
      return {
        success: false,
        error: '유효한 비밀번호를 입력해주세요.'
      };
    }

    // 최소 길이 검증
    if (plainPassword.length < 8) {
      return {
        success: false,
        error: '비밀번호는 최소 8자 이상이어야 합니다.'
      };
    }

    // 해시화 실행
    const hashedPassword = await hashPassword(plainPassword);
    
    return {
      success: true,
      hashedPassword
    };

  } catch (error) {
    return {
      success: false,
      error: error.message || '비밀번호 처리 중 오류가 발생했습니다.'
    };
  }
};

/**
 * bcrypt 해시인지 검증합니다
 * @param {string} hash - 검증할 해시 문자열
 * @returns {boolean} bcrypt 해시 여부
 */
export const isBcryptHash = (hash) => {
  if (!hash || typeof hash !== 'string') {
    return false;
  }
  
  // bcrypt 해시는 $2a$, $2b$, $2x$, $2y$로 시작하고 60자
  const bcryptRegex = /^\$2[abxy]?\$\d+\$/;
  return bcryptRegex.test(hash) && hash.length === 60;
};

/**
 * 기존 평문 비밀번호를 해시로 업그레이드합니다 (개발용)
 * @param {string} plainPassword - 평문 비밀번호
 * @returns {Promise<string>} 해시화된 비밀번호
 */
export const upgradePasswordToHash = async (plainPassword) => {
  console.log('⚠️ 평문 비밀번호를 해시로 업그레이드 중...');
  return await hashPassword(plainPassword);
};

/**
 * 비밀번호 검증 (기존 해시 또는 평문 처리)
 * @param {string} plainPassword - 입력된 평문 비밀번호
 * @param {string} storedPassword - 저장된 비밀번호 (해시 또는 평문)
 * @returns {Promise<{isValid: boolean, needsUpgrade: boolean, newHash?: string}>}
 */
export const verifyPasswordSmart = async (plainPassword, storedPassword) => {
  try {
    // 저장된 비밀번호가 해시인 경우
    if (isBcryptHash(storedPassword)) {
      const isValid = await verifyPassword(plainPassword, storedPassword);
      return {
        isValid,
        needsUpgrade: false
      };
    }
    
    // 저장된 비밀번호가 평문인 경우 (개발 중 임시 처리)
    console.log('⚠️ 평문 비밀번호가 감지되었습니다. 해시로 업그레이드를 권장합니다.');
    const isValid = plainPassword === storedPassword;
    
    if (isValid) {
      // 비밀번호가 맞으면 해시로 업그레이드
      const newHash = await hashPassword(plainPassword);
      return {
        isValid: true,
        needsUpgrade: true,
        newHash
      };
    }
    
    return {
      isValid: false,
      needsUpgrade: false
    };
    
  } catch (error) {
    console.error('스마트 비밀번호 검증 오류:', error);
    return {
      isValid: false,
      needsUpgrade: false
    };
  }
};

/**
 * 개발용: 기존 사용자들의 평문 비밀번호를 모두 해시로 변환
 * @param {Array} users - 사용자 배열
 * @returns {Promise<Array>} 업데이트된 사용자 배열
 */
export const upgradeAllUsersPasswords = async (users) => {
  console.log('🔄 모든 사용자의 비밀번호를 해시로 업그레이드 중...');
  
  const updatedUsers = [];
  
  for (const user of users) {
    try {
      if (!isBcryptHash(user.password)) {
        console.log(`사용자 ${user.email}의 비밀번호 업그레이드 중...`);
        const hashedPassword = await hashPassword(user.password);
        updatedUsers.push({
          ...user,
          password: hashedPassword,
          updatedAt: new Date().toISOString()
        });
      } else {
        updatedUsers.push(user);
      }
    } catch (error) {
      console.error(`사용자 ${user.email} 비밀번호 업그레이드 실패:`, error);
      updatedUsers.push(user); // 실패 시 원본 유지
    }
  }
  
  console.log('✅ 비밀번호 업그레이드 완료');
  return updatedUsers;
};