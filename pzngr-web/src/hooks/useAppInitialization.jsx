// ========================================
// 앱 초기화 Hook
// ========================================

import { useEffect, useState } from 'react';
import { useAppStore } from '../stores/appStore';
import { useProductStore } from '../stores/productStore';
import { getInitialDataFromStorage, INITIAL_DATA_KEYS } from '../data/initialData';

/**
 * 앱 초기화를 관리하는 커스텀 Hook
 * @returns {Object} 초기화 상태와 함수들
 */
export const useAppInitialization = () => {
  const [hydrated, setHydrated] = useState(false);
  
  const { 
    initializeApp,
    isAppReady,
    getInitializationStatus,
    isInitializing,
    initializationError
  } = useAppStore();
  
  const { setProducts } = useProductStore();

  // Zustand persist 하이드레이션 완료 확인
  useEffect(() => {
    const checkHydration = () => {
      // Zustand persist가 완료되면 상태가 복원됨
      setHydrated(true);
    };
    
    // 약간의 지연을 두어 하이드레이션 완료를 보장
    const timer = setTimeout(checkHydration, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // 앱 초기화 실행
  useEffect(() => {
    if (!hydrated) return;
    
    const runInitialization = async () => {
      console.log('🔧 Starting app initialization process...');
      
      try {
        // 앱 기본 초기화
        const initialized = await initializeApp();
        
        if (initialized) {
          // ProductStore에 초기 상품 데이터 로드
          const initialProducts = getInitialDataFromStorage(INITIAL_DATA_KEYS.PRODUCTS);
          if (initialProducts && initialProducts.length > 0) {
            console.log('📦 Loading initial products into ProductStore...');
            setProducts(initialProducts);
          }
          
          console.log('✅ App initialization completed successfully');
        }
        
      } catch (error) {
        console.error('❌ App initialization failed:', error);
      }
    };
    
    // 이미 초기화가 완료된 경우 건너뛰기
    if (isAppReady()) {
      console.log('✅ App already initialized');
      
      // ProductStore에 데이터가 없다면 로드
      const productStore = useProductStore.getState();
      if (productStore.products.length === 0) {
        const initialProducts = getInitialDataFromStorage(INITIAL_DATA_KEYS.PRODUCTS);
        if (initialProducts && initialProducts.length > 0) {
          setProducts(initialProducts);
        }
      }
      
      return;
    }
    
    runInitialization();
  }, [hydrated, initializeApp, setProducts, isAppReady]);

  // 초기화 상태 반환
  const status = getInitializationStatus();
  
  return {
    // 상태
    isHydrated: hydrated,
    isInitializing: isInitializing,
    isReady: status.isReady,
    error: initializationError,
    
    // 세부 상태
    initializationStatus: status,
    
    // 헬퍼 함수들
    retryInitialization: initializeApp,
    
    // 편의 상태
    showLoading: !hydrated || isInitializing,
    showError: !!initializationError,
    canProceed: hydrated && status.isReady && !initializationError
  };
};

/**
 * 앱 초기화 상태만 간단히 확인하는 Hook
 * @returns {boolean} 앱 사용 준비 완료 여부
 */
export const useAppReady = () => {
  const isReady = useAppStore(state => state.isAppReady());
  const [hydrated, setHydrated] = useState(false);
  
  useEffect(() => {
    setHydrated(true);
  }, []);
  
  return hydrated && isReady;
};