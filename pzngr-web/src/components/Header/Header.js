import React from "react";
import Logo01 from "../../assets/images/Logo_01.jpg";
import {
  HeaderContainer,
  HeaderWrapper,
  MenuBox,
  MenuItem,
  MenuText,
  LogoBox,
  LogoImage,
  IconItem,
  Icon,
} from "./styles";

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
