import React, { useState } from 'react';
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

const GoogleLoginAlternative = ({ onSuccess, onError, showDivider = true }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGoogleLogin = () => {
    setIsLoading(true);
    
    // Direct window.open approach to bypass COOP
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "626950598844-qhf3a0i33c6jbfuhpdkrq2ltuuaoblej.apps.googleusercontent.com";
    const redirectUri = encodeURIComponent(window.location.origin + '/auth/login');
    const scope = encodeURIComponent('openid email profile');
    
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `access_type=offline`;
    
    // Open in same window to avoid COOP issues
    window.location.href = googleAuthUrl;
  };
  
  return (
    <>
      {showDivider && <OrDivider>또는</OrDivider>}
      <GoogleLoginWrapper>
        <GoogleButton 
          onClick={handleGoogleLogin} 
          disabled={isLoading}
          type="button"
        >
          <GoogleIcon />
          {isLoading ? 'Google 로그인 중...' : 'Google로 로그인'}
        </GoogleButton>
      </GoogleLoginWrapper>
    </>
  );
};

export default GoogleLoginAlternative;