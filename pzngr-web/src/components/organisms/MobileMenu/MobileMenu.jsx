import React from "react";
import { useNavigate } from "react-router-dom";
import Icon from "../../atoms/Icon/Icon.jsx";
import {
  MobileMenuOverlay,
  MobileMenuContainer,
  CloseButton,
  MenuList,
  MenuItem,
  MenuText,
  MenuUnderline,
} from "./MobileMenu.styles.jsx";

const MobileMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleMenuClick = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <MobileMenuOverlay>
      <MobileMenuContainer>
        <CloseButton onClick={onClose}>
          <Icon name="close" size="large" />
        </CloseButton>

        <MenuList>
          <MenuItem onClick={() => handleMenuClick("/shop")}>
            <MenuText>SHOP</MenuText>
            <MenuUnderline />
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick("/customer-service")}>
            <MenuText>고객센터</MenuText>
            <MenuUnderline />
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick("/cart")}>
            <MenuText>장바구니</MenuText>
            <MenuUnderline />
          </MenuItem>

          <MenuItem onClick={() => handleMenuClick("/my-page")}>
            <MenuText>My Page</MenuText>
            <MenuUnderline />
          </MenuItem>
        </MenuList>
      </MobileMenuContainer>
    </MobileMenuOverlay>
  );
};

export default MobileMenu;