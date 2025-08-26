import { css } from "styled-components";

const sizes = {
  mobile: 400 /* 375 */, // Mobile max-width
  tablet: 780, // Tablet max-width
  desktopM: 1440, // Desktop Medium max-width
};

// 직접 사용할 수 있는 breakpoint 문자열도 export
export const breakpoints = {
  mobile: "375px",
  tablet: "780px",
  desktopM: "1440px",
};

// Iterate through the sizes and create a media template
// 예: media.tablet`...`
export const media = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (min-width: ${sizes[label]}px) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});

// 최대 너비(max-width) 기반 미디어 쿼리가 필요한 경우를 위한 예시:
export const maxMedia = Object.keys(sizes).reduce((acc, label) => {
  acc[label] = (...args) => css`
    @media (max-width: ${sizes[label] - 1}px) {
      ${css(...args)}
    }
  `;
  return acc;
}, {});
