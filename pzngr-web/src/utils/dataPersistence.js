// ========================================
// 데이터 지속성 테스트 및 관리 유틸리티
// ========================================

import { getFromLocalStorage, setToLocalStorage } from '../stores/utils/localStorage';
import { INITIAL_DATA_KEYS } from '../data/initialData';

/**
 * 데이터 지속성 테스트 결과
 */
export const DATA_PERSISTENCE_STATUS = {
  SUCCESS: 'success',
  PARTIAL_FAILURE: 'partial_failure', 
  TOTAL_FAILURE: 'total_failure',
  STORAGE_UNAVAILABLE: 'storage_unavailable'
};

/**
 * localStorage 사용 가능 여부 확인
 * @returns {boolean} localStorage 사용 가능 여부
 */
export const isLocalStorageAvailable = () => {
  try {
    const testKey = '__ls_test__';
    const testValue = 'test';
    localStorage.setItem(testKey, testValue);
    const retrieved = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);
    return retrieved === testValue;
  } catch (error) {
    console.warn('LocalStorage is not available:', error);
    return false;
  }
};

/**
 * 저장소 용량 확인
 * @returns {Object} 저장소 용량 정보
 */
export const getStorageUsage = () => {
  if (!isLocalStorageAvailable()) {
    return {
      available: false,
      totalSize: 0,
      usedSize: 0,
      freeSize: 0,
      usage: []
    };
  }

  const usage = [];
  let totalSize = 0;

  // localStorage의 모든 항목 크기 계산
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      const size = new Blob([key + value]).size;
      totalSize += size;
      usage.push({ key, size, sizeKB: (size / 1024).toFixed(2) });
    }
  }

  // 대략적인 localStorage 한계 (보통 5-10MB)
  const estimatedLimit = 5 * 1024 * 1024; // 5MB
  const freeSize = Math.max(0, estimatedLimit - totalSize);

  return {
    available: true,
    totalSize,
    usedSize: totalSize,
    freeSize,
    totalSizeKB: (totalSize / 1024).toFixed(2),
    totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
    usagePercentage: ((totalSize / estimatedLimit) * 100).toFixed(1),
    usage: usage.sort((a, b) => b.size - a.size)
  };
};

/**
 * 데이터 지속성 테스트 실행
 * @returns {Object} 테스트 결과
 */
export const testDataPersistence = () => {
  const testResults = {
    status: DATA_PERSISTENCE_STATUS.SUCCESS,
    timestamp: new Date().toISOString(),
    storageAvailable: false,
    storageUsage: null,
    dataTests: {},
    recommendations: [],
    errors: []
  };

  // 1. localStorage 사용 가능성 확인
  testResults.storageAvailable = isLocalStorageAvailable();
  testResults.storageUsage = getStorageUsage();

  if (!testResults.storageAvailable) {
    testResults.status = DATA_PERSISTENCE_STATUS.STORAGE_UNAVAILABLE;
    testResults.errors.push('localStorage가 사용 불가능합니다.');
    testResults.recommendations.push('브라우저의 프라이빗 모드를 종료하거나 다른 브라우저를 사용해보세요.');
    return testResults;
  }

  // 2. 각 데이터 타입별 저장/불러오기 테스트
  const testData = {
    test_string: 'Hello PZNGR',
    test_number: 12345,
    test_boolean: true,
    test_array: [1, 2, 3],
    test_object: { key: 'value', nested: { data: true } },
    test_timestamp: new Date().toISOString()
  };

  let successCount = 0;
  let totalTests = 0;

  Object.entries(testData).forEach(([key, value]) => {
    totalTests++;
    const testKey = `__persistence_test_${key}__`;
    
    try {
      // 저장 테스트
      setToLocalStorage(testKey, value);
      
      // 불러오기 테스트
      const retrieved = getFromLocalStorage(testKey);
      
      // 데이터 일치성 확인
      const isMatch = JSON.stringify(retrieved) === JSON.stringify(value);
      
      testResults.dataTests[key] = {
        success: isMatch,
        original: value,
        retrieved: retrieved,
        match: isMatch
      };

      if (isMatch) {
        successCount++;
      } else {
        testResults.errors.push(`데이터 타입 ${key}에서 불일치 발생`);
      }

      // 테스트 데이터 정리
      localStorage.removeItem(testKey);

    } catch (error) {
      testResults.dataTests[key] = {
        success: false,
        error: error.message
      };
      testResults.errors.push(`데이터 타입 ${key} 테스트 실패: ${error.message}`);
    }
  });

  // 3. 상태 결정
  if (successCount === totalTests) {
    testResults.status = DATA_PERSISTENCE_STATUS.SUCCESS;
  } else if (successCount > 0) {
    testResults.status = DATA_PERSISTENCE_STATUS.PARTIAL_FAILURE;
    testResults.recommendations.push('일부 데이터 타입에 문제가 있습니다. 앱 기능에 제한이 있을 수 있습니다.');
  } else {
    testResults.status = DATA_PERSISTENCE_STATUS.TOTAL_FAILURE;
    testResults.recommendations.push('데이터 저장이 완전히 실패했습니다. 브라우저를 재시작해보세요.');
  }

  // 4. 실제 앱 데이터 존재 여부 확인
  const appDataStatus = {};
  Object.values(INITIAL_DATA_KEYS).forEach(key => {
    const data = getFromLocalStorage(key);
    appDataStatus[key] = {
      exists: !!data,
      size: data ? JSON.stringify(data).length : 0,
      valid: data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
    };
  });
  
  testResults.appDataStatus = appDataStatus;

  // 5. 권장사항 추가
  if (testResults.storageUsage.usagePercentage > 80) {
    testResults.recommendations.push('저장소 사용량이 높습니다. 불필요한 데이터를 정리하세요.');
  }

  if (testResults.storageUsage.totalSizeMB > 2) {
    testResults.recommendations.push('저장소 사용량이 2MB를 초과했습니다. 성능에 영향이 있을 수 있습니다.');
  }

  return testResults;
};

/**
 * 데이터 복구 시도
 * @param {string} dataKey - 복구할 데이터 키
 * @returns {Object} 복구 결과
 */
export const attemptDataRecovery = (dataKey) => {
  const result = {
    success: false,
    message: '',
    data: null,
    backupFound: false
  };

  try {
    // 1. 백업 키 확인
    const backupKey = `${dataKey}_backup`;
    const backupData = getFromLocalStorage(backupKey);
    
    if (backupData) {
      result.backupFound = true;
      setToLocalStorage(dataKey, backupData);
      result.success = true;
      result.data = backupData;
      result.message = '백업 데이터로부터 성공적으로 복구했습니다.';
      return result;
    }

    // 2. 기본 데이터로 복구 시도
    if (INITIAL_DATA_KEYS[dataKey] || Object.values(INITIAL_DATA_KEYS).includes(dataKey)) {
      // 초기 데이터로 복구하는 로직은 initialData.js에서 처리
      result.message = '초기 데이터로 복구가 필요합니다.';
      return result;
    }

    result.message = '복구 가능한 데이터를 찾을 수 없습니다.';

  } catch (error) {
    result.message = `데이터 복구 중 오류 발생: ${error.message}`;
  }

  return result;
};

/**
 * 데이터 백업 생성
 * @param {string} dataKey - 백업할 데이터 키
 * @returns {boolean} 백업 성공 여부
 */
export const createDataBackup = (dataKey) => {
  try {
    const data = getFromLocalStorage(dataKey);
    if (!data) return false;

    const backupKey = `${dataKey}_backup`;
    setToLocalStorage(backupKey, {
      ...data,
      _backup_timestamp: new Date().toISOString(),
      _original_key: dataKey
    });

    return true;
  } catch (error) {
    console.warn(`Failed to create backup for ${dataKey}:`, error);
    return false;
  }
};

/**
 * 저장소 정리
 * @param {boolean} aggressive - 적극적 정리 여부
 * @returns {Object} 정리 결과
 */
export const cleanupStorage = (aggressive = false) => {
  const result = {
    cleaned: [],
    errors: [],
    sizeBefore: 0,
    sizeAfter: 0,
    itemsRemoved: 0
  };

  const usageBefore = getStorageUsage();
  result.sizeBefore = usageBefore.totalSize;

  try {
    // 1. 임시 테스트 데이터 정리
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('__') && key.includes('test')) {
        try {
          localStorage.removeItem(key);
          result.cleaned.push(key);
          result.itemsRemoved++;
        } catch (error) {
          result.errors.push(`Failed to remove ${key}: ${error.message}`);
        }
      }
    });

    // 2. 적극적 정리 모드
    if (aggressive) {
      const oldDataPattern = /\d{4}-\d{2}-\d{2}/; // 날짜 패턴
      const currentTime = new Date().getTime();
      const weekAgo = currentTime - (7 * 24 * 60 * 60 * 1000);

      Object.keys(localStorage).forEach(key => {
        try {
          const value = localStorage.getItem(key);
          const data = JSON.parse(value);
          
          // 오래된 임시 데이터 확인
          if (data._timestamp || data.timestamp) {
            const timestamp = new Date(data._timestamp || data.timestamp).getTime();
            if (timestamp < weekAgo) {
              localStorage.removeItem(key);
              result.cleaned.push(`${key} (old temporary data)`);
              result.itemsRemoved++;
            }
          }
        } catch (error) {
          // JSON 파싱 실패는 무시 (다른 앱의 데이터일 수 있음)
        }
      });
    }

  } catch (error) {
    result.errors.push(`Cleanup error: ${error.message}`);
  }

  const usageAfter = getStorageUsage();
  result.sizeAfter = usageAfter.totalSize;
  
  return result;
};

/**
 * 개발용: 전체 지속성 상태 리포트
 * @returns {Object} 종합 리포트
 */
export const generatePersistenceReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    browser: {
      userAgent: navigator.userAgent,
      cookieEnabled: navigator.cookieEnabled,
      localStorage: isLocalStorageAvailable()
    },
    storage: getStorageUsage(),
    persistence: testDataPersistence(),
    recommendations: []
  };

  // 종합 권장사항
  if (!report.persistence.storageAvailable) {
    report.recommendations.push('❌ 저장소를 사용할 수 없습니다. 브라우저 설정을 확인하세요.');
  } else if (report.persistence.status === DATA_PERSISTENCE_STATUS.SUCCESS) {
    report.recommendations.push('✅ 데이터 지속성이 정상적으로 작동합니다.');
  } else {
    report.recommendations.push('⚠️ 데이터 지속성에 문제가 있습니다. 일부 기능이 제한될 수 있습니다.');
  }

  if (report.storage.usagePercentage > 50) {
    report.recommendations.push(`📊 저장소 사용량: ${report.storage.usagePercentage}% (${report.storage.totalSizeKB}KB)`);
  }

  return report;
};

// 개발 환경에서 전역 접근
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.PZNGR_PERSISTENCE = {
    testDataPersistence,
    getStorageUsage,
    attemptDataRecovery,
    createDataBackup,
    cleanupStorage,
    generatePersistenceReport
  };
  console.log('🛠️ Data persistence utilities available at window.PZNGR_PERSISTENCE');
}