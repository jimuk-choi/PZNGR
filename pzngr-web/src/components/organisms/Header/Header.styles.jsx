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
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: "left center right";
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 0 ${({ theme }) => theme.spacing.xxxxxl};

  ${maxMedia.tablet`
    display: flex;
    justify-content: space-between;
    padding: 0 ${({ theme }) => theme.spacing.xxxl};
  `}

  ${maxMedia.mobile`
    padding: 0 ${({ theme }) => theme.spacing.lg};
  `}
`;

export const MenuGroup = styled.div`
  grid-area: left;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxxl};
  justify-self: start;

  ${maxMedia.tablet`
    display: none;
  `}
`;

export const LogoWrapper = styled.div`
  grid-area: center;
  display: flex;
  justify-self: center;
  align-items: center;
`;

export const IconGroup = styled.div`
  grid-area: right;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-self: end;

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
