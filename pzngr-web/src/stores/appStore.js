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
          return state.isAppReady();
        }

        set({ 
          isInitializing: true, 
          initializationError: null 
        });

        const startTime = performance.now();
        let retryCount = 0;
        const maxRetries = 3;

        const attemptInitialization = async () => {
          try {
            console.log(`🚀 Starting app initialization... (attempt ${retryCount + 1}/${maxRetries + 1})`);
            
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
              
              // 심각한 저장소 문제인 경우 초기화 중단
              if (persistenceTest.status === DATA_PERSISTENCE_STATUS.STORAGE_UNAVAILABLE) {
                throw new Error('저장소를 사용할 수 없습니다. 브라우저 설정을 확인해주세요.');
              }
              
              get().addNotification({
                type: 'warning',
                message: '데이터 저장에 일부 문제가 있습니다. 일부 기능이 제한될 수 있습니다.',
                autoHide: false
              });
            }
            
            // 2. 초기 데이터 로딩 (타임아웃 설정)
            const dataLoadingPromise = new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error('데이터 로딩 시간 초과 (10초)'));
              }, 10000);
              
              try {
                const settings = initializeAllData();
                clearTimeout(timeout);
                resolve(settings);
              } catch (error) {
                clearTimeout(timeout);
                reject(error);
              }
            });
            
            const settings = await dataLoadingPromise;
            
            // 3. 데이터 로딩 상태 확인 및 검증
            const dataStatus = {
              products: !!getInitialDataFromStorage(INITIAL_DATA_KEYS.PRODUCTS),
              users: !!getInitialDataFromStorage(INITIAL_DATA_KEYS.USERS),
              categories: !!getInitialDataFromStorage(INITIAL_DATA_KEYS.CATEGORIES),
            };
            
            dataStatus.overall = Object.values(dataStatus).every(Boolean);
            
            // 4. 필수 데이터가 로드되지 않은 경우 경고
            if (!dataStatus.overall) {
              const missingData = Object.entries(dataStatus)
                .filter(([key, value]) => key !== 'overall' && !value)
                .map(([key]) => key);
              
              console.warn('⚠️ Missing essential data:', missingData);
              
              if (missingData.length === Object.keys(dataStatus).length - 1) {
                throw new Error('필수 데이터를 로드할 수 없습니다.');
              }
            }
            
            const endTime = performance.now();
            const initializationTime = Math.round(endTime - startTime);
            
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

            console.log(`✅ App initialization completed successfully in ${initializationTime}ms`);
            
            // 환영 알림 추가
            if (settings.notifications.showDataLoaded) {
              get().addNotification({
                type: 'success',
                message: `앱 데이터가 성공적으로 로드되었습니다! (${initializationTime}ms)`,
                autoHide: true
              });
            }

            return true;

          } catch (error) {
            console.error(`❌ App initialization failed (attempt ${retryCount + 1}):`, error);
            
            // 재시도 로직
            if (retryCount < maxRetries && !error.message.includes('저장소를 사용할 수 없습니다')) {
              retryCount++;
              console.log(`🔄 Retrying initialization in 1 second... (${retryCount}/${maxRetries})`);
              await new Promise(resolve => setTimeout(resolve, 1000));
              return attemptInitialization();
            }
            
            // 최종 실패
            const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
            set({
              initializationError: errorMessage,
              isInitializing: false
            });
            
            get().addNotification({
              type: 'error',
              message: `앱 초기화 실패: ${errorMessage}`,
              autoHide: false
            });

            return false;
          }
        };

        return attemptInitialization();
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