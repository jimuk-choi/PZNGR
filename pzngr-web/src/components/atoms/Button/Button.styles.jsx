import styled from "styled-components";

export const StyledButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;

  .button-text {
    font-family: ${({ theme }) => theme.fonts.primary};
    font-weight: ${({ theme }) => theme.fontWeights.normal};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.black};
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
      background-color: ${({ theme }) => theme.colors.black || '#000'};
      opacity: ${props => props.$state === "hovered" ? 1 : 0};
      transition: opacity ${({ theme }) => theme.transitions.fast || '0.3s ease'};
    }
  }

  &:hover {
    .underline::after {
      opacity: 1;
    }
  }

  ${props => props.$state === "hovered" && `
    .underline::after {
      opacity: 1;
    }
  `}
`;