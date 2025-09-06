// ========================================
// JWT 토큰 기반 API 클라이언트
// ========================================

import { createAuthHeader, clearTokens, getValidAccessToken } from './tokenManager';

// API 기본 설정
const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

// HTTP 상태 코드
const HTTP_STATUS = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  TOKEN_EXPIRED: 498 // 커스텀 상태 코드
};

// API 에러 클래스
class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// 인증이 필요한 요청을 위한 HTTP 클라이언트
class ApiClient {
  constructor(options = {}) {
    this.baseURL = options.baseURL || API_CONFIG.BASE_URL;
    this.timeout = options.timeout || API_CONFIG.TIMEOUT;
    this.retryAttempts = options.retryAttempts || API_CONFIG.RETRY_ATTEMPTS;
    this.retryDelay = options.retryDelay || API_CONFIG.RETRY_DELAY;
    this.onAuthError = options.onAuthError || null;
  }

  // 요청 전 처리 (인증 헤더 추가)
  async prepareRequest(url, options = {}) {
    // 기본 헤더 설정
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    // 인증이 필요한 요청인지 확인
    const requiresAuth = options.requiresAuth !== false; // 기본값: true

    if (requiresAuth) {
      try {
        const authResult = await createAuthHeader();
        
        if (!authResult.success) {
          // 토큰 문제로 인증 실패
          if (authResult.needsLogin) {
            console.warn('⚠️ Authentication required - redirecting to login');
            if (this.onAuthError) {
              this.onAuthError({
                type: 'auth_required',
                message: 'Please log in to continue'
              });
            }
          }
          
          throw new ApiError(
            'Authentication failed',
            HTTP_STATUS.UNAUTHORIZED,
            'AUTH_FAILED',
            authResult.error
          );
        }

        // 인증 헤더 추가
        Object.assign(headers, authResult.header);

        // 토큰이 갱신되었다면 로그 출력
        if (authResult.wasRefreshed) {
          console.log('🔄 Token was auto-refreshed for API request');
        }

      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }
        
        throw new ApiError(
          'Failed to prepare authentication',
          HTTP_STATUS.UNAUTHORIZED,
          'AUTH_PREP_FAILED',
          error.message
        );
      }
    }

    // 완전한 URL 생성
    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    return {
      url: fullUrl,
      options: {
        ...options,
        headers,
        signal: this.createTimeoutSignal(options.timeout || this.timeout)
      }
    };
  }

  // 타임아웃 시그널 생성
  createTimeoutSignal(timeout) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
    }, timeout);

    // 정리를 위해 타임아웃 ID 저장
    controller.timeoutId = timeoutId;
    
    return controller.signal;
  }

  // 응답 후 처리
  async processResponse(response, originalUrl, originalOptions) {
    // 성공 응답
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return {
          success: true,
          data,
          status: response.status,
          headers: response.headers
        };
      }
      
      const text = await response.text();
      return {
        success: true,
        data: text,
        status: response.status,
        headers: response.headers
      };
    }

    // 인증 관련 에러 처리
    if (response.status === HTTP_STATUS.UNAUTHORIZED || response.status === HTTP_STATUS.FORBIDDEN) {
      console.warn('⚠️ Authentication error from server:', response.status);
      
      // 토큰 정리
      clearTokens();
      
      if (this.onAuthError) {
        this.onAuthError({
          type: 'server_auth_error',
          status: response.status,
          message: response.status === HTTP_STATUS.UNAUTHORIZED 
            ? 'Session expired - please log in again' 
            : 'Access forbidden'
        });
      }
    }

    // 에러 응답 처리
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Unknown error occurred' };
    }

    throw new ApiError(
      errorData.message || `HTTP ${response.status}`,
      response.status,
      errorData.code || 'HTTP_ERROR',
      errorData
    );
  }

  // 재시도 로직
  async executeWithRetry(requestFunc, retryCount = 0) {
    try {
      return await requestFunc();
    } catch (error) {
      // 재시도 가능한 에러인지 확인
      const isRetryable = this.isRetryableError(error);
      const canRetry = retryCount < this.retryAttempts && isRetryable;

      if (canRetry) {
        console.log(`🔄 Retrying request (${retryCount + 1}/${this.retryAttempts}):`, error.message);
        
        // 지연 후 재시도
        await this.delay(this.retryDelay * (retryCount + 1));
        return this.executeWithRetry(requestFunc, retryCount + 1);
      }

      throw error;
    }
  }

  // 재시도 가능한 에러인지 확인
  isRetryableError(error) {
    // 네트워크 에러나 서버 에러 (5xx)는 재시도 가능
    if (error.name === 'AbortError') return false; // 타임아웃은 재시도 안함
    if (error instanceof ApiError) {
      return error.status >= 500 || error.code === 'NETWORK_ERROR';
    }
    return true; // 기타 네트워크 에러
  }

  // 지연 함수
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // GET 요청
  async get(url, options = {}) {
    return this.executeWithRetry(async () => {
      const { url: fullUrl, options: requestOptions } = await this.prepareRequest(url, {
        ...options,
        method: 'GET'
      });

      const response = await fetch(fullUrl, requestOptions);
      return this.processResponse(response, url, options);
    });
  }

  // POST 요청
  async post(url, data, options = {}) {
    return this.executeWithRetry(async () => {
      const { url: fullUrl, options: requestOptions } = await this.prepareRequest(url, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined
      });

      const response = await fetch(fullUrl, requestOptions);
      return this.processResponse(response, url, options);
    });
  }

  // PUT 요청
  async put(url, data, options = {}) {
    return this.executeWithRetry(async () => {
      const { url: fullUrl, options: requestOptions } = await this.prepareRequest(url, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined
      });

      const response = await fetch(fullUrl, requestOptions);
      return this.processResponse(response, url, options);
    });
  }

  // DELETE 요청
  async delete(url, options = {}) {
    return this.executeWithRetry(async () => {
      const { url: fullUrl, options: requestOptions } = await this.prepareRequest(url, {
        ...options,
        method: 'DELETE'
      });

      const response = await fetch(fullUrl, requestOptions);
      return this.processResponse(response, url, options);
    });
  }

  // PATCH 요청
  async patch(url, data, options = {}) {
    return this.executeWithRetry(async () => {
      const { url: fullUrl, options: requestOptions } = await this.prepareRequest(url, {
        ...options,
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined
      });

      const response = await fetch(fullUrl, requestOptions);
      return this.processResponse(response, url, options);
    });
  }

  // 파일 업로드
  async uploadFile(url, file, options = {}) {
    return this.executeWithRetry(async () => {
      const formData = new FormData();
      formData.append('file', file);

      // 파일 업로드는 Content-Type을 자동으로 설정하도록 함
      const uploadOptions = {
        ...options,
        headers: {
          ...options.headers
          // Content-Type 헤더를 제거하여 브라우저가 자동 설정하도록 함
        }
      };
      delete uploadOptions.headers['Content-Type'];

      const { url: fullUrl, options: requestOptions } = await this.prepareRequest(url, {
        ...uploadOptions,
        method: 'POST',
        body: formData
      });

      const response = await fetch(fullUrl, requestOptions);
      return this.processResponse(response, url, options);
    });
  }
}

// 기본 API 클라이언트 인스턴스 생성
const createApiClient = (options = {}) => {
  return new ApiClient(options);
};

// 기본 인증 API 클라이언트
const authApiClient = createApiClient({
  onAuthError: (error) => {
    // 전역 인증 에러 처리
    console.warn('🔐 Global auth error:', error);
    
    // 커스텀 이벤트 발행 (React 컴포넌트에서 리스닝 가능)
    window.dispatchEvent(new CustomEvent('auth-error', { 
      detail: error 
    }));
  }
});

// 인증이 필요없는 퍼블릭 API 클라이언트
const publicApiClient = createApiClient({
  onAuthError: null
});

// 헬퍼 함수들

// 인증된 GET 요청
export const authenticatedGet = (url, options = {}) => 
  authApiClient.get(url, { requiresAuth: true, ...options });

// 인증된 POST 요청  
export const authenticatedPost = (url, data, options = {}) =>
  authApiClient.post(url, data, { requiresAuth: true, ...options });

// 인증된 PUT 요청
export const authenticatedPut = (url, data, options = {}) =>
  authApiClient.put(url, data, { requiresAuth: true, ...options });

// 인증된 DELETE 요청
export const authenticatedDelete = (url, options = {}) =>
  authApiClient.delete(url, { requiresAuth: true, ...options });

// 퍼블릭 GET 요청
export const publicGet = (url, options = {}) =>
  publicApiClient.get(url, { requiresAuth: false, ...options });

// 퍼블릭 POST 요청
export const publicPost = (url, data, options = {}) =>
  publicApiClient.post(url, data, { requiresAuth: false, ...options });

// 내보내기
export { 
  ApiClient, 
  ApiError, 
  authApiClient, 
  publicApiClient, 
  createApiClient,
  HTTP_STATUS 
};