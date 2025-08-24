import styled from "styled-components";
import { maxMedia } from "../../../shared/styles";

export const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.white};
  width: 100%;
  height: ${({ theme }) => theme.sizes.header.height};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.xxxxxl};
  height: 100%;
  position: relative;

  ${maxMedia.tablet`
    padding: 0 ${({ theme }) => theme.spacing.xxxl};
  `}

  ${maxMedia.mobile`
    padding: 0 ${({ theme }) => theme.spacing.lg};
  `}
`;

export const MenuGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxxl};

  ${maxMedia.tablet`
    display: none;
  `}
`;

export const LogoWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;

  ${maxMedia.tablet`
    position: static;
    transform: none;
    z-index: auto;
  `}
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0;

  ${maxMedia.tablet`
    display: none;
  `}
`;

export const HamburgerMenu = styled.div`
  display: none;
  
  ${maxMedia.tablet`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    cursor: pointer;
  `}
`;