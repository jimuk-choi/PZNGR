import React from "react";
import { StyledContainer } from "./Container.styles.jsx";

const Container = ({ 
  children,
  variant = "default",
  direction = "column",
  align = "flex-start",
  justify = "flex-start",
  gap = "md",
  padding = "none",
  className = "",
  as = "div",
  ...props 
}) => {
  return (
    <StyledContainer
      as={as}
      $variant={variant}
      $direction={direction}
      $align={align}
      $justify={justify}
      $gap={gap}
      $padding={padding}
      className={className}
      {...props}
    >
      {children}
    </StyledContainer>
  );
};

export default Container;