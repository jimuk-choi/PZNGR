import styled, { css } from "styled-components";
import { NavLink } from "react-router-dom";
import { media, maxMedia } from "../../styles/breakpoints.jsx";

export const HeaderContainer = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  /* max-width: 1200px; */
  padding: 0 96px; /* Figma: px-24 -> 96px */
  height: 100%;
  position: relative;

  ${maxMedia.tablet`
    padding: 0 20px;
  `}

  ${maxMedia.mobile`
    padding: 0 16px;
  `}
`;

export const MenuBox = styled.div`
  display: flex;
  align-items: center;
  gap: 32px; /* Figma: gap-8 -> 32px */
`;

export const MenuItem = styled.div`
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover p {
    color: #666666;
  }
`;

export const MenuText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 18px; /* Figma: text-[18px] */
  color: #000000;
  margin: 0;
  white-space: nowrap;

  ${maxMedia.tablet`
    font-size: 16px;
  `}

  ${maxMedia.mobile`
    font-size: 14px;
  `}
`;

export const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

export const LogoImage = styled.img`
  height: 55px; /* Figma: h-14 -> 56px, image 2 is 55px */
  width: 200px; /* Figma: w-[200px] */
  object-fit: contain;
  object-position: center;
  display: block;

  ${maxMedia.tablet`
    height: 45px;
  `}

  ${maxMedia.mobile`
    height: 40px;
  `}
`;

export const IconItem = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    /* transform: scale(1.1); */
  }

  ${maxMedia.tablet`
    width: 36px;
    height: 36px;
  `}

  ${maxMedia.mobile`
    width: 32px;
    height: 32px;
  `}
`;

export const Icon = styled.span`
  font-size: 24px; /* Figma: size-10 -> 40px, but icon size is 24px default */
  color: #000000;
  font-weight: 200;

  ${maxMedia.tablet`
    font-size: 20px;
  `}

  ${maxMedia.mobile`
    font-size: 18px;
  `}
`;

export const LinkStyle = styled.a`
  text-decoration: none;
  color: inherit;

  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
    color: inherit;
  }
`;

export const NavLinkStyle = styled(NavLink)`
  text-decoration: none;
  color: inherit;

  &.active {
    color: inherit;
  }

  &:active,
  &:focus,
  &:visited {
    text-decoration: none;
    color: inherit;
  }
`;
