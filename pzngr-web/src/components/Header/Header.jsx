import React from "react";
import { NavLink } from "react-router-dom";
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
  NavLinkStyle,
} from "./styles.jsx";

const Header = () => {
  return (
    <HeaderContainer>
      <HeaderWrapper>
        {/* Left Menu */}
        <MenuBox>
          <MenuItem>
            <NavLinkStyle to="/shop">
              <MenuText>SHOP</MenuText>
            </NavLinkStyle>
          </MenuItem>
          <MenuItem>
            <NavLinkStyle to="/customer-service">
              <MenuText>고객센터</MenuText>
            </NavLinkStyle>
          </MenuItem>
        </MenuBox>

        {/* Logo - Centered */}
        <LogoBox>
          <NavLinkStyle to="/">
            <LogoImage src={Logo01} alt="PZNGR Logo" />
          </NavLinkStyle>
        </LogoBox>

        {/* Right Menu - Action Icons */}
        <MenuBox>
          {/* <IconItem>
            <Icon className="material-symbols-outlined">search</Icon>
          </IconItem> */}
          <IconItem>
            <Icon className="material-symbols-outlined">person</Icon>
          </IconItem>
          <IconItem>
            <Icon className="material-symbols-outlined">shopping_basket</Icon>
          </IconItem>
          {/* <IconItem>
            <Icon className="material-symbols-outlined">menu</Icon>
          </IconItem> */}
        </MenuBox>
      </HeaderWrapper>
    </HeaderContainer>
  );
};

export default Header;
