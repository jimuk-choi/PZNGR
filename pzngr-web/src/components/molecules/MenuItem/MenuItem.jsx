import React from "react";
import Text from "../../atoms/Text/Text.jsx";
import Container from "../../atoms/Container/Container.jsx";
import { StyledNavLink } from "./MenuItem.styles.jsx";

const MenuItem = ({ 
  to,
  children,
  className = "",
  ...props 
}) => {
  return (
    <Container
      className={className}
      {...props}
    >
      <StyledNavLink to={to}>
        <Text variant="menu" size="lg" weight="normal">
          {children}
        </Text>
      </StyledNavLink>
    </Container>
  );
};

export default MenuItem;