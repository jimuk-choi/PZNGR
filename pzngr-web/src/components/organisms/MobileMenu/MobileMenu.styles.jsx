import styled from "styled-components";

export const MobileMenuOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MobileMenuContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xxxxl} ${({ theme }) => theme.spacing.xxxl};
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.sm};
  
  &:hover {
    opacity: 0.7;
  }
`;

export const MenuList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 69px;
  width: 100%;
`;

export const MenuUnderline = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.black};
  opacity: 0;
  transform: scaleX(0);
  transition: ${({ theme }) => theme.transitions.fast};
  transform-origin: center;
`;

export const MenuItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  position: relative;
  
  &:hover {
    opacity: 0.7;
  }

  &:hover ${MenuUnderline} {
    opacity: 1;
    transform: scaleX(1);
  }
`;

export const MenuText = styled.span`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.normal};
  color: ${({ theme }) => theme.colors.black};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;