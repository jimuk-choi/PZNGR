import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon.jsx";
import Logo from "../../molecules/Logo/Logo.jsx";
import MenuItem from "../../molecules/MenuItem/MenuItem.jsx";
import MobileMenu from "../MobileMenu/MobileMenu.jsx";
import { useCartStore } from "../../../stores/cartStore.js";
import { useUserStore } from "../../../stores/userStore.js";
import {
  StyledHeader,
  HeaderWrapper,
  MenuGroup,
  LogoWrapper,
  IconGroup,
  HamburgerMenu,
  CartIconWrapper,
  CartBadge,
  UserSection,
  UserInfo,
  AuthButtons,
} from "./Header.styles.jsx";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { totalCount } = useCartStore();
  const { isAuthenticated, logout, user, isAdmin } = useUserStore();

  const handleMobileMenuOpen = () => {
    setIsMobileMenuOpen(true);
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  const handleUserClick = () => {
    if (isAuthenticated()) {
      navigate("/my-page");
    } else {
      navigate("/login");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
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
            {isAuthenticated() && isAdmin() && (
              <MenuItem to="/admin/products">관리자</MenuItem>
            )}
          </MenuGroup>

          <LogoWrapper>
            <Logo />
          </LogoWrapper>

          <IconGroup>
            {isAuthenticated() ? (
              <UserSection>
                <UserInfo>
                  <div className="user-name">{user?.name || "Unknown"}</div>
                  <div className="user-status">로그인됨</div>
                </UserInfo>
                <Icon
                  name="person"
                  size="xLarge"
                  clickable
                  onClick={handleUserClick}
                />
                <AuthButtons>
                  <button className="logout-btn" onClick={handleLogout}>
                    로그아웃
                  </button>
                </AuthButtons>
              </UserSection>
            ) : (
              <UserSection>
                <AuthButtons>
                  <button
                    className="login-btn"
                    onClick={() => navigate("/login")}
                  >
                    로그인
                  </button>
                  <button
                    className="register-btn"
                    onClick={() => navigate("/register")}
                  >
                    회원가입
                  </button>
                </AuthButtons>
                <Icon
                  name="person"
                  size="xLarge"
                  clickable
                  onClick={handleUserClick}
                />
              </UserSection>
            )}

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
