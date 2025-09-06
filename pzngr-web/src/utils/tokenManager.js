// ========================================
// JWT 토큰 저장 및 관리 유틸리티
// ========================================

import { verifyToken, refreshAccessToken, getTokenExpiration } from './jwtUtils';

// 토큰 저장 키
const TOKEN_STORAGE_KEYS = {
  ACCESS_TOKEN: 'pzngr_access_token',
  REFRESH_TOKEN: 'pzngr_refresh_token',
  TOKEN_METADATA: 'pzngr_token_metadata'
};

// 토큰 저장소 타입 (localStorage 대신 메모리 사용)
class TokenStorage {
  constructor() {
    this.memoryStorage = new Map();
    this.isEnabled = true;
  }

  setItem(key, value) {
    if (!this.isEnabled) return;
    try {
      this.memoryStorage.set(key, JSON.stringify(value));
    } catch (error) {
      console.warn('⚠️ Token storage setItem failed:', error);
    }
  }

  getItem(key) {
    if (!this.isEnabled) return null;
    try {
      const value = this.memoryStorage.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn('⚠️ Token storage getItem failed:', error);
      return null;
    }
  }

  removeItem(key) {
    if (!this.isEnabled) return;
    this.memoryStorage.delete(key);
  }

  clear() {
    this.memoryStorage.clear();
  }

  // 전체 토큰 관련 데이터 조회 (디버깅용)
  getAllTokenData() {
    const data = {};
    for (const [key, value] of this.memoryStorage.entries()) {
      if (key.startsWith('pzngr_')) {
        try {
          data[key] = JSON.parse(value);
        } catch (e) {
          data[key] = value;
        }
      }
    }
    return data;
  }
}

// 토큰 저장소 인스턴스
const tokenStorage = new TokenStorage();

// 토큰 저장 함수
export const saveTokens = (tokens) => {
  try {
    const { accessToken, refreshToken, tokenType, issuedAt } = tokens;

    if (!accessToken || !refreshToken) {
      throw new Error('Access token and refresh token are required');
    }

    // 토큰들을 개별 저장
    tokenStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    tokenStorage.setItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

    // 토큰 메타데이터 저장
    const metadata = {
      tokenType: tokenType || 'Bearer',
      issuedAt: issuedAt || new Date().toISOString(),
      lastRefreshedAt: null,
      autoRefreshEnabled: true
    };

    tokenStorage.setItem(TOKEN_STORAGE_KEYS.TOKEN_METADATA, metadata);

    console.log('🔐 Tokens saved successfully');
    return { success: true };

  } catch (error) {
    console.error('❌ Token save failed:', error);
    return { success: false, error: error.message };
  }
};

// 액세스 토큰 가져오기
export const getAccessToken = () => {
  try {
    const token = tokenStorage.getItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    return token;
  } catch (error) {
    console.error('❌ Access token retrieval failed:', error);
    return null;
  }
};

// 리프레시 토큰 가져오기
export const getRefreshToken = () => {
  try {
    const token = tokenStorage.getItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
    return token;
  } catch (error) {
    console.error('❌ Refresh token retrieval failed:', error);
    return null;
  }
};

// 토큰 메타데이터 가져오기
export const getTokenMetadata = () => {
  try {
    const metadata = tokenStorage.getItem(TOKEN_STORAGE_KEYS.TOKEN_METADATA);
    return metadata || {};
  } catch (error) {
    console.error('❌ Token metadata retrieval failed:', error);
    return {};
  }
};

// 토큰 유효성 검사
export const validateAccessToken = async () => {
  try {
    const token = getAccessToken();
    
    if (!token) {
      return {
        valid: false,
        reason: 'No access token found',
        needsRefresh: true
      };
    }

    const verification = await verifyToken(token);
    
    if (verification.success) {
      return {
        valid: true,
        payload: verification.payload,
        needsRefresh: false
      };
    }

    if (verification.isExpired) {
      return {
        valid: false,
        reason: 'Access token expired',
        needsRefresh: true,
        payload: verification.payload
      };
    }

    return {
      valid: false,
      reason: 'Invalid access token',
      needsRefresh: true
    };

  } catch (error) {
    console.error('❌ Access token validation failed:', error);
    return {
      valid: false,
      reason: 'Token validation error',
      needsRefresh: true
    };
  }
};

// 자동 토큰 갱신
export const autoRefreshToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    const metadata = getTokenMetadata();

    if (!refreshToken) {
      console.warn('⚠️ No refresh token available for auto refresh');
      return { success: false, error: 'No refresh token' };
    }

    if (!metadata.autoRefreshEnabled) {
      console.log('🔐 Auto refresh disabled');
      return { success: false, error: 'Auto refresh disabled' };
    }

    console.log('🔄 Auto refreshing access token...');
    const refreshResult = await refreshAccessToken(refreshToken);

    if (!refreshResult.success) {
      console.error('❌ Auto token refresh failed:', refreshResult.error);
      // 리프레시 토큰도 만료되었다면 전체 토큰 정리
      if (refreshResult.error.includes('Invalid refresh token')) {
        clearTokens();
      }
      return refreshResult;
    }

    // 새로운 액세스 토큰 저장
    tokenStorage.setItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN, refreshResult.accessToken);

    // 메타데이터 업데이트
    const updatedMetadata = {
      ...metadata,
      lastRefreshedAt: refreshResult.refreshedAt
    };
    tokenStorage.setItem(TOKEN_STORAGE_KEYS.TOKEN_METADATA, updatedMetadata);

    console.log('✅ Access token auto-refreshed');
    return {
      success: true,
      accessToken: refreshResult.accessToken,
      refreshedAt: refreshResult.refreshedAt
    };

  } catch (error) {
    console.error('❌ Auto refresh error:', error);
    return { success: false, error: error.message };
  }
};

// 유효한 액세스 토큰 가져오기 (자동 갱신 포함)
export const getValidAccessToken = async () => {
  try {
    const validation = await validateAccessToken();

    if (validation.valid) {
      return {
        success: true,
        token: getAccessToken(),
        payload: validation.payload
      };
    }

    if (validation.needsRefresh) {
      console.log('🔄 Access token needs refresh, attempting auto refresh...');
      const refreshResult = await autoRefreshToken();

      if (refreshResult.success) {
        const newValidation = await validateAccessToken();
        if (newValidation.valid) {
          return {
            success: true,
            token: refreshResult.accessToken,
            payload: newValidation.payload,
            wasRefreshed: true
          };
        }
      }

      return {
        success: false,
        error: 'Token refresh failed',
        details: refreshResult.error,
        needsLogin: true
      };
    }

    return {
      success: false,
      error: 'Invalid token',
      needsLogin: true
    };

  } catch (error) {
    console.error('❌ Get valid access token failed:', error);
    return {
      success: false,
      error: error.message,
      needsLogin: true
    };
  }
};

// 토큰 정리
export const clearTokens = () => {
  try {
    tokenStorage.removeItem(TOKEN_STORAGE_KEYS.ACCESS_TOKEN);
    tokenStorage.removeItem(TOKEN_STORAGE_KEYS.REFRESH_TOKEN);
    tokenStorage.removeItem(TOKEN_STORAGE_KEYS.TOKEN_METADATA);

    console.log('🧹 Tokens cleared');
    return { success: true };

  } catch (error) {
    console.error('❌ Token clear failed:', error);
    return { success: false, error: error.message };
  }
};

// 토큰 상태 조회
export const getTokenStatus = async () => {
  try {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    const metadata = getTokenMetadata();

    if (!accessToken && !refreshToken) {
      return {
        hasTokens: false,
        status: 'no_tokens'
      };
    }

    const accessValidation = await validateAccessToken();
    
    let refreshStatus = null;
    if (refreshToken) {
      const refreshVerification = await verifyToken(refreshToken);
      refreshStatus = {
        valid: refreshVerification.success,
        expired: refreshVerification.isExpired,
        payload: refreshVerification.payload
      };
    }

    // 액세스 토큰 만료 시간 정보
    let expirationInfo = null;
    if (accessToken) {
      expirationInfo = getTokenExpiration(accessToken);
    }

    return {
      hasTokens: true,
      accessToken: {
        exists: !!accessToken,
        valid: accessValidation.valid,
        needsRefresh: accessValidation.needsRefresh,
        expiration: expirationInfo
      },
      refreshToken: {
        exists: !!refreshToken,
        ...refreshStatus
      },
      metadata,
      status: accessValidation.valid ? 'valid' : (accessValidation.needsRefresh ? 'needs_refresh' : 'invalid')
    };

  } catch (error) {
    console.error('❌ Token status check failed:', error);
    return {
      hasTokens: false,
      status: 'error',
      error: error.message
    };
  }
};

// 토큰 만료 알림 설정
export const setupTokenExpirationNotification = (callback, checkInterval = 60000) => {
  let intervalId = null;

  const checkTokenExpiration = async () => {
    const status = await getTokenStatus();
    
    if (status.accessToken && status.accessToken.expiration && !status.accessToken.expiration.isExpired) {
      const timeRemaining = status.accessToken.expiration.timeRemaining;
      
      // 5분 이내에 만료되면 알림
      if (timeRemaining <= 5 * 60 * 1000) {
        callback({
          type: 'expiration_warning',
          timeRemaining,
          willExpireIn: status.accessToken.expiration.willExpireIn
        });
      }
    } else if (status.status === 'needs_refresh' || status.status === 'invalid') {
      callback({
        type: 'token_expired',
        status: status.status
      });
    }
  };

  // 주기적 체크 시작
  intervalId = setInterval(checkTokenExpiration, checkInterval);

  // 정리 함수 반환
  return () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };
};

// Authorization 헤더 생성
export const createAuthHeader = async () => {
  try {
    const tokenResult = await getValidAccessToken();
    
    if (!tokenResult.success) {
      return {
        success: false,
        error: tokenResult.error,
        needsLogin: tokenResult.needsLogin
      };
    }

    const metadata = getTokenMetadata();
    const tokenType = metadata.tokenType || 'Bearer';

    return {
      success: true,
      header: {
        'Authorization': `${tokenType} ${tokenResult.token}`
      },
      wasRefreshed: tokenResult.wasRefreshed
    };

  } catch (error) {
    console.error('❌ Auth header creation failed:', error);
    return {
      success: false,
      error: error.message,
      needsLogin: true
    };
  }
};

// 디버깅용 함수들
export const debugTokenManager = () => {
  return {
    storage: tokenStorage.getAllTokenData(),
    status: getTokenStatus(),
    accessToken: getAccessToken(),
    refreshToken: getRefreshToken(),
    metadata: getTokenMetadata()
  };
};

// 토큰 저장소 인스턴스 노출 (테스트용)
export { tokenStorage };