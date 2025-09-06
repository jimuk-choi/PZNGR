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

export const CartIconWrapper = styled.div`
  position: relative;
  cursor: pointer;
`;

export const CartBadge = styled.div`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: ${({ theme }) => theme.colors.primary || '#000'};
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: bold;
  z-index: 10;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 14px;
  
  .user-name {
    font-weight: 500;
    color: ${({ theme }) => theme.colors.text || '#333'};
  }
  
  .user-status {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary || '#666'};
  }
`;

export const AuthButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  button {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    text-decoration: none;
    transition: all 0.2s ease;
    
    &.login-btn {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.text || '#333'};
      border: 1px solid ${({ theme }) => theme.colors.border || '#ddd'};
      
      &:hover {
        background-color: ${({ theme }) => theme.colors.background || '#f8f9fa'};
      }
    }
    
    &.register-btn {
      background-color: ${({ theme }) => theme.colors.primary || '#000'};
      color: white;
      
      &:hover {
        background-color: ${({ theme }) => theme.colors.primaryDark || '#333'};
      }
    }
    
    &.logout-btn {
      background-color: transparent;
      color: ${({ theme }) => theme.colors.textSecondary || '#666'};
      font-size: 12px;
      padding: 4px 8px;
      
      &:hover {
        color: ${({ theme }) => theme.colors.text || '#333'};
        background-color: ${({ theme }) => theme.colors.background || '#f8f9fa'};
      }
    }
  }
`;
