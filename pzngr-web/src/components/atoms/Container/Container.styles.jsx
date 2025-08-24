import styled, { css } from "styled-components";

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  align-items: ${({ $align }) => $align};
  justify-content: ${({ $justify }) => $justify};
  gap: ${({ $gap, theme }) => theme.spacing[$gap] || theme.spacing.md};
  
  ${({ $padding, theme }) => $padding !== "none" && css`
    padding: ${theme.spacing[$padding] || theme.spacing.md};
  `}

  ${({ $variant }) => $variant === "flex-row" && css`
    flex-direction: row;
    align-items: center;
  `}

  ${({ $variant }) => $variant === "flex-wrap" && css`
    flex-wrap: wrap;
  `}

  ${({ $variant }) => $variant === "center" && css`
    align-items: center;
    justify-content: center;
  `}

  ${({ $variant }) => $variant === "space-between" && css`
    justify-content: space-between;
  `}

  ${({ $variant }) => $variant === "full-width" && css`
    width: 100%;
  `}
`;