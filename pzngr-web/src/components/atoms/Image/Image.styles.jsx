import styled, { css } from "styled-components";
import { maxMedia } from "../../../shared/styles";

export const StyledImage = styled.img`
  object-fit: contain;
  object-position: center;
  display: block;

  ${({ $variant, theme }) => $variant === "logo" && css`
    height: ${theme.sizes.logo.desktop.height};
    width: ${theme.sizes.logo.desktop.width};

    ${maxMedia.tablet`
      height: ${theme.sizes.logo.tablet.height};
      width: ${theme.sizes.logo.tablet.width};
    `}

    ${maxMedia.mobile`
      height: ${theme.sizes.logo.mobile.height};
      width: ${theme.sizes.logo.mobile.width};
    `}
  `}

  ${({ $variant }) => $variant === "icon" && css`
    width: 20px;
    height: 20px;
  `}

  ${({ $size }) => $size === "full" && css`
    width: 100%;
    height: 100%;
  `}

  ${({ $size }) => $size === "auto" && css`
    max-width: 100%;
    height: auto;
  `}
`;