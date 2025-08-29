// ========================================
// 초기 데이터 로딩 및 관리 시스템
// ========================================

import { mockProducts } from './mockProducts';
import { mockUsers } from './mockUsers';
import { DEFAULT_CATEGORIES } from '../models/Category';

/**
 * 초기 데이터 구조 정의
 */
export const INITIAL_DATA_KEYS = {
  PRODUCTS: 'initial-products',
  USERS: 'initial-users', 
  CATEGORIES: 'initial-categories',
  APP_SETTINGS: 'app-settings'
};

/**
 * 초기 앱 설정
 */
export const INITIAL_APP_SETTINGS = {
  version: '1.0.0',
  lastDataUpdate: new Date().toISOString(),
  isFirstRun: true,
  dataInitialized: false,
  features: {
    cartEnabled: true,
    userRegistrationEnabled: false, // Phase 2에서 활성화
    orderEnabled: true,
    searchEnabled: true,
    reviewEnabled: false // Phase 7에서 활성화
  },
  theme: {
    primaryColor: '#007bff',
    mode: 'light'
  },
  notifications: {
    showWelcome: true,
    showDataLoaded: true
  }
};

/**
 * 초기 데이터 세트
 */
export const INITIAL_DATA = {
  [INITIAL_DATA_KEYS.PRODUCTS]: mockProducts,
  [INITIAL_DATA_KEYS.USERS]: mockUsers,
  [INITIAL_DATA_KEYS.CATEGORIES]: DEFAULT_CATEGORIES,
  [INITIAL_DATA_KEYS.APP_SETTINGS]: INITIAL_APP_SETTINGS
};

/**
 * localStorage에서 초기 데이터 확인
 * @param {string} key - 데이터 키
 * @returns {any|null} 저장된 데이터 또는 null
 */
export const getInitialDataFromStorage = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.warn(`Failed to load initial data for ${key}:`, error);
    return null;
  }
};

/**
 * localStorage에 초기 데이터 저장
 * @param {string} key - 데이터 키
 * @param {any} data - 저장할 데이터
 */
export const setInitialDataToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.warn(`Failed to save initial data for ${key}:`, error);
  }
};

/**
 * 모든 초기 데이터를 localStorage에 저장
 */
export const initializeAllData = () => {
  console.log('🚀 Initializing application data...');
  
  Object.entries(INITIAL_DATA).forEach(([key, data]) => {
    // 기존 데이터가 있는지 확인
    const existingData = getInitialDataFromStorage(key);
    
    if (!existingData) {
      console.log(`📦 Loading initial ${key}...`);
      setInitialDataToStorage(key, data);
    } else {
      console.log(`✅ ${key} already exists in storage`);
    }
  });

  // 앱 설정 업데이트 (항상 최신 상태로)
  const currentSettings = getInitialDataFromStorage(INITIAL_DATA_KEYS.APP_SETTINGS) || {};
  const updatedSettings = {
    ...INITIAL_APP_SETTINGS,
    ...currentSettings,
    dataInitialized: true,
    lastDataUpdate: new Date().toISOString()
  };
  
  setInitialDataToStorage(INITIAL_DATA_KEYS.APP_SETTINGS, updatedSettings);
  
  console.log('✨ Application data initialization completed!');
  return updatedSettings;
};

/**
 * 데이터 초기화 여부 확인
 * @returns {boolean} 초기화 완료 여부
 */
export const isDataInitialized = () => {
  const settings = getInitialDataFromStorage(INITIAL_DATA_KEYS.APP_SETTINGS);
  return settings?.dataInitialized || false;
};

/**
 * 특정 데이터 타입 강제 리로드
 * @param {string} dataKey - 리로드할 데이터 키
 */
export const reloadInitialData = (dataKey) => {
  if (INITIAL_DATA[dataKey]) {
    console.log(`🔄 Reloading ${dataKey}...`);
    setInitialDataToStorage(dataKey, INITIAL_DATA[dataKey]);
    console.log(`✅ ${dataKey} reloaded successfully`);
  } else {
    console.warn(`❌ Unknown data key: ${dataKey}`);
  }
};

/**
 * 모든 초기 데이터 삭제 (개발/테스트용)
 */
export const clearAllInitialData = () => {
  console.log('🗑️ Clearing all initial data...');
  
  Object.keys(INITIAL_DATA_KEYS).forEach(key => {
    const dataKey = INITIAL_DATA_KEYS[key];
    localStorage.removeItem(dataKey);
    console.log(`🗑️ Cleared ${dataKey}`);
  });
  
  console.log('✅ All initial data cleared');
};

/**
 * 데이터 버전 관리 (향후 업데이트용)
 */
export const DATA_VERSIONS = {
  PRODUCTS: '1.0.0',
  USERS: '1.0.0',
  CATEGORIES: '1.0.0'
};

/**
 * 데이터 마이그레이션 (향후 확장용)
 * @param {string} dataKey - 마이그레이션할 데이터 키
 * @param {string} fromVersion - 기존 버전
 * @param {string} toVersion - 목표 버전
 */
export const migrateData = (dataKey, fromVersion, toVersion) => {
  console.log(`🔄 Migrating ${dataKey} from ${fromVersion} to ${toVersion}`);
  // 향후 데이터 구조 변경시 마이그레이션 로직 구현
  console.log(`✅ Migration completed for ${dataKey}`);
};

/**
 * 개발용 데이터 상태 확인
 * @returns {Object} 데이터 상태 정보
 */
export const getDataStatus = () => {
  const status = {};
  
  Object.entries(INITIAL_DATA_KEYS).forEach(([key, storageKey]) => {
    const data = getInitialDataFromStorage(storageKey);
    status[key] = {
      exists: !!data,
      size: data ? JSON.stringify(data).length : 0,
      lastUpdate: data?.lastUpdate || null
    };
  });
  
  return {
    initialized: isDataInitialized(),
    dataStatus: status,
    storageUsage: Object.values(status).reduce((sum, item) => sum + item.size, 0)
  };
};

// 개발 환경에서 전역 접근 가능하도록 설정
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.PZNGR_DATA = {
    initializeAllData,
    clearAllInitialData,
    reloadInitialData,
    getDataStatus,
    isDataInitialized
  };
  console.log('🛠️ Development data utilities available at window.PZNGR_DATA');
}