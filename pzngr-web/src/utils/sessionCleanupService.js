// ========================================
// 세션 자동 정리 서비스
// ========================================

import { cleanupExpiredSession, cleanupInactiveSessions } from './sessionManager';

let cleanupInterval = null;

/**
 * 세션 정리 서비스 시작
 * @param {number} intervalMinutes - 정리 주기 (분, 기본값: 30분)
 */
export const startSessionCleanupService = (intervalMinutes = 30) => {
  if (cleanupInterval) {
    console.log('⚠️ Session cleanup service is already running');
    return;
  }
  
  const intervalMs = intervalMinutes * 60 * 1000;
  
  cleanupInterval = setInterval(() => {
    console.log('🧹 Running scheduled session cleanup...');
    
    const expiredCleaned = cleanupExpiredSession();
    const inactiveCleaned = cleanupInactiveSessions();
    
    if (expiredCleaned || inactiveCleaned) {
      console.log('✅ Session cleanup completed');
    }
  }, intervalMs);
  
  console.log(`🔧 Session cleanup service started (every ${intervalMinutes} minutes)`);
};

/**
 * 세션 정리 서비스 중지
 */
export const stopSessionCleanupService = () => {
  if (cleanupInterval) {
    clearInterval(cleanupInterval);
    cleanupInterval = null;
    console.log('⏹️ Session cleanup service stopped');
  }
};

/**
 * 앱 시작시 정리 서비스 초기화
 */
export const initializeSessionCleanupService = () => {
  // 즉시 한번 정리
  cleanupExpiredSession();
  cleanupInactiveSessions();
  
  // 자동 정리 서비스 시작 (30분마다)
  startSessionCleanupService(30);
};

// 페이지 언로드시 정리
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    stopSessionCleanupService();
  });
  
  // 페이지 포커스시 즉시 정리 실행
  window.addEventListener('focus', () => {
    cleanupExpiredSession();
    cleanupInactiveSessions();
  });
}