import React from "react";
import Image from "../../atoms/Image/Image.jsx";
import Container from "../../atoms/Container/Container.jsx";
import { StyledNavLink } from "./Logo.styles.jsx";
import { Logo01 } from "../../../shared/assets";

const Logo = ({ 
  to = "/",
  className = "",
  ...props 
}) => {
  return (
    <Container
      variant="center"
      className={className}
      {...props}
    >
      <StyledNavLink to={to}>
        <Image 
          src={Logo01} 
          alt="PZNGR Logo" 
          variant="logo"
        />
      </StyledNavLink>
    </Container>
  );
};

export default Logo;