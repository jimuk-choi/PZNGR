import React, { useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import styled from 'styled-components';

const GoogleLoginWrapper = styled.div`
  width: 100%;
  margin: 1rem 0;
  
  .google-login-button {
    width: 100% !important;
    height: 48px !important;
    border-radius: 4px !important;
    font-size: 16px !important;
  }
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

const GoogleLoginButton = ({ onSuccess, onError, showDivider = true }) => {
  useEffect(() => {
    // COOP 정책 우회를 위한 설정
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID || "626950598844-qhf3a0i33c6jbfuhpdkrq2ltuuaoblej.apps.googleusercontent.com",
        callback: onSuccess,
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: false,
        // COOP 정책 관련 설정
        itp_support: true,
        state_cookie_domain: window.location.hostname
      });
    }
  }, [onSuccess]);

  return (
    <>
      {showDivider && <OrDivider>또는</OrDivider>}
      <GoogleLoginWrapper>
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          useOneTap={false}
          auto_select={false}
          theme="outline"
          size="large"
          width="100%"
          text="signin_with"
          shape="rectangular"
          logo_alignment="left"
          context="signin"
          ux_mode="popup"
          cancel_on_tap_outside={true}
          use_fedcm_for_prompt={false}
          itp_support={true}
        />
      </GoogleLoginWrapper>
    </>
  );
};

export default GoogleLoginButton;