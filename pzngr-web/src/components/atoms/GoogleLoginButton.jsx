import React from 'react';
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
          ux_mode="redirect"
        />
      </GoogleLoginWrapper>
    </>
  );
};

export default GoogleLoginButton;