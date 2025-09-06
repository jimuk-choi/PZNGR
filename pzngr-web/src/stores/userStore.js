import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';
import { 
  createGuestSession, 
  getCurrentGuestSession, 
  hasActiveGuestSession,
  updateSessionActivity,
  initializeSessionCleanup
} from '../utils/sessionManager';
import { 
  migrateGuestDataToUser, 
  MIGRATION_STATUS,
  MigrationProgressTracker
} from '../utils/dataMigrationService';
import { 
  saveTokens, 
  clearTokens, 
  getTokenStatus,
  validateAccessToken,
  getValidAccessToken,
  setupTokenExpirationNotification
} from '../utils/tokenManager';

// 초기 상태
const initialState = {
  isLoggedIn: false,
  user: null,
  guestSession: null,
  sessionType: 'none', // 'none', 'guest', 'user'
  tokenExpirationNotifier: null,
};

// 사용자 상태 관리 store
export const useUserStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 앱 초기화시 세션 정리 및 복구
      initializeSession: async () => {
        console.log('🔧 Initializing user session...');
        
        // 세션 정리
        initializeSessionCleanup();
        
        const state = get();
        
        // JWT 토큰 상태 확인
        const tokenStatus = await getTokenStatus();
        console.log('🎫 Token status on init:', tokenStatus.status);
        
        // 이미 로그인된 상태면 토큰 유효성 검사
        if (state.isLoggedIn && state.user) {
          if (tokenStatus.hasTokens && tokenStatus.status === 'valid') {
            // 유효한 토큰이 있으면 세션 복원
            set({ 
              sessionType: 'user',
              guestSession: null 
            });
            console.log('✅ User session restored with valid tokens:', state.user.email);
            
            // 토큰 만료 알림 설정
            get().setupTokenExpirationHandler();
            
            // 장바구니 세션 초기화
            get().initializeCartSession(state.user.id, 'user');
            return;
          } else if (tokenStatus.status === 'needs_refresh') {
            // 토큰 갱신 시도
            console.log('🔄 Attempting token refresh on session init...');
            const refreshResult = await getValidAccessToken();
            
            if (refreshResult.success) {
              set({ 
                sessionType: 'user',
                guestSession: null 
              });
              console.log('✅ User session restored after token refresh:', state.user.email);
              
              // 토큰 만료 알림 설정
              get().setupTokenExpirationHandler();
              
              // 장바구니 세션 초기화
              get().initializeCartSession(state.user.id, 'user');
              return;
            } else {
              // 토큰 갱신 실패 - 로그아웃 처리
              console.warn('⚠️ Token refresh failed on init - logging out');
              get().logout();
              return;
            }
          } else {
            // 토큰이 유효하지 않으면 로그아웃 처리
            console.warn('⚠️ Invalid tokens on init - logging out');
            get().logout();
            return;
          }
        }
        
        // 기존 게스트 세션 확인
        if (hasActiveGuestSession()) {
          const guestSession = getCurrentGuestSession();
          set({ 
            sessionType: 'guest',
            guestSession: guestSession 
          });
          console.log('✅ Guest session restored:', guestSession.id);
          
          // 장바구니 세션 초기화
          get().initializeCartSession(guestSession.id, 'guest');
          return;
        }
        
        // 새 게스트 세션 생성
        const newGuestSession = get().createGuestSession();
        get().initializeCartSession(newGuestSession.id, 'guest');
      },

      // 장바구니 및 찜하기 세션 초기화
      initializeCartSession: (sessionId, sessionType) => {
        // 약간의 지연 후 cartStore 및 wishlistStore 초기화 (circular dependency 방지)
        setTimeout(() => {
          try {
            // 장바구니 세션 초기화
            const { useCartStore } = require('./cartStore');
            const cartStore = useCartStore.getState();
            cartStore.initializeCartSession(sessionId, sessionType);
            
            // 찜하기 세션 초기화
            const { useWishlistStore } = require('./wishlistStore');
            const wishlistStore = useWishlistStore.getState();
            wishlistStore.initializeWishlistSession(sessionId, sessionType);
            
          } catch (error) {
            console.warn('⚠️ Store initialization failed:', error.message);
          }
        }, 100);
      },

      // 게스트 세션 생성
      createGuestSession: () => {
        const guestSession = createGuestSession();
        set({ 
          sessionType: 'guest',
          guestSession: guestSession 
        });
        console.log('🆔 New guest session created in store');
        return guestSession;
      },

      // 현재 게스트 세션 가져오기
      getCurrentGuestSession: () => {
        const currentSession = getCurrentGuestSession();
        if (currentSession) {
          set({ guestSession: currentSession });
        }
        return currentSession;
      },

      // 세션 활동 업데이트
      updateSessionActivity: () => {
        const { guestSession, sessionType } = get();
        if (sessionType === 'guest' && guestSession) {
          updateSessionActivity(guestSession.id);
          // 스토어 상태도 업데이트
          const updatedSession = getCurrentGuestSession();
          if (updatedSession) {
            set({ guestSession: updatedSession });
          }
        }
      },

      // 회원 로그인 (게스트 데이터 마이그레이션 포함)
      login: async (userData, shouldMigrateGuest = true, migrationOptions = {}) => {
        console.log('👤 User login initiated:', userData.email);
        
        let comprehensiveMigrationResult = null;
        
        // 게스트 데이터 종합 마이그레이션
        if (shouldMigrateGuest && get().sessionType === 'guest') {
          console.log('🔄 Starting comprehensive guest data migration...');
          
          try {
            // 진행률 추적기 생성
            const progressTracker = new MigrationProgressTracker(6);
            progressTracker.nextStep('세션 초기화', 'Guest session validation');
            
            // 종합 마이그레이션 실행
            comprehensiveMigrationResult = await migrateGuestDataToUser(userData, {
              conflictResolution: migrationOptions.conflictResolution || 'merge',
              enableRollback: migrationOptions.enableRollback !== false,
              logProgress: true,
              ...migrationOptions
            });
            
            progressTracker.nextStep('마이그레이션 완료', 
              `${comprehensiveMigrationResult.summary.successful}/${comprehensiveMigrationResult.summary.totalTypes} successful`);
            
            console.log('📊 Migration summary:', {
              status: comprehensiveMigrationResult.overallStatus,
              successful: comprehensiveMigrationResult.summary.successful,
              failed: comprehensiveMigrationResult.summary.failed,
              duration: `${comprehensiveMigrationResult.duration}ms`
            });
            
          } catch (error) {
            console.error('❌ Comprehensive migration failed:', error);
            comprehensiveMigrationResult = {
              overallStatus: MIGRATION_STATUS.FAILED,
              errors: [error.message]
            };
          }
        }
        
        // JWT 토큰 저장 (userData에 토큰이 포함되어 있다고 가정)
        if (userData.tokens) {
          console.log('🔐 Saving JWT tokens...');
          const tokenSaveResult = saveTokens(userData.tokens);
          
          if (!tokenSaveResult.success) {
            console.error('❌ Failed to save tokens:', tokenSaveResult.error);
            return {
              success: false,
              error: 'Token storage failed',
              details: tokenSaveResult.error
            };
          }
        }
        
        // 사용자 상태 설정
        set({
          isLoggedIn: true,
          sessionType: 'user',
          guestSession: null,
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.isAdmin || false,
            migrationData: comprehensiveMigrationResult ? {
              migrationId: `migration_${Date.now()}`,
              status: comprehensiveMigrationResult.overallStatus,
              summary: comprehensiveMigrationResult.summary,
              migrations: comprehensiveMigrationResult.migrations,
              rollbackAvailable: !!comprehensiveMigrationResult.rollbackData,
              completedAt: new Date().toISOString()
            } : null
          },
        });
        
        // 토큰 만료 알림 설정
        get().setupTokenExpirationHandler();
        
        // 세션 초기화 (약간의 지연 후 - 마이그레이션 완료 후)
        setTimeout(() => {
          get().initializeCartSession(userData.id, 'user');
        }, 200);
        
        console.log('✅ User login completed with comprehensive migration and JWT tokens');
        return {
          success: true,
          migrationResult: comprehensiveMigrationResult,
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email
          },
          tokens: userData.tokens
        };
      },

      logout: () => {
        console.log('👋 User logout initiated');
        
        // JWT 토큰 정리
        clearTokens();
        
        // 토큰 만료 알림 정리
        get().clearTokenExpirationHandler();
        
        set({
          ...initialState,
          sessionType: 'guest'
        });
        
        // 로그아웃 후 새 게스트 세션 생성
        const newGuestSession = get().createGuestSession();
        
        // 새로운 게스트 장바구니 세션 초기화
        get().initializeCartSession(newGuestSession.id, 'guest');
        
        console.log('✅ User logout completed, tokens cleared, new guest session created');
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...userData,
            },
          });
        }
      },

      // 헬퍼 함수들
      getCurrentUser: () => get().user,
      isAuthenticated: () => get().isLoggedIn,
      isAdmin: () => get().user?.isAdmin || false,
      isGuest: () => get().sessionType === 'guest',
      getSessionType: () => get().sessionType,
      
      // 현재 사용자 식별자 (로그인: user.id, 게스트: session.id)
      getCurrentUserId: () => {
        const { isLoggedIn, user, guestSession } = get();
        if (isLoggedIn && user) return user.id;
        if (guestSession) return guestSession.id;
        return null;
      },

      // 마이그레이션 데이터 가져오기 (로그인 직후)
      getMigrationData: () => {
        const { user } = get();
        return user?.migrationData || null;
      },

      // 마이그레이션 데이터 정리 (처리 완료 후)
      clearMigrationData: () => {
        const { user } = get();
        if (user && user.migrationData) {
          set({
            user: {
              ...user,
              migrationData: null
            }
          });
        }
      },

      // 마이그레이션 롤백 실행
      rollbackMigration: async () => {
        const { user } = get();
        if (!user || !user.migrationData || !user.migrationData.rollbackAvailable) {
          return {
            success: false,
            error: 'No rollback data available'
          };
        }

        try {
          console.log('🔄 Starting migration rollback...');
          
          const { rollbackMigration } = await import('../utils/dataMigrationService');
          
          // 롤백 데이터는 별도로 저장되어 있다고 가정 (실제로는 저장 로직 필요)
          const rollbackResult = await rollbackMigration(null); // 실제로는 저장된 롤백 데이터 전달
          
          if (rollbackResult.success) {
            // 마이그레이션 데이터 정리
            set({
              user: {
                ...user,
                migrationData: {
                  ...user.migrationData,
                  rollbackCompleted: true,
                  rollbackCompletedAt: new Date().toISOString()
                }
              }
            });
            
            console.log('✅ Migration rollback completed');
            return { success: true };
          } else {
            console.error('❌ Migration rollback failed:', rollbackResult.error);
            return { success: false, error: rollbackResult.error };
          }
          
        } catch (error) {
          console.error('❌ Migration rollback error:', error);
          return { success: false, error: error.message };
        }
      },

      // 마이그레이션 상태 조회
      getMigrationStatus: () => {
        const { user } = get();
        if (!user || !user.migrationData) {
          return {
            hasMigration: false,
            status: null
          };
        }

        return {
          hasMigration: true,
          status: user.migrationData.status,
          summary: user.migrationData.summary,
          rollbackAvailable: user.migrationData.rollbackAvailable,
          completedAt: user.migrationData.completedAt,
          rollbackCompleted: user.migrationData.rollbackCompleted
        };
      },

      // JWT 토큰 관리 함수들
      
      // 토큰 만료 알림 핸들러 설정
      setupTokenExpirationHandler: () => {
        const { tokenExpirationNotifier } = get();
        
        // 이미 설정되어 있으면 정리 후 재설정
        if (tokenExpirationNotifier) {
          tokenExpirationNotifier();
        }
        
        const cleanup = setupTokenExpirationNotification((event) => {
          console.log('🔔 Token expiration event:', event.type);
          
          if (event.type === 'expiration_warning') {
            // 토큰 만료 5분 전 경고
            console.warn('⚠️ Token will expire in', event.willExpireIn.minutes, 'minutes');
            
            // 커스텀 이벤트 발행 (UI에서 알림 표시 가능)
            window.dispatchEvent(new CustomEvent('token-expiration-warning', {
              detail: event
            }));
            
          } else if (event.type === 'token_expired') {
            // 토큰 만료됨
            console.warn('⚠️ Tokens expired - user will be logged out');
            
            // 로그아웃 처리
            get().logout();
            
            // 커스텀 이벤트 발행
            window.dispatchEvent(new CustomEvent('token-expired', {
              detail: { message: 'Session expired - please log in again' }
            }));
          }
        });
        
        set({ tokenExpirationNotifier: cleanup });
        console.log('🔔 Token expiration handler setup complete');
      },
      
      // 토큰 만료 알림 핸들러 정리
      clearTokenExpirationHandler: () => {
        const { tokenExpirationNotifier } = get();
        if (tokenExpirationNotifier) {
          tokenExpirationNotifier();
          set({ tokenExpirationNotifier: null });
          console.log('🔔 Token expiration handler cleared');
        }
      },
      
      // 토큰 상태 조회
      getTokenStatus: async () => {
        return await getTokenStatus();
      },
      
      // 유효한 액세스 토큰 가져오기 (자동 갱신 포함)
      getValidAccessToken: async () => {
        return await getValidAccessToken();
      },
      
      // 토큰 수동 갱신
      refreshTokens: async () => {
        console.log('🔄 Manual token refresh initiated...');
        const refreshResult = await getValidAccessToken();
        
        if (refreshResult.success) {
          console.log('✅ Manual token refresh successful');
          return { success: true, wasRefreshed: refreshResult.wasRefreshed };
        } else {
          console.error('❌ Manual token refresh failed:', refreshResult.error);
          
          if (refreshResult.needsLogin) {
            // 토큰 갱신 실패 - 로그아웃 필요
            get().logout();
            return { 
              success: false, 
              error: 'Session expired - logged out automatically',
              needsLogin: true 
            };
          }
          
          return { success: false, error: refreshResult.error };
        }
      },
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(),
    }
  )
);