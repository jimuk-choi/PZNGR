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

// 초기 상태
const initialState = {
  isLoggedIn: false,
  user: null,
  guestSession: null,
  sessionType: 'none', // 'none', 'guest', 'user'
};

// 사용자 상태 관리 store
export const useUserStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 앱 초기화시 세션 정리 및 복구
      initializeSession: () => {
        console.log('🔧 Initializing user session...');
        
        // 세션 정리
        initializeSessionCleanup();
        
        const state = get();
        
        // 이미 로그인된 상태면 user 세션으로 설정
        if (state.isLoggedIn && state.user) {
          set({ 
            sessionType: 'user',
            guestSession: null 
          });
          console.log('✅ User session restored:', state.user.email);
          
          // 장바구니 세션 초기화
          get().initializeCartSession(state.user.id, 'user');
          return;
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
        
        // 세션 초기화 (약간의 지연 후 - 마이그레이션 완료 후)
        setTimeout(() => {
          get().initializeCartSession(userData.id, 'user');
        }, 200);
        
        console.log('✅ User login completed with comprehensive migration');
        return {
          success: true,
          migrationResult: comprehensiveMigrationResult,
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email
          }
        };
      },

      logout: () => {
        console.log('👋 User logout initiated');
        set({
          ...initialState,
          sessionType: 'guest'
        });
        
        // 로그아웃 후 새 게스트 세션 생성
        const newGuestSession = get().createGuestSession();
        
        // 새로운 게스트 장바구니 세션 초기화
        get().initializeCartSession(newGuestSession.id, 'guest');
        
        console.log('✅ User logout completed, new guest session created');
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
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(),
    }
  )
);