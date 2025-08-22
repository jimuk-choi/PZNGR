import React from "react";
import styled from "styled-components";
import Logo01 from "../assets/images/Logo_01.jpg";

const HeaderContainer = styled.div`
  background-color: #ffffff;
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0 64px;
  height: 100%;
  position: relative;

  @media (max-width: 768px) {
    padding: 0 20px;
  }

  @media (max-width: 480px) {
    padding: 0 16px;
  }
`;

const MenuBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover p {
    color: #666666;
  }
`;

const MenuText = styled.p`
  font-family: "Pretendard", sans-serif;
  font-size: 18px;
  color: #000000;
  margin: 0;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const LogoBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
`;

const LogoImage = styled.img`
  height: 51px;
  width: auto;
  object-fit: contain;
  display: block;

  @media (max-width: 768px) {
    height: 45px;
  }

  @media (max-width: 480px) {
    height: 40px;
  }
`;

const IconItem = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
  }

  @media (max-width: 480px) {
    width: 32px;
    height: 32px;
  }
`;

const Icon = styled.span`
  font-size: 24px;
  color: #000000;
  font-weight: 200;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderWrapper>
        {/* Left Menu */}
        <MenuBox>
          <MenuItem>
            <MenuText>SHOP</MenuText>
          </MenuItem>
          <MenuItem>
            <MenuText>고객센터</MenuText>
          </MenuItem>
        </MenuBox>

        {/* Logo - Centered */}
        <LogoBox>
          <LogoImage src={Logo01} alt="PZNGR Logo" />
        </LogoBox>

        {/* Right Menu - Action Icons */}
        <MenuBox>
          <IconItem>
            <Icon className="material-symbols-outlined">search</Icon>
          </IconItem>
          <IconItem>
            <Icon className="material-symbols-outlined">person</Icon>
          </IconItem>
          <IconItem>
            <Icon className="material-symbols-outlined">shopping_basket</Icon>
          </IconItem>
          <IconItem>
            <Icon className="material-symbols-outlined">menu</Icon>
          </IconItem>
        </MenuBox>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

export default Header;
