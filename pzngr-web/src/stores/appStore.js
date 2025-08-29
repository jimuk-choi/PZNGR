// ========================================
// 앱 전체 상태 관리 store
// ========================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';
import { 
  initializeAllData, 
  getInitialDataFromStorage,
  INITIAL_DATA_KEYS,
  INITIAL_APP_SETTINGS 
} from '../data/initialData';
import { 
  testDataPersistence, 
  DATA_PERSISTENCE_STATUS,
  generatePersistenceReport 
} from '../utils/dataPersistence';

// 초기 상태
const initialState = {
  // 앱 설정
  settings: INITIAL_APP_SETTINGS,
  
  // 로딩 상태
  isInitializing: false,
  initializationError: null,
  
  // 데이터 로딩 상태
  dataLoadingStatus: {
    products: false,
    users: false,
    categories: false,
    overall: false
  },
  
  // 앱 상태
  isFirstRun: true,
  lastInitialized: null,
  
  // 지속성 테스트 결과
  persistenceStatus: null,
  persistenceTestCompleted: false,
  
  // UI 상태
  showWelcome: false,
  notifications: []
};

// 앱 상태 관리 store
export const useAppStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 앱 초기화 액션
      initializeApp: async () => {
        const state = get();
        
        if (state.isInitializing) {
          console.log('⏳ App initialization already in progress...');
          return;
        }

        set({ 
          isInitializing: true, 
          initializationError: null 
        });

        try {
          console.log('🚀 Starting app initialization...');
          
          // 1. 데이터 지속성 테스트 먼저 실행
          console.log('🔍 Testing data persistence...');
          const persistenceTest = testDataPersistence();
          set({ 
            persistenceStatus: persistenceTest,
            persistenceTestCompleted: true 
          });

          // 지속성 문제가 있는 경우 경고
          if (persistenceTest.status !== DATA_PERSISTENCE_STATUS.SUCCESS) {
            console.warn('⚠️ Data persistence issues detected:', persistenceTest);
            get().addNotification({
              type: 'warning',
              message: '데이터 저장에 일부 문제가 있습니다. 일부 기능이 제한될 수 있습니다.',
              autoHide: false
            });
          }
          
          // 2. 초기 데이터 로딩
          const settings = initializeAllData();
          
          // 데이터 로딩 상태 확인
          const dataStatus = {
            products: !!getInitialDataFromStorage(INITIAL_DATA_KEYS.PRODUCTS),
            users: !!getInitialDataFromStorage(INITIAL_DATA_KEYS.USERS),
            categories: !!getInitialDataFromStorage(INITIAL_DATA_KEYS.CATEGORIES),
          };
          
          dataStatus.overall = Object.values(dataStatus).every(Boolean);
          
          set({
            settings: settings,
            dataLoadingStatus: dataStatus,
            isFirstRun: settings.isFirstRun,
            showWelcome: settings.isFirstRun && settings.notifications.showWelcome,
            lastInitialized: new Date().toISOString(),
            isInitializing: false
          });

          // 첫 실행 후 상태 업데이트
          if (settings.isFirstRun) {
            get().markFirstRunComplete();
          }

          console.log('✅ App initialization completed successfully');
          
          // 환영 알림 추가
          if (settings.notifications.showDataLoaded) {
            get().addNotification({
              type: 'success',
              message: '앱 데이터가 성공적으로 로드되었습니다!',
              autoHide: true
            });
          }

          return true;

        } catch (error) {
          console.error('❌ App initialization failed:', error);
          set({
            initializationError: error.message,
            isInitializing: false
          });
          
          get().addNotification({
            type: 'error',
            message: '앱 초기화 중 오류가 발생했습니다.',
            autoHide: false
          });

          return false;
        }
      },

      // 첫 실행 완료 표시
      markFirstRunComplete: () => {
        const currentSettings = get().settings;
        const updatedSettings = {
          ...currentSettings,
          isFirstRun: false
        };
        
        set({ 
          settings: updatedSettings,
          isFirstRun: false,
          showWelcome: false
        });
      },

      // 설정 업데이트
      updateSettings: (newSettings) => {
        const currentSettings = get().settings;
        const updatedSettings = {
          ...currentSettings,
          ...newSettings
        };
        
        set({ settings: updatedSettings });
      },

      // 기능 토글
      toggleFeature: (featureName) => {
        const { settings } = get();
        const updatedSettings = {
          ...settings,
          features: {
            ...settings.features,
            [featureName]: !settings.features[featureName]
          }
        };
        
        set({ settings: updatedSettings });
      },

      // 알림 관리
      addNotification: (notification) => {
        const newNotification = {
          id: Date.now() + Math.random(),
          timestamp: new Date().toISOString(),
          ...notification
        };
        
        const { notifications } = get();
        set({ notifications: [...notifications, newNotification] });

        // 자동 숨김 처리
        if (notification.autoHide) {
          setTimeout(() => {
            get().removeNotification(newNotification.id);
          }, 5000);
        }
      },

      removeNotification: (notificationId) => {
        const { notifications } = get();
        set({ 
          notifications: notifications.filter(n => n.id !== notificationId) 
        });
      },

      clearAllNotifications: () => {
        set({ notifications: [] });
      },

      // 환영 메시지 숨김
      hideWelcome: () => {
        set({ showWelcome: false });
      },

      // 앱 재초기화 (개발용)
      reinitializeApp: async () => {
        console.log('🔄 Reinitializing app...');
        set(initialState);
        return await get().initializeApp();
      },

      // 헬퍼 함수들
      isFeatureEnabled: (featureName) => {
        return get().settings.features[featureName] || false;
      },

      getAppVersion: () => {
        return get().settings.version;
      },

      isAppReady: () => {
        const { isInitializing, dataLoadingStatus, initializationError } = get();
        return !isInitializing && dataLoadingStatus.overall && !initializationError;
      },

      getInitializationStatus: () => {
        const { isInitializing, dataLoadingStatus, initializationError, lastInitialized } = get();
        return {
          isInitializing,
          isReady: get().isAppReady(),
          dataStatus: dataLoadingStatus,
          error: initializationError,
          lastInitialized
        };
      },

      // 테마 관리
      setTheme: (theme) => {
        const { settings } = get();
        const updatedSettings = {
          ...settings,
          theme: {
            ...settings.theme,
            ...theme
          }
        };
        
        set({ settings: updatedSettings });
      },

      toggleThemeMode: () => {
        const { settings } = get();
        const newMode = settings.theme.mode === 'light' ? 'dark' : 'light';
        
        get().setTheme({ mode: newMode });
      },

      // 지속성 관리
      runPersistenceTest: () => {
        console.log('🔍 Running persistence test...');
        const testResult = testDataPersistence();
        set({ 
          persistenceStatus: testResult,
          persistenceTestCompleted: true 
        });
        return testResult;
      },

      getPersistenceReport: () => {
        return generatePersistenceReport();
      },

      isPersistenceHealthy: () => {
        const { persistenceStatus } = get();
        return persistenceStatus?.status === DATA_PERSISTENCE_STATUS.SUCCESS;
      },

      getPersistenceStatus: () => {
        return get().persistenceStatus;
      }
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(),
    }
  )
);

// 개발 환경 유틸리티
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.PZNGR_APP_STORE = useAppStore;
  console.log('🛠️ App store available at window.PZNGR_APP_STORE');
}