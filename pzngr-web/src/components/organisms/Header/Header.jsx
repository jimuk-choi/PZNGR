import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon.jsx";
import Logo from "../../molecules/Logo/Logo.jsx";
import MenuItem from "../../molecules/MenuItem/MenuItem.jsx";
import MobileMenu from "../MobileMenu/MobileMenu.jsx";
import { useCartStore } from "../../../stores/cartStore.js";
import {
  StyledHeader,
  HeaderWrapper,
  MenuGroup,
  LogoWrapper,
  IconGroup,
  HamburgerMenu,
  CartIconWrapper,
  CartBadge,
} from "./Header.styles.jsx";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalCount } = useCartStore();

  const handleMobileMenuOpen = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleUserClick = () => {
    navigate("/my-page");
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  return (
    <>
      <StyledHeader>
        <HeaderWrapper>
          <MenuGroup>
            <MenuItem to="/shop">SHOP</MenuItem>
            <MenuItem to="/customer-service">고객센터</MenuItem>
          </MenuGroup>

          <LogoWrapper>
            <Logo />
          </LogoWrapper>

          <IconGroup>
            <Icon
              name="person"
              size="xLarge"
              clickable
              onClick={handleUserClick}
            />
            <CartIconWrapper onClick={handleCartClick}>
              <Icon
                name="shopping_basket"
                size="xLarge"
                clickable
                onClick={handleCartClick}
              />
              {totalCount > 0 && (
                <CartBadge>{totalCount > 99 ? "99+" : totalCount}</CartBadge>
              )}
            </CartIconWrapper>
          </IconGroup>

          <HamburgerMenu onClick={handleMobileMenuOpen}>
            <Icon name="menu" size="large" clickable />
          </HamburgerMenu>
        </HeaderWrapper>
      </StyledHeader>

      <MobileMenu isOpen={isMobileMenuOpen} onClose={handleMobileMenuClose} />
    </>
  );
};

Header.displayName = "Header";

export default Header;
