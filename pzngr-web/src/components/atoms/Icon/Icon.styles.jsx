import styled from "styled-components";
import { maxMedia } from "../../../shared/styles";

const getColorValue = (color, theme) => {
  if (color === "primary") return theme.colors.primary;
  if (color === "gray") return theme.colors.gray.light;
  if (color === "white") return theme.colors.white;
  return theme.colors.black;
};

export const StyledIcon = styled.span`
  font-size: ${({ $size, theme }) =>
    theme.sizes.icon[$size] || theme.sizes.icon.medium};
  color: ${({ $color, theme }) => getColorValue($color, theme)};
  font-weight: 200;
  display: flex;
  align-items: center;
  justify-content: center;

  ${maxMedia.tablet`
    font-size: ${({ $size, theme }) =>
      $size === "large" ? theme.sizes.icon.xLarge : theme.sizes.icon.small};
  `}

  ${maxMedia.mobile`
    font-size: ${({ theme }) => theme.sizes.icon.xLarge};
  `}
`;

export const IconWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform ${({ theme }) => theme.transitions.fast};

  /* &:hover {
    transform: scale(1.1);
  } */

  ${maxMedia.tablet`
    width: 36px;
    height: 36px;
  `}

  ${maxMedia.mobile`
    width: 32px;
    height: 32px;
  `}
`;
