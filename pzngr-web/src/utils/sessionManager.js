// ========================================
// 임시 세션 관리 유틸리티
// ========================================

import { getFromLocalStorage, setToLocalStorage } from '../stores/utils/localStorage';

// 세션 상수
export const SESSION_KEYS = {
  GUEST_SESSION: 'guest-session',
  SESSION_DATA: 'session-data'
};

export const SESSION_DURATION = {
  GUEST: 7 * 24 * 60 * 60 * 1000, // 7일 (밀리초)
  INACTIVE_CLEANUP: 24 * 60 * 60 * 1000 // 24시간 후 정리
};

/**
 * 고유 세션 ID 생성
 * @returns {string} 생성된 세션 ID
 */
export const generateSessionId = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extra = Math.random().toString(36).substring(2, 15);
  return `guest_${timestamp}_${random}${extra}`;
};

/**
 * 임시 게스트 세션 생성
 * @returns {Object} 생성된 세션 정보
 */
export const createGuestSession = () => {
  const sessionId = generateSessionId();
  const now = Date.now();
  
  const session = {
    id: sessionId,
    type: 'guest',
    createdAt: now,
    lastActivity: now,
    expiresAt: now + SESSION_DURATION.GUEST,
    isActive: true,
    data: {
      preferences: {},
      cart: [],
      wishlist: [],
      viewHistory: [],
      recentViews: [],
      searchHistory: []
    }
  };

  setToLocalStorage(SESSION_KEYS.GUEST_SESSION, session);
  console.log('🆔 Guest session created:', sessionId);
  
  return session;
};

/**
 * 현재 게스트 세션 가져오기
 * @returns {Object|null} 세션 정보 또는 null
 */
export const getCurrentGuestSession = () => {
  const session = getFromLocalStorage(SESSION_KEYS.GUEST_SESSION);
  
  if (!session) return null;
  
  // 세션 만료 확인
  if (Date.now() > session.expiresAt) {
    cleanupExpiredSession();
    return null;
  }
  
  // 활동 시간 업데이트
  updateSessionActivity(session.id);
  
  return session;
};

/**
 * 세션이 존재하는지 확인
 * @returns {boolean} 세션 존재 여부
 */
export const hasActiveGuestSession = () => {
  return !!getCurrentGuestSession();
};

/**
 * 세션 활동 시간 업데이트
 * @param {string} sessionId - 세션 ID
 */
export const updateSessionActivity = (sessionId) => {
  const session = getFromLocalStorage(SESSION_KEYS.GUEST_SESSION);
  
  if (session && session.id === sessionId) {
    session.lastActivity = Date.now();
    setToLocalStorage(SESSION_KEYS.GUEST_SESSION, session);
  }
};

/**
 * 세션 데이터 업데이트
 * @param {string} key - 데이터 키
 * @param {any} value - 저장할 값
 * @returns {boolean} 업데이트 성공 여부
 */
export const updateSessionData = (key, value) => {
  const session = getCurrentGuestSession();
  
  if (!session) return false;
  
  session.data[key] = value;
  session.lastActivity = Date.now();
  
  setToLocalStorage(SESSION_KEYS.GUEST_SESSION, session);
  return true;
};

/**
 * 세션 데이터 가져오기
 * @param {string} key - 데이터 키
 * @returns {any} 저장된 값
 */
export const getSessionData = (key) => {
  const session = getCurrentGuestSession();
  return session ? session.data[key] : null;
};

/**
 * 만료된 세션 정리
 */
export const cleanupExpiredSession = () => {
  const session = getFromLocalStorage(SESSION_KEYS.GUEST_SESSION);
  
  if (session && Date.now() > session.expiresAt) {
    localStorage.removeItem(SESSION_KEYS.GUEST_SESSION);
    console.log('🧹 Expired guest session cleaned up:', session.id);
    return true;
  }
  
  return false;
};

/**
 * 비활성 세션 정리
 */
export const cleanupInactiveSessions = () => {
  const session = getFromLocalStorage(SESSION_KEYS.GUEST_SESSION);
  
  if (session) {
    const inactiveThreshold = Date.now() - SESSION_DURATION.INACTIVE_CLEANUP;
    
    if (session.lastActivity < inactiveThreshold) {
      localStorage.removeItem(SESSION_KEYS.GUEST_SESSION);
      console.log('🧹 Inactive guest session cleaned up:', session.id);
      return true;
    }
  }
  
  return false;
};

/**
 * 세션 연장
 * @param {number} additionalTime - 추가할 시간 (밀리초, 기본값: 7일)
 * @returns {boolean} 연장 성공 여부
 */
export const extendGuestSession = (additionalTime = SESSION_DURATION.GUEST) => {
  const session = getFromLocalStorage(SESSION_KEYS.GUEST_SESSION);
  
  if (!session) return false;
  
  session.expiresAt = Date.now() + additionalTime;
  session.lastActivity = Date.now();
  
  setToLocalStorage(SESSION_KEYS.GUEST_SESSION, session);
  console.log('⏰ Guest session extended:', session.id);
  
  return true;
};

/**
 * 게스트 세션을 회원 세션으로 마이그레이션
 * @param {Object} userData - 회원 정보
 * @returns {Object} 마이그레이션 결과
 */
export const migrateGuestToUser = (userData) => {
  const guestSession = getCurrentGuestSession();
  
  const migrationResult = {
    success: false,
    guestData: null,
    errors: []
  };
  
  if (!guestSession) {
    migrationResult.errors.push('Active guest session not found');
    return migrationResult;
  }
  
  try {
    // 게스트 데이터 백업
    migrationResult.guestData = {
      cart: guestSession.data.cart || [],
      wishlist: guestSession.data.wishlist || [],
      preferences: guestSession.data.preferences || {},
      viewHistory: guestSession.data.viewHistory || []
    };
    
    // 게스트 세션 정리
    localStorage.removeItem(SESSION_KEYS.GUEST_SESSION);
    
    migrationResult.success = true;
    console.log('✅ Guest session migrated to user:', userData.id);
    
  } catch (error) {
    migrationResult.errors.push(error.message);
    console.error('❌ Guest session migration failed:', error);
  }
  
  return migrationResult;
};

/**
 * 세션 정보 조회 (디버깅용)
 * @returns {Object} 세션 상태 정보
 */
export const getSessionInfo = () => {
  const session = getFromLocalStorage(SESSION_KEYS.GUEST_SESSION);
  
  if (!session) {
    return {
      hasSession: false,
      message: 'No active guest session'
    };
  }
  
  const now = Date.now();
  
  return {
    hasSession: true,
    sessionId: session.id,
    type: session.type,
    isExpired: now > session.expiresAt,
    isInactive: (now - session.lastActivity) > SESSION_DURATION.INACTIVE_CLEANUP,
    timeLeft: Math.max(0, session.expiresAt - now),
    lastActivity: new Date(session.lastActivity).toLocaleString('ko-KR'),
    createdAt: new Date(session.createdAt).toLocaleString('ko-KR'),
    expiresAt: new Date(session.expiresAt).toLocaleString('ko-KR'),
    dataKeys: Object.keys(session.data || {}),
    cartItems: session.data?.cart?.length || 0,
    wishlistItems: session.data?.wishlist?.length || 0
  };
};

/**
 * 게스트 세션 강제 정리 (관리자용)
 */
export const forceCleanupGuestSession = () => {
  localStorage.removeItem(SESSION_KEYS.GUEST_SESSION);
  console.log('🧹 Guest session forcefully cleaned up');
};

// 자동 정리 함수 (앱 시작시 실행)
export const initializeSessionCleanup = () => {
  // 만료된 세션 정리
  cleanupExpiredSession();
  
  // 비활성 세션 정리
  cleanupInactiveSessions();
  
  console.log('🔧 Session cleanup initialized');
};

// 개발 환경에서 전역 접근
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.PZNGR_SESSION = {
    createGuestSession,
    getCurrentGuestSession,
    hasActiveGuestSession,
    updateSessionData,
    getSessionData,
    getSessionInfo,
    migrateGuestToUser,
    forceCleanupGuestSession,
    cleanupExpiredSession,
    cleanupInactiveSessions
  };
  console.log('🛠️ Session utilities available at window.PZNGR_SESSION');
}