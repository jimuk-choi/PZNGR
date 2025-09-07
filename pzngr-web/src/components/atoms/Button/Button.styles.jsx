import styled from "styled-components";

const getVariantStyles = (variant) => {
  switch (variant) {
    case 'primary':
      return `
        background: #007bff;
        color: white;
        border: 2px solid #007bff;
        &:hover {
          background: #0056b3;
          border-color: #0056b3;
        }
      `;
    case 'outlined':
    case 'outline':
      return `
        background: transparent;
        color: #007bff;
        border: 2px solid #007bff;
        &:hover {
          background: #007bff;
          color: white;
        }
      `;
    case 'secondary':
      return `
        background: #6c757d;
        color: white;
        border: 2px solid #6c757d;
        &:hover {
          background: #5a6268;
          border-color: #5a6268;
        }
      `;
    default:
      return `
        background: none;
        border: none;
        color: ${({ theme }) => theme?.colors?.black || '#000'};
      `;
  }
};

const getSizeStyles = (size) => {
  switch (size) {
    case 'small':
      return `
        padding: 8px 16px;
        font-size: 14px;
      `;
    case 'large':
      return `
        padding: 16px 32px;
        font-size: 18px;
      `;
    default:
      return `
        padding: 12px 24px;
        font-size: 16px;
      `;
  }
};

export const StyledButton = styled.button`
  display: ${props => props.$variant ? 'inline-block' : 'flex'};
  flex-direction: ${props => props.$variant ? 'row' : 'column'};
  align-items: ${props => props.$variant ? 'center' : 'flex-start'};
  justify-content: center;
  gap: ${({ theme }) => theme?.spacing?.xs || '8px'};
  cursor: pointer;
  position: relative;
  border-radius: 4px;
  font-family: ${({ theme }) => theme?.fonts?.primary || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
  font-weight: ${({ theme }) => theme?.fontWeights?.normal || '400'};
  transition: all 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  
  ${props => getVariantStyles(props.$variant)}
  ${props => getSizeStyles(props.$size)}

  ${props => !props.$variant && `
    background: none;
    border: none;
    padding: 0;
    
    .button-text {
      font-family: ${props.theme?.fonts?.primary || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'};
      font-weight: ${props.theme?.fontWeights?.normal || '400'};
      font-size: ${props.theme?.fontSizes?.lg || '18px'};
      color: ${props.theme?.colors?.black || '#000'};
      white-space: nowrap;
      line-height: normal;
    }

    .underline {
      width: 100%;
      height: 1px;
      position: relative;
      
      &::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: ${props.theme?.colors?.black || '#000'};
        opacity: ${props.$state === "hovered" ? 1 : 0};
        transition: opacity ${props.theme?.transitions?.fast || '0.3s ease'};
      }
    }

    &:hover {
      .underline::after {
        opacity: 1;
      }
    }

    ${props.$state === "hovered" && `
      .underline::after {
        opacity: 1;
      }
    `}
  `}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    
    &:hover {
      background: ${props => props.$variant === 'primary' ? '#007bff' : 
                           props.$variant === 'secondary' ? '#6c757d' : 
                           'transparent'};
    }
  }
`;