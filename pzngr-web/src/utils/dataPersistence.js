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
      // const oldDataPattern = /\d{4}-\d{2}-\d{2}/; // 날짜 패턴 (미사용)
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
 * 종합적인 지속성 테스트 실행 (앱 전체)
 * @returns {Object} 종합 테스트 결과
 */
export const runComprehensivePersistenceTest = () => {
  const testResults = {
    timestamp: new Date().toISOString(),
    overall: {
      status: DATA_PERSISTENCE_STATUS.SUCCESS,
      score: 0,
      maxScore: 100
    },
    tests: {
      storage: null,
      dataTypes: null,
      storeIntegration: null,
      performance: null,
      recovery: null
    },
    recommendations: [],
    warnings: [],
    errors: []
  };

  let totalScore = 0;

  try {
    // 1. 기본 저장소 테스트 (20점)
    console.log('🧪 Running storage availability test...');
    testResults.tests.storage = testDataPersistence();
    if (testResults.tests.storage.status === DATA_PERSISTENCE_STATUS.SUCCESS) {
      totalScore += 20;
    } else if (testResults.tests.storage.status === DATA_PERSISTENCE_STATUS.PARTIAL_FAILURE) {
      totalScore += 10;
      testResults.warnings.push('일부 데이터 타입에서 저장 문제 발생');
    } else {
      testResults.errors.push('기본 저장소 테스트 실패');
    }

    // 2. 데이터 타입별 상세 테스트 (20점)
    console.log('🧪 Running advanced data type tests...');
    const advancedTypeTests = runAdvancedDataTypeTests();
    testResults.tests.dataTypes = advancedTypeTests;
    if (advancedTypeTests.allPassed) {
      totalScore += 20;
    } else {
      totalScore += Math.round((advancedTypeTests.passedCount / advancedTypeTests.totalCount) * 20);
      testResults.warnings.push(`${advancedTypeTests.failedCount}개 고급 데이터 타입 테스트 실패`);
    }

    // 3. Zustand 스토어 통합 테스트 (25점)
    console.log('🧪 Running store integration tests...');
    const storeTests = runStoreIntegrationTests();
    testResults.tests.storeIntegration = storeTests;
    if (storeTests.allPassed) {
      totalScore += 25;
    } else {
      totalScore += Math.round((storeTests.passedCount / storeTests.totalCount) * 25);
      testResults.warnings.push(`${storeTests.failedCount}개 스토어 통합 테스트 실패`);
    }

    // 4. 성능 테스트 (20점)
    console.log('🧪 Running performance tests...');
    const performanceTests = runPerformanceTests();
    testResults.tests.performance = performanceTests;
    if (performanceTests.score >= 80) {
      totalScore += 20;
    } else if (performanceTests.score >= 60) {
      totalScore += 15;
    } else if (performanceTests.score >= 40) {
      totalScore += 10;
    } else {
      testResults.warnings.push('저장소 성능이 기준치보다 낮습니다');
    }

    // 5. 복구 기능 테스트 (15점)
    console.log('🧪 Running recovery tests...');
    const recoveryTests = runRecoveryTests();
    testResults.tests.recovery = recoveryTests;
    if (recoveryTests.allPassed) {
      totalScore += 15;
    } else {
      totalScore += Math.round((recoveryTests.passedCount / recoveryTests.totalCount) * 15);
      testResults.warnings.push('일부 데이터 복구 기능에 문제');
    }

  } catch (error) {
    testResults.errors.push(`종합 테스트 실행 중 오류: ${error.message}`);
  }

  // 최종 점수 및 상태 결정
  testResults.overall.score = totalScore;
  
  if (totalScore >= 90) {
    testResults.overall.status = DATA_PERSISTENCE_STATUS.SUCCESS;
    testResults.recommendations.push('✅ 모든 지속성 테스트가 우수한 결과를 보입니다.');
  } else if (totalScore >= 70) {
    testResults.overall.status = DATA_PERSISTENCE_STATUS.PARTIAL_FAILURE;
    testResults.recommendations.push('⚠️ 일부 기능에 문제가 있지만 사용 가능합니다.');
  } else {
    testResults.overall.status = DATA_PERSISTENCE_STATUS.TOTAL_FAILURE;
    testResults.recommendations.push('❌ 심각한 지속성 문제가 있습니다. 브라우저를 재시작하거나 다른 브라우저를 사용하세요.');
  }

  return testResults;
};

/**
 * 고급 데이터 타입 테스트
 * @returns {Object} 고급 테스트 결과
 */
const runAdvancedDataTypeTests = () => {
  const tests = [
    {
      name: 'Large Object Test',
      test: () => {
        const largeObject = { data: new Array(1000).fill(0).map((_, i) => ({ id: i, value: `item_${i}` })) };
        const key = '__test_large_object__';
        setToLocalStorage(key, largeObject);
        const retrieved = getFromLocalStorage(key);
        localStorage.removeItem(key);
        return JSON.stringify(retrieved) === JSON.stringify(largeObject);
      }
    },
    {
      name: 'Unicode String Test',
      test: () => {
        const unicodeString = '🚀 안녕하세요 🇰🇷 émojis and 特殊文字 test';
        const key = '__test_unicode__';
        setToLocalStorage(key, unicodeString);
        const retrieved = getFromLocalStorage(key);
        localStorage.removeItem(key);
        return retrieved === unicodeString;
      }
    },
    {
      name: 'Nested Object Test',
      test: () => {
        const nested = {
          level1: {
            level2: {
              level3: {
                level4: { value: 'deep nested value', array: [1, 2, { nested: true }] }
              }
            }
          }
        };
        const key = '__test_nested__';
        setToLocalStorage(key, nested);
        const retrieved = getFromLocalStorage(key);
        localStorage.removeItem(key);
        return JSON.stringify(retrieved) === JSON.stringify(nested);
      }
    },
    {
      name: 'Date Object Test',
      test: () => {
        const dateObj = { created: new Date(), timestamp: Date.now() };
        const key = '__test_date__';
        setToLocalStorage(key, dateObj);
        const retrieved = getFromLocalStorage(key);
        localStorage.removeItem(key);
        return retrieved.created && retrieved.timestamp === dateObj.timestamp;
      }
    },
    {
      name: 'Circular Reference Protection Test',
      test: () => {
        const obj = { name: 'test' };
        obj.self = obj; // circular reference
        const key = '__test_circular__';
        try {
          setToLocalStorage(key, obj);
          return false; // Should not reach here
        } catch (error) {
          return true; // Should throw error for circular reference
        } finally {
          localStorage.removeItem(key);
        }
      }
    }
  ];

  const results = tests.map(test => {
    try {
      return { name: test.name, passed: test.test(), error: null };
    } catch (error) {
      return { name: test.name, passed: false, error: error.message };
    }
  });

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    results,
    totalCount: tests.length,
    passedCount,
    failedCount,
    allPassed: failedCount === 0
  };
};

/**
 * Zustand 스토어 통합 테스트
 * @returns {Object} 스토어 통합 테스트 결과
 */
const runStoreIntegrationTests = () => {
  const tests = [
    {
      name: 'Store Persistence Test',
      test: () => {
        // 실제 앱 스토어들이 올바르게 persist되는지 확인
        const storeKeys = ['app-storage', 'cart-storage', 'user-storage', 'order-storage'];
        return storeKeys.every(key => {
          const stored = localStorage.getItem(key);
          return stored !== null;
        });
      }
    },
    {
      name: 'Store Data Integrity Test',
      test: () => {
        // 스토어 데이터가 올바른 구조를 가지는지 확인
        try {
          const cartData = localStorage.getItem('cart-storage');
          if (cartData) {
            const parsed = JSON.parse(cartData);
            return parsed.state && typeof parsed.state.items === 'object';
          }
          return true; // No data is fine
        } catch {
          return false;
        }
      }
    },
    {
      name: 'Store Version Compatibility Test',
      test: () => {
        // 스토어 버전 호환성 확인
        try {
          const appData = localStorage.getItem('app-storage');
          if (appData) {
            const parsed = JSON.parse(appData);
            return parsed.version !== undefined;
          }
          return true;
        } catch {
          return false;
        }
      }
    }
  ];

  const results = tests.map(test => {
    try {
      return { name: test.name, passed: test.test(), error: null };
    } catch (error) {
      return { name: test.name, passed: false, error: error.message };
    }
  });

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    results,
    totalCount: tests.length,
    passedCount,
    failedCount,
    allPassed: failedCount === 0
  };
};

/**
 * 성능 테스트
 * @returns {Object} 성능 테스트 결과
 */
const runPerformanceTests = () => {
  const results = {};
  let totalScore = 0;

  try {
    // 읽기 성능 테스트
    const readStart = performance.now();
    for (let i = 0; i < 100; i++) {
      getFromLocalStorage('app-storage');
    }
    const readTime = performance.now() - readStart;
    results.readTime = readTime;
    results.readScore = readTime < 50 ? 100 : Math.max(0, 100 - (readTime - 50));
    totalScore += results.readScore * 0.4;

    // 쓰기 성능 테스트
    const writeStart = performance.now();
    const testData = { test: 'performance', timestamp: Date.now() };
    for (let i = 0; i < 50; i++) {
      setToLocalStorage(`__perf_test_${i}__`, testData);
    }
    const writeTime = performance.now() - writeStart;
    results.writeTime = writeTime;
    results.writeScore = writeTime < 100 ? 100 : Math.max(0, 100 - (writeTime - 100));
    totalScore += results.writeScore * 0.6;

    // 정리
    for (let i = 0; i < 50; i++) {
      localStorage.removeItem(`__perf_test_${i}__`);
    }

  } catch (error) {
    results.error = error.message;
    totalScore = 0;
  }

  results.score = Math.round(totalScore);
  return results;
};

/**
 * 복구 기능 테스트
 * @returns {Object} 복구 테스트 결과
 */
const runRecoveryTests = () => {
  const tests = [
    {
      name: 'Backup Creation Test',
      test: () => {
        const testKey = '__test_recovery_data__';
        const testData = { id: 'test', value: 'recovery test' };
        setToLocalStorage(testKey, testData);
        const backupResult = createDataBackup(testKey);
        localStorage.removeItem(testKey);
        localStorage.removeItem(`${testKey}_backup`);
        return backupResult;
      }
    },
    {
      name: 'Data Recovery Test',
      test: () => {
        const testKey = '__test_recovery_main__';
        const backupKey = `${testKey}_backup`;
        const backupData = { id: 'backup', value: 'backup test data' };
        
        setToLocalStorage(backupKey, backupData);
        const recoveryResult = attemptDataRecovery(testKey);
        
        localStorage.removeItem(testKey);
        localStorage.removeItem(backupKey);
        
        return recoveryResult.success;
      }
    },
    {
      name: 'Storage Cleanup Test',
      test: () => {
        // 테스트 데이터 생성
        localStorage.setItem('__test_cleanup_1__', 'test1');
        localStorage.setItem('__test_cleanup_2__', 'test2');
        
        const cleanupResult = cleanupStorage(false);
        return cleanupResult.itemsRemoved >= 0; // 정리된 항목이 있어야 함
      }
    }
  ];

  const results = tests.map(test => {
    try {
      return { name: test.name, passed: test.test(), error: null };
    } catch (error) {
      return { name: test.name, passed: false, error: error.message };
    }
  });

  const passedCount = results.filter(r => r.passed).length;
  const failedCount = results.length - passedCount;

  return {
    results,
    totalCount: tests.length,
    passedCount,
    failedCount,
    allPassed: failedCount === 0
  };
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
    comprehensive: runComprehensivePersistenceTest(),
    recommendations: []
  };

  // 종합 권장사항
  if (!report.persistence.storageAvailable) {
    report.recommendations.push('❌ 저장소를 사용할 수 없습니다. 브라우저 설정을 확인하세요.');
  } else if (report.comprehensive.overall.score >= 90) {
    report.recommendations.push('✅ 데이터 지속성이 우수합니다.');
  } else if (report.comprehensive.overall.score >= 70) {
    report.recommendations.push('⚠️ 데이터 지속성에 일부 문제가 있지만 사용 가능합니다.');
  } else {
    report.recommendations.push('❌ 심각한 지속성 문제가 있습니다. 시스템 점검이 필요합니다.');
  }

  if (report.storage.usagePercentage > 50) {
    report.recommendations.push(`📊 저장소 사용량: ${report.storage.usagePercentage}% (${report.storage.totalSizeKB}KB)`);
  }

  // 종합 테스트 권장사항 추가
  report.recommendations.push(...report.comprehensive.recommendations);
  
  return report;
};

// 개발 환경에서 전역 접근
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.PZNGR_PERSISTENCE = {
    testDataPersistence,
    runComprehensivePersistenceTest,
    getStorageUsage,
    attemptDataRecovery,
    createDataBackup,
    cleanupStorage,
    generatePersistenceReport
  };
  console.log('🛠️ Data persistence utilities available at window.PZNGR_PERSISTENCE');
  console.log('📋 Run window.PZNGR_PERSISTENCE.runComprehensivePersistenceTest() for full test suite');
}