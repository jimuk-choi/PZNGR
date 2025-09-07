// ========================================
// JWT 토큰 관리 유틸리티 (브라우저 호환)
// ========================================

import * as jose from 'jose';

// JWT 설정 상수
const JWT_CONFIG = {
  // 개발용 시크릿 키 (실제 운영에서는 환경변수로 관리)
  SECRET_KEY: process.env.REACT_APP_JWT_SECRET || 'pzngr-shopping-mall-secret-key-2024',
  
  // 토큰 만료 시간
  EXPIRES_IN: {
    ACCESS_TOKEN: '1h',       // 액세스 토큰: 1시간
    REFRESH_TOKEN: '7d',      // 리프레시 토큰: 7일
  },
  
  // 토큰 타입
  TOKEN_TYPE: {
    ACCESS: 'access',
    REFRESH: 'refresh'
  },

  // 발급자 정보
  ISSUER: 'pzngr-web-app',
  AUDIENCE: 'pzngr-users'
};

// 시크릿 키를 Uint8Array로 변환
const getSecretKey = (secretKey = JWT_CONFIG.SECRET_KEY) => {
  return new TextEncoder().encode(secretKey);
};

// 만료 시간을 초 단위로 변환
const parseExpiresIn = (expiresIn) => {
  if (typeof expiresIn === 'number') return expiresIn;
  
  const units = {
    's': 1,
    'm': 60,
    'h': 3600,
    'd': 86400
  };
  
  const match = expiresIn.match(/^(\d+)([smhd])$/);
  if (match) {
    return parseInt(match[1]) * units[match[2]];
  }
  
  return 3600; // 기본 1시간
};

// 토큰 생성 함수
export const generateToken = async (payload, options = {}) => {
  try {
    const {
      type = JWT_CONFIG.TOKEN_TYPE.ACCESS,
      expiresIn = type === JWT_CONFIG.TOKEN_TYPE.REFRESH 
        ? JWT_CONFIG.EXPIRES_IN.REFRESH_TOKEN 
        : JWT_CONFIG.EXPIRES_IN.ACCESS_TOKEN,
      secretKey = JWT_CONFIG.SECRET_KEY
    } = options;

    const secret = getSecretKey(secretKey);
    const expirationSeconds = parseExpiresIn(expiresIn);
    const now = Math.floor(Date.now() / 1000);

    // JWT 페이로드 구성
    const jwtPayload = {
      ...payload,
      tokenType: type,
      iss: JWT_CONFIG.ISSUER,
      aud: JWT_CONFIG.AUDIENCE,
      iat: now,
      exp: now + expirationSeconds
    };

    // 토큰 생성
    const token = await new jose.SignJWT(jwtPayload)
      .setProtectedHeader({ alg: 'HS256' })
      .sign(secret);

    console.log(`🎫 ${type.toUpperCase()} token generated for user:`, payload.userId || payload.sub);

    return {
      success: true,
      token,
      tokenType: type,
      expiresIn,
      issuedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Token generation failed:', error);
    return {
      success: false,
      error: 'Token generation failed',
      details: error.message
    };
  }
};

// 토큰 검증 함수
export const verifyToken = async (token, options = {}) => {
  try {
    const {
      secretKey = JWT_CONFIG.SECRET_KEY,
      ignoreExpiration = false
    } = options;

    const secret = getSecretKey(secretKey);

    // 토큰 검증
    const { payload } = await jose.jwtVerify(token, secret, {
      issuer: JWT_CONFIG.ISSUER,
      audience: JWT_CONFIG.AUDIENCE,
      clockTolerance: ignoreExpiration ? Infinity : 0
    });

    console.log(`✅ Token verified for user:`, payload.userId || payload.sub);

    return {
      success: true,
      payload: payload,
      tokenType: payload.tokenType || JWT_CONFIG.TOKEN_TYPE.ACCESS,
      isValid: true,
      isExpired: false
    };

  } catch (error) {
    console.error('❌ Token verification failed:', error.name, error.message);

    // 임시 토큰 처리 (개발/테스트용)
    if (token && token.includes('.')) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          // 임시 토큰 서명 확인
          if (parts[2].includes('temp_signature_')) {
            console.warn('⚠️ 임시 토큰을 사용 중입니다 (개발용)');
            return {
              success: true,
              payload: payload,
              isExpired: false,
              isValid: true,
              isTemporary: true
            };
          }
        }
      } catch (tempError) {
        console.error('❌ 임시 토큰 처리 실패:', tempError);
      }
    }

    // 만료된 토큰인지 확인
    if (error.code === 'ERR_JWT_EXPIRED') {
      try {
        // 만료 무시하고 디코딩해서 페이로드는 반환
        const { payload } = await jose.jwtVerify(token, getSecretKey(options.secretKey || JWT_CONFIG.SECRET_KEY), {
          issuer: JWT_CONFIG.ISSUER,
          audience: JWT_CONFIG.AUDIENCE,
          clockTolerance: Infinity
        });

        return {
          success: false,
          error: 'Token expired',
          payload: payload,
          tokenType: payload.tokenType || JWT_CONFIG.TOKEN_TYPE.ACCESS,
          isValid: false,
          isExpired: true,
          expiredAt: new Date(payload.exp * 1000).toISOString()
        };
      } catch (decodeError) {
        return {
          success: false,
          error: 'Token expired and decode failed',
          isValid: false,
          isExpired: true
        };
      }
    }

    return {
      success: false,
      error: error.code === 'ERR_JWT_INVALID' ? 'Invalid token' : 'Token verification failed',
      details: error.message,
      isValid: false,
      isExpired: false
    };
  }
};

// 토큰 디코딩 (검증 없이 정보만 추출)
export const decodeToken = (token) => {
  try {
    const payload = jose.decodeJwt(token);
    const header = jose.decodeProtectedHeader(token);
    
    if (!payload) {
      return {
        success: false,
        error: 'Invalid token format'
      };
    }

    return {
      success: true,
      header: header,
      payload: payload,
      tokenType: payload.tokenType || JWT_CONFIG.TOKEN_TYPE.ACCESS
    };

  } catch (error) {
    console.error('❌ Token decode failed:', error);
    return {
      success: false,
      error: 'Token decode failed',
      details: error.message
    };
  }
};

// 토큰 갱신 함수
export const refreshAccessToken = async (refreshToken, options = {}) => {
  try {
    // 리프레시 토큰 검증
    const refreshVerification = await verifyToken(refreshToken, {
      ...options,
      secretKey: options.refreshSecretKey || JWT_CONFIG.SECRET_KEY
    });

    if (!refreshVerification.success) {
      return {
        success: false,
        error: 'Invalid refresh token',
        details: refreshVerification.error
      };
    }

    // 리프레시 토큰 타입 확인
    if (refreshVerification.payload.tokenType !== JWT_CONFIG.TOKEN_TYPE.REFRESH) {
      return {
        success: false,
        error: 'Not a refresh token'
      };
    }

    // 새로운 액세스 토큰 생성
    const { tokenType, iat, exp, iss, aud, ...userPayload } = refreshVerification.payload;
    
    const newAccessToken = await generateToken(userPayload, {
      type: JWT_CONFIG.TOKEN_TYPE.ACCESS,
      expiresIn: JWT_CONFIG.EXPIRES_IN.ACCESS_TOKEN,
      secretKey: options.accessSecretKey || JWT_CONFIG.SECRET_KEY
    });

    if (!newAccessToken.success) {
      return {
        success: false,
        error: 'Failed to generate new access token'
      };
    }

    console.log('🔄 Access token refreshed for user:', userPayload.userId || userPayload.sub);

    return {
      success: true,
      accessToken: newAccessToken.token,
      tokenType: 'Bearer',
      expiresIn: JWT_CONFIG.EXPIRES_IN.ACCESS_TOKEN,
      refreshedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('❌ Token refresh failed:', error);
    return {
      success: false,
      error: 'Token refresh failed',
      details: error.message
    };
  }
};

// 토큰 쌍 생성 (액세스 + 리프레시)
export const generateTokenPair = async (userPayload, options = {}) => {
  try {
    // 액세스 토큰 생성
    const accessTokenResult = await generateToken(userPayload, {
      type: JWT_CONFIG.TOKEN_TYPE.ACCESS,
      expiresIn: JWT_CONFIG.EXPIRES_IN.ACCESS_TOKEN,
      secretKey: options.accessSecretKey || JWT_CONFIG.SECRET_KEY
    });

    if (!accessTokenResult.success) {
      return {
        success: false,
        error: 'Failed to generate access token',
        details: accessTokenResult.error
      };
    }

    // 리프레시 토큰 생성
    const refreshTokenResult = await generateToken(userPayload, {
      type: JWT_CONFIG.TOKEN_TYPE.REFRESH,
      expiresIn: JWT_CONFIG.EXPIRES_IN.REFRESH_TOKEN,
      secretKey: options.refreshSecretKey || JWT_CONFIG.SECRET_KEY
    });

    if (!refreshTokenResult.success) {
      return {
        success: false,
        error: 'Failed to generate refresh token',
        details: refreshTokenResult.error
      };
    }

    console.log('🎫 Token pair generated for user:', userPayload.userId || userPayload.sub);

    return {
      success: true,
      tokens: {
        accessToken: accessTokenResult.token,
        refreshToken: refreshTokenResult.token,
        tokenType: 'Bearer',
        accessTokenExpiresIn: JWT_CONFIG.EXPIRES_IN.ACCESS_TOKEN,
        refreshTokenExpiresIn: JWT_CONFIG.EXPIRES_IN.REFRESH_TOKEN,
        issuedAt: new Date().toISOString()
      }
    };

  } catch (error) {
    console.error('❌ Token pair generation failed:', error);
    return {
      success: false,
      error: 'Token pair generation failed',
      details: error.message
    };
  }
};

// 토큰 만료 시간 확인
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token);
  
  if (!decoded.success) {
    return {
      success: false,
      error: decoded.error
    };
  }

  const { exp } = decoded.payload;
  
  if (!exp) {
    return {
      success: false,
      error: 'No expiration time in token'
    };
  }

  const expirationDate = new Date(exp * 1000);
  const now = new Date();
  const timeRemaining = expirationDate.getTime() - now.getTime();

  return {
    success: true,
    expirationDate: expirationDate.toISOString(),
    timeRemaining: Math.max(0, timeRemaining),
    isExpired: timeRemaining <= 0,
    willExpireIn: {
      milliseconds: Math.max(0, timeRemaining),
      seconds: Math.max(0, Math.floor(timeRemaining / 1000)),
      minutes: Math.max(0, Math.floor(timeRemaining / (1000 * 60))),
      hours: Math.max(0, Math.floor(timeRemaining / (1000 * 60 * 60)))
    }
  };
};

// JWT 설정 내보내기
export { JWT_CONFIG };

// 디버깅용 함수들
export const debugToken = (token) => {
  const decoded = decodeToken(token);
  const expiration = getTokenExpiration(token);
  
  return {
    decoded,
    expiration,
    verification: verifyToken(token)
  };
};