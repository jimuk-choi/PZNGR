import styled, { css } from "styled-components";

const getColorValue = (color, theme) => {
  if (color === "primary") return theme.colors.primary;
  if (color === "gray") return theme.colors.gray.light;
  if (color === "white") return theme.colors.white;
  return theme.colors.black;
};

export const StyledText = styled.p`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ $size, theme }) =>
    theme.fontSizes[$size] || theme.fontSizes.md};
  font-weight: ${({ $weight, theme }) =>
    theme.fontWeights[$weight] || theme.fontWeights.normal};
  color: ${({ $color, theme }) => getColorValue($color, theme)};
  margin: 0;
  line-height: normal;
  white-space: nowrap;
  text-align: ${({ $align }) => $align || 'left'};

  ${({ $variant }) =>
    $variant === "menu" &&
    css`
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    `}

  ${({ $variant }) =>
    $variant === "link" &&
    css`
      cursor: pointer;
      transition: color 0.2s ease;

      &:hover {
        color: ${({ theme }) => theme.colors.primary};
      }
    `}

  ${({ $variant }) =>
    $variant === "info-label" &&
    css`
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
    `}
`;
