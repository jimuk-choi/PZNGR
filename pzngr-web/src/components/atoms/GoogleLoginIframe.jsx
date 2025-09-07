import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const GoogleLoginWrapper = styled.div`
  width: 100%;
  margin: 1rem 0;
`;

const GoogleButton = styled.button`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: white;
  border: 2px solid #dadce0;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  color: #3c4043;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    border-color: #c4c7c5;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const GoogleIcon = styled.div`
  width: 20px;
  height: 20px;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOCAxOCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHN0eWxlPi5zdDB7ZmlsbDojNDI4NUY0O30uc3Qxe2ZpbGw6IzM0QTg1Mzt9LnN0MntmaWxsOiNGQkJDMDQ7fS5zdDN7ZmlsbDojRUE0MzM1O308L3N0eWxlPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMTgsOWMwLTAuNTUtMC4wNS0xLjEtMC4xNC0xLjYzSDkuMTV2My4wOGg0Ljk1Yy0wLjIxLDEuMTUtMC44NiwyLjEzLTEuODMsMi43OHYyLjI4aDIuOTZDMTYuODQsMTMuNTQsMTgsMTEuNTIsMTgsOUwxOCw5eiIvPgo8cGF0aCBjbGFzcz0ic3QxIiBkPSJNOS4xNSwxOGMxLjY3LDAsMy4wNy0wLjU1LDQuMS0xLjVsLTIuOTYtMi4yOGMtMC41NiwwLjM4LTEuMjgsMC41OS0yLjE0LDAuNTljLTEuNjUsMC0zLjA0LTEuMTEtMy41NC0yLjYxSDEuMzF2Mi4zNUM0LjY1LDE2LjMzLDcuNjksMTgsOS4xNSwxOEw5LjE1LDE4eiIvPgo8cGF0aCBjbGFzcz0ic3QyIiBkPSJNNS42MSw2LjM5Yy0wLjEzLTAuMzgtMC4xMy0wLjc5LDAtMS4xN1Y2SDIuMjlDMS4wMyw4LjIyLDEuMDMsOS43OCwyLjI5LDExLjgzbDMuMzItMi40NGwtMC44LTIuMjhDNS42MSw5LjM5LDUuNjEsNi4zOSw1LjYxLDYuMzlMNS42MSw2LjM5eiIvPgo8cGF0aCBjbGFzcz0ic3QzIiBkPSJNOS4xNSw3LjA0YzAuOTMsMCwxLjc2LDAuMzIsMi40MiwwLjk1bDEuODEtMS44MUMxMi4yMiw1LjI2LDEwLjgxLDQuNjksOS4xNSw0LjY5Yy0yLjQ3LDAtNC41LDEuNy01LjI5LDMuOThsMy4zMywyLjU4QzcsOS4xNCw3Ljc5LDcuMDQsOS4xNSw3LjA0eiIvPgo8L3N2Zz4K');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
`;

const HiddenIframe = styled.iframe`
  position: absolute;
  width: 1px;
  height: 1px;
  left: -9999px;
  opacity: 0;
  pointer-events: none;
`;

const OrDivider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  color: #666;
  font-size: 14px;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #ddd;
  }
  
  &::before {
    margin-right: 1rem;
  }
  
  &::after {
    margin-left: 1rem;
  }
`;

const GoogleLoginIframe = ({ onSuccess, onError, showDivider = true }) => {
  const iframeRef = useRef(null);
  
  useEffect(() => {
    // 메시지 리스너 설정
    const handleMessage = (event) => {
      // Google OAuth 메시지만 처리
      if (event.origin !== 'https://accounts.google.com') {
        return;
      }
      
      try {
        if (event.data && event.data.credential) {
          // Google OAuth 성공
          onSuccess(event.data);
        } else if (event.data && event.data.error) {
          // Google OAuth 에러
          onError(event.data.error);
        }
      } catch (error) {
        console.error('Google OAuth message processing error:', error);
        onError && onError(error);
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSuccess, onError]);
  
  const handleGoogleLogin = () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "626950598844-qhf3a0i33c6jbfuhpdkrq2ltuuaoblej.apps.googleusercontent.com";
    
    // Google OAuth iframe 방식 설정
    const googleScript = document.createElement('script');
    googleScript.src = 'https://accounts.google.com/gsi/client';
    googleScript.async = true;
    googleScript.defer = true;
    
    googleScript.onload = () => {
      if (window.google && window.google.accounts) {
        // iframe 모드로 초기화
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: onSuccess,
          auto_select: false,
          cancel_on_tap_outside: true,
          // iframe 모드 설정
          use_fedcm_for_prompt: false,
          itp_support: true,
          // COOP 우회 설정
          state_cookie_domain: window.location.hostname
        });
        
        // One Tap 대신 renderButton 사용
        window.google.accounts.id.renderButton(
          document.getElementById('google-signin-button'), 
          { 
            theme: 'outline', 
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular'
          }
        );
      }
    };
    
    // 스크립트가 이미 로드되어 있지 않은 경우에만 추가
    if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
      document.head.appendChild(googleScript);
    } else if (window.google && window.google.accounts) {
      // 이미 로드된 경우 직접 실행
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: onSuccess,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false,
        itp_support: true,
        state_cookie_domain: window.location.hostname
      });
      
      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-button'), 
        { 
          theme: 'outline', 
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular'
        }
      );
    }
  };
  
  return (
    <>
      {showDivider && <OrDivider>또는</OrDivider>}
      <GoogleLoginWrapper>
        {/* Google SDK 버튼이 렌더링될 컨테이너 */}
        <div id="google-signin-button" style={{ width: '100%' }}>
          {/* 폴백 버튼 (Google SDK 로드 실패 시) */}
          <GoogleButton onClick={handleGoogleLogin} type="button">
            <GoogleIcon />
            Google로 로그인
          </GoogleButton>
        </div>
        
        {/* 숨겨진 iframe (COOP 우회용) */}
        <HiddenIframe
          ref={iframeRef}
          title="Google OAuth iframe"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </GoogleLoginWrapper>
    </>
  );
};

export default GoogleLoginIframe;