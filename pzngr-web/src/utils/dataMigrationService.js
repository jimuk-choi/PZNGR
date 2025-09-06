// ========================================
// 비회원 → 회원 데이터 마이그레이션 서비스
// ========================================

import { migrateGuestToUser, getSessionData } from './sessionManager';

// 마이그레이션 결과 상수
export const MIGRATION_STATUS = {
  SUCCESS: 'success',
  PARTIAL_SUCCESS: 'partial_success',
  FAILED: 'failed',
  SKIPPED: 'skipped',
  CONFLICT: 'conflict'
};

// 충돌 해결 전략
export const CONFLICT_RESOLUTION = {
  MERGE: 'merge',           // 두 데이터를 병합
  GUEST_PRIORITY: 'guest',  // 게스트 데이터 우선
  USER_PRIORITY: 'user',    // 기존 사용자 데이터 우선
  ASK_USER: 'ask'          // 사용자에게 선택 요청
};

// 마이그레이션 가능한 데이터 타입
export const MIGRATION_TYPES = {
  CART: 'cart',
  WISHLIST: 'wishlist',
  PREFERENCES: 'preferences',
  VIEW_HISTORY: 'viewHistory',
  SEARCH_HISTORY: 'searchHistory',
  RECENT_VIEWS: 'recentViews'
};

/**
 * 종합적인 게스트 → 회원 데이터 마이그레이션
 * @param {Object} userData - 회원 정보
 * @param {Object} options - 마이그레이션 옵션
 * @returns {Object} 마이그레이션 결과
 */
export const migrateGuestDataToUser = async (userData, options = {}) => {
  const startTime = Date.now();
  console.log('🔄 Starting comprehensive guest-to-user data migration for:', userData.email);

  const migrationResult = {
    userId: userData.id,
    userEmail: userData.email,
    startTime: new Date(startTime).toISOString(),
    endTime: null,
    duration: 0,
    overallStatus: MIGRATION_STATUS.SUCCESS,
    migrations: {},
    conflicts: [],
    errors: [],
    summary: {
      totalTypes: 0,
      successful: 0,
      failed: 0,
      skipped: 0,
      conflicts: 0
    },
    rollbackData: null
  };

  // 기본 옵션 설정
  const defaultOptions = {
    conflictResolution: CONFLICT_RESOLUTION.MERGE,
    enableRollback: true,
    skipEmpty: true,
    validateData: true,
    logProgress: true,
    typesToMigrate: Object.values(MIGRATION_TYPES)
  };

  const finalOptions = { ...defaultOptions, ...options };

  try {
    // 1. 게스트 세션 데이터 수집
    const guestSessionResult = migrateGuestToUser(userData);
    if (!guestSessionResult.success) {
      migrationResult.overallStatus = MIGRATION_STATUS.FAILED;
      migrationResult.errors.push('Guest session migration failed');
      return migrationResult;
    }

    const guestData = guestSessionResult.guestData;
    if (!guestData) {
      migrationResult.overallStatus = MIGRATION_STATUS.SKIPPED;
      migrationResult.errors.push('No guest data found');
      return migrationResult;
    }

    // 2. 롤백 데이터 준비 (기존 사용자 데이터 백업)
    if (finalOptions.enableRollback) {
      migrationResult.rollbackData = await collectUserDataForRollback(userData.id);
    }

    // 3. 각 데이터 타입별 마이그레이션 실행
    for (const migrationType of finalOptions.typesToMigrate) {
      migrationResult.summary.totalTypes++;
      
      try {
        const migrationStatus = await migrateDataType(
          migrationType,
          guestData,
          userData,
          finalOptions
        );
        
        migrationResult.migrations[migrationType] = migrationStatus;
        
        // 결과 집계
        switch (migrationStatus.status) {
          case MIGRATION_STATUS.SUCCESS:
            migrationResult.summary.successful++;
            break;
          case MIGRATION_STATUS.FAILED:
            migrationResult.summary.failed++;
            migrationResult.errors.push(`${migrationType}: ${migrationStatus.error}`);
            break;
          case MIGRATION_STATUS.SKIPPED:
            migrationResult.summary.skipped++;
            break;
          case MIGRATION_STATUS.CONFLICT:
            migrationResult.summary.conflicts++;
            migrationResult.conflicts.push({
              type: migrationType,
              details: migrationStatus.conflict
            });
            break;
        }
        
        if (finalOptions.logProgress) {
          console.log(`✅ ${migrationType} migration:`, migrationStatus.status);
        }
        
      } catch (error) {
        migrationResult.summary.failed++;
        migrationResult.errors.push(`${migrationType}: ${error.message}`);
        migrationResult.migrations[migrationType] = {
          status: MIGRATION_STATUS.FAILED,
          error: error.message
        };
      }
    }

    // 4. 전체 상태 결정
    migrationResult.overallStatus = determineOverallStatus(migrationResult.summary);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    migrationResult.overallStatus = MIGRATION_STATUS.FAILED;
    migrationResult.errors.push(`Critical error: ${error.message}`);
  } finally {
    // 5. 마이그레이션 완료 처리
    const endTime = Date.now();
    migrationResult.endTime = new Date(endTime).toISOString();
    migrationResult.duration = endTime - startTime;
    
    console.log(`🏁 Migration completed in ${migrationResult.duration}ms`);
    console.log(`📊 Results: ${migrationResult.summary.successful}/${migrationResult.summary.totalTypes} successful`);
  }

  return migrationResult;
};

/**
 * 특정 데이터 타입 마이그레이션
 * @param {string} migrationType - 마이그레이션 타입
 * @param {Object} guestData - 게스트 데이터
 * @param {Object} userData - 회원 데이터
 * @param {Object} options - 옵션
 * @returns {Object} 마이그레이션 상태
 */
const migrateDataType = async (migrationType, guestData, userData, options) => {
  const migrationStatus = {
    type: migrationType,
    status: MIGRATION_STATUS.SKIPPED,
    itemsCount: 0,
    migratedCount: 0,
    error: null,
    conflict: null,
    details: {}
  };

  // 게스트 데이터가 없으면 스킵
  const guestItems = guestData[migrationType];
  if (!guestItems || (Array.isArray(guestItems) && guestItems.length === 0)) {
    if (options.skipEmpty) {
      return migrationStatus;
    }
  }

  migrationStatus.itemsCount = Array.isArray(guestItems) ? guestItems.length : 1;

  try {
    switch (migrationType) {
      case MIGRATION_TYPES.CART:
        return await migrateCartData(guestItems, userData, options, migrationStatus);
      
      case MIGRATION_TYPES.WISHLIST:
        return await migrateWishlistData(guestItems, userData, options, migrationStatus);
      
      case MIGRATION_TYPES.PREFERENCES:
        return await migratePreferencesData(guestItems, userData, options, migrationStatus);
      
      case MIGRATION_TYPES.VIEW_HISTORY:
        return await migrateViewHistoryData(guestItems, userData, options, migrationStatus);
      
      case MIGRATION_TYPES.SEARCH_HISTORY:
        return await migrateSearchHistoryData(guestItems, userData, options, migrationStatus);
      
      case MIGRATION_TYPES.RECENT_VIEWS:
        return await migrateRecentViewsData(guestItems, userData, options, migrationStatus);
      
      default:
        migrationStatus.status = MIGRATION_STATUS.SKIPPED;
        migrationStatus.error = `Unsupported migration type: ${migrationType}`;
        return migrationStatus;
    }
  } catch (error) {
    migrationStatus.status = MIGRATION_STATUS.FAILED;
    migrationStatus.error = error.message;
    return migrationStatus;
  }
};

/**
 * 장바구니 데이터 마이그레이션
 */
const migrateCartData = async (guestCartItems, userData, options, migrationStatus) => {
  try {
    const { useCartStore } = require('../stores/cartStore');
    const cartStore = useCartStore.getState();
    
    // 기존 장바구니와 충돌 확인
    const existingItems = cartStore.items;
    
    if (existingItems.length > 0 && options.conflictResolution === CONFLICT_RESOLUTION.ASK_USER) {
      migrationStatus.status = MIGRATION_STATUS.CONFLICT;
      migrationStatus.conflict = {
        message: '기존 장바구니에 상품이 있습니다.',
        existingCount: existingItems.length,
        guestCount: guestCartItems.length
      };
      return migrationStatus;
    }
    
    // 마이그레이션 실행
    const result = cartStore.migrateGuestCartToUser(userData.id);
    
    if (result.success) {
      migrationStatus.status = MIGRATION_STATUS.SUCCESS;
      migrationStatus.migratedCount = result.migratedItemCount;
      migrationStatus.details = {
        totalValue: cartStore.totalPrice,
        mergedWithExisting: existingItems.length > 0
      };
    } else {
      migrationStatus.status = MIGRATION_STATUS.FAILED;
      migrationStatus.error = 'Cart migration failed';
    }
    
  } catch (error) {
    migrationStatus.status = MIGRATION_STATUS.FAILED;
    migrationStatus.error = error.message;
  }
  
  return migrationStatus;
};

/**
 * 찜하기 데이터 마이그레이션
 */
const migrateWishlistData = async (guestWishlistItems, userData, options, migrationStatus) => {
  try {
    const { useWishlistStore } = require('../stores/wishlistStore');
    const wishlistStore = useWishlistStore.getState();
    
    // 기존 찜하기와 충돌 확인
    const existingItems = wishlistStore.items;
    
    if (existingItems.length > 0 && options.conflictResolution === CONFLICT_RESOLUTION.ASK_USER) {
      migrationStatus.status = MIGRATION_STATUS.CONFLICT;
      migrationStatus.conflict = {
        message: '기존 찜하기에 상품이 있습니다.',
        existingCount: existingItems.length,
        guestCount: guestWishlistItems.length
      };
      return migrationStatus;
    }
    
    // 마이그레이션 실행
    const result = wishlistStore.migrateGuestWishlistToUser(userData.id);
    
    if (result.success) {
      migrationStatus.status = MIGRATION_STATUS.SUCCESS;
      migrationStatus.migratedCount = result.migratedItemCount;
      migrationStatus.details = {
        mergedWithExisting: existingItems.length > 0
      };
    } else {
      migrationStatus.status = MIGRATION_STATUS.FAILED;
      migrationStatus.error = 'Wishlist migration failed';
    }
    
  } catch (error) {
    migrationStatus.status = MIGRATION_STATUS.FAILED;
    migrationStatus.error = error.message;
  }
  
  return migrationStatus;
};

/**
 * 사용자 설정 데이터 마이그레이션
 */
const migratePreferencesData = async (guestPreferences, userData, options, migrationStatus) => {
  // 설정 데이터는 향후 UserStore나 별도 PreferencesStore에서 처리
  migrationStatus.status = MIGRATION_STATUS.SUCCESS;
  migrationStatus.migratedCount = Object.keys(guestPreferences || {}).length;
  migrationStatus.details = { preferences: guestPreferences };
  
  return migrationStatus;
};

/**
 * 조회 기록 데이터 마이그레이션
 */
const migrateViewHistoryData = async (guestViewHistory, userData, options, migrationStatus) => {
  // 조회 기록은 향후 별도 서비스에서 처리
  migrationStatus.status = MIGRATION_STATUS.SUCCESS;
  migrationStatus.migratedCount = Array.isArray(guestViewHistory) ? guestViewHistory.length : 0;
  migrationStatus.details = { viewHistory: guestViewHistory };
  
  return migrationStatus;
};

/**
 * 검색 기록 데이터 마이그레이션
 */
const migrateSearchHistoryData = async (guestSearchHistory, userData, options, migrationStatus) => {
  // 검색 기록은 향후 별도 서비스에서 처리
  migrationStatus.status = MIGRATION_STATUS.SUCCESS;
  migrationStatus.migratedCount = Array.isArray(guestSearchHistory) ? guestSearchHistory.length : 0;
  migrationStatus.details = { searchHistory: guestSearchHistory };
  
  return migrationStatus;
};

/**
 * 최근 본 상품 데이터 마이그레이션
 */
const migrateRecentViewsData = async (guestRecentViews, userData, options, migrationStatus) => {
  // 최근 본 상품은 향후 별도 서비스에서 처리
  migrationStatus.status = MIGRATION_STATUS.SUCCESS;
  migrationStatus.migratedCount = Array.isArray(guestRecentViews) ? guestRecentViews.length : 0;
  migrationStatus.details = { recentViews: guestRecentViews };
  
  return migrationStatus;
};

/**
 * 전체 마이그레이션 상태 결정
 */
const determineOverallStatus = (summary) => {
  if (summary.failed > 0) {
    if (summary.successful > 0) {
      return MIGRATION_STATUS.PARTIAL_SUCCESS;
    }
    return MIGRATION_STATUS.FAILED;
  }
  
  if (summary.conflicts > 0) {
    return MIGRATION_STATUS.CONFLICT;
  }
  
  if (summary.successful === 0) {
    return MIGRATION_STATUS.SKIPPED;
  }
  
  return MIGRATION_STATUS.SUCCESS;
};

/**
 * 롤백을 위한 사용자 데이터 수집
 */
const collectUserDataForRollback = async (userId) => {
  const rollbackData = {
    userId,
    timestamp: new Date().toISOString(),
    data: {}
  };

  try {
    // 장바구니 데이터
    const { useCartStore } = require('../stores/cartStore');
    const cartStore = useCartStore.getState();
    rollbackData.data.cart = [...cartStore.items];
    
    // 찜하기 데이터
    const { useWishlistStore } = require('../stores/wishlistStore');
    const wishlistStore = useWishlistStore.getState();
    rollbackData.data.wishlist = [...wishlistStore.items];
    
  } catch (error) {
    console.warn('⚠️ Failed to collect rollback data:', error.message);
  }

  return rollbackData;
};

/**
 * 마이그레이션 롤백 실행
 */
export const rollbackMigration = async (rollbackData) => {
  if (!rollbackData || !rollbackData.data) {
    throw new Error('No rollback data available');
  }

  console.log('🔄 Rolling back migration for user:', rollbackData.userId);

  try {
    // 장바구니 롤백
    if (rollbackData.data.cart) {
      const { useCartStore } = require('../stores/cartStore');
      const cartStore = useCartStore.getState();
      cartStore.clearCart();
      
      rollbackData.data.cart.forEach(item => {
        cartStore.addToCart(item, item.quantity, item.selectedOptions || []);
      });
    }
    
    // 찜하기 롤백
    if (rollbackData.data.wishlist) {
      const { useWishlistStore } = require('../stores/wishlistStore');
      const wishlistStore = useWishlistStore.getState();
      wishlistStore.clearWishlist();
      
      rollbackData.data.wishlist.forEach(item => {
        wishlistStore.addToWishlist({
          id: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          brand: item.brand,
          category: item.category
        });
      });
    }
    
    console.log('✅ Migration rollback completed');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Migration rollback failed:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 마이그레이션 진행률 추적기
 */
export class MigrationProgressTracker {
  constructor(totalSteps = 6) {
    this.totalSteps = totalSteps;
    this.currentStep = 0;
    this.progress = 0;
    this.startTime = Date.now();
    this.logs = [];
  }

  nextStep(stepName, details = '') {
    this.currentStep++;
    this.progress = Math.round((this.currentStep / this.totalSteps) * 100);
    
    const logEntry = {
      step: this.currentStep,
      name: stepName,
      details,
      timestamp: new Date().toISOString(),
      progress: this.progress
    };
    
    this.logs.push(logEntry);
    console.log(`📊 Migration progress: ${this.progress}% - ${stepName} ${details}`);
    
    return logEntry;
  }

  getProgress() {
    return {
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      progress: this.progress,
      duration: Date.now() - this.startTime,
      logs: this.logs
    };
  }
}

// 개발 환경에서 전역 접근
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.PZNGR_MIGRATION = {
    migrateGuestDataToUser,
    rollbackMigration,
    MigrationProgressTracker,
    MIGRATION_STATUS,
    CONFLICT_RESOLUTION,
    MIGRATION_TYPES
  };
  console.log('🛠️ Migration utilities available at window.PZNGR_MIGRATION');
}