import styled from 'styled-components';

export const StyledAuthPage = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: ${({ theme }) => theme.colors.background || '#f8f9fa'};
`;

export const StyledRegisterPage = styled(StyledAuthPage)``;
export const StyledLoginPage = styled(StyledAuthPage)``;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
  background: white;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormRow = styled.div`
  margin-bottom: 1.5rem;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text || '#333'};
    font-size: 0.875rem;
    
    &:has(input[type="checkbox"]) {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      input {
        width: auto;
        margin-right: 0.5rem;
        margin-bottom: 0;
      }
      
      span {
        font-size: 0.875rem;
      }
    }
  }
  
  input[type="text"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  input[type="date"] {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 1rem;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary || '#007bff'};
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    
    &:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
      opacity: 0.6;
    }
    
    &::placeholder {
      color: #999;
    }
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    margin: 0;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary || '#007bff'};
  }
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '⚠';
    margin-right: 0.25rem;
  }
`;

export const SuccessMessage = styled.div`
  color: #28a745;
  font-size: 0.875rem;
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  background-color: #d4edda;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  
  &::before {
    content: '✓';
    margin-right: 0.5rem;
    font-weight: bold;
  }
`;

export const PasswordStrengthIndicator = styled.div`
  margin-top: 0.5rem;
  font-size: 0.875rem;
  
  .strength-bar {
    height: 4px;
    background-color: #e9ecef;
    border-radius: 2px;
    margin: 0.25rem 0;
    overflow: hidden;
    
    .strength-fill {
      height: 100%;
      transition: width 0.3s ease, background-color 0.3s ease;
      
      &.weak {
        width: 33%;
        background-color: #dc3545;
      }
      
      &.medium {
        width: 66%;
        background-color: #ffc107;
      }
      
      &.strong {
        width: 100%;
        background-color: #28a745;
      }
    }
  }
  
  .strength-text {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    
    &.weak { color: #dc3545; }
    &.medium { color: #ffc107; }
    &.strong { color: #28a745; }
  }
`;

export const AuthHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0 0 0.5rem 0;
    color: ${({ theme }) => theme.colors.text || '#333'};
  }
  
  p {
    margin: 0;
    color: #666;
    font-size: 0.875rem;
  }
`;

export const AuthFooter = styled.div`
  margin-top: 2rem;
  text-align: center;
  
  .divider {
    position: relative;
    margin: 1.5rem 0;
    text-align: center;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background-color: #ddd;
    }
    
    span {
      background-color: white;
      padding: 0 1rem;
      color: #666;
      font-size: 0.875rem;
    }
  }
  
  .auth-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 1rem;
    
    @media (min-width: 480px) {
      flex-direction: row;
      justify-content: center;
      gap: 1rem;
    }
  }
`;

export const SocialLoginSection = styled.div`
  margin-top: 1.5rem;
  
  .social-buttons {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .social-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    background: white;
    color: #333;
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    cursor: pointer;
    
    &:hover {
      background-color: #f8f9fa;
      border-color: #ccc;
    }
    
    &.google {
      border-color: #db4437;
      color: #db4437;
      
      &:hover {
        background-color: #db4437;
        color: white;
      }
    }
    
    &.kakao {
      border-color: #fee500;
      background-color: #fee500;
      color: #3c1e1e;
      
      &:hover {
        background-color: #fdd800;
      }
    }
    
    &.naver {
      border-color: #03c75a;
      background-color: #03c75a;
      color: white;
      
      &:hover {
        background-color: #02b351;
      }
    }
    
    .icon {
      width: 20px;
      height: 20px;
      margin-right: 0.5rem;
    }
  }
`;

export const FormGroup = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text || '#333'};
  font-size: 0.875rem;
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary || '#007bff'};
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: #999;
  }
`;

export const FormButton = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary || '#007bff'};
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.primaryDark || '#0056b3'};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const FormMessage = styled.div`
  margin: 1rem 0;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  
  ${({ type }) => {
    if (type === 'success') {
      return `
        color: #28a745;
        background-color: #d4edda;
        border: 1px solid #c3e6cb;
        
        &::before {
          content: '✓';
          margin-right: 0.5rem;
          font-weight: bold;
        }
      `;
    } else if (type === 'error') {
      return `
        color: #dc3545;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        
        &::before {
          content: '⚠';
          margin-right: 0.5rem;
        }
      `;
    }
    return '';
  }}
`;

export const LinkContainer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  
  span {
    color: #666;
  }
`;

export const FormLink = styled.a`
  color: ${({ theme }) => theme.colors.primary || '#007bff'};
  text-decoration: none;
  font-size: 0.875rem;
  
  &:hover {
    text-decoration: underline;
  }
`;