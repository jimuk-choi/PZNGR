import React from "react";
import { StyledText } from "./Text.styles.jsx";

const Text = ({ 
  children, 
  variant = "body",
  size = "md",
  weight = "normal",
  color = "black",
  className = "",
  as = "p",
  ...props 
}) => {
  return (
    <StyledText
      as={as}
      $variant={variant}
      $size={size}
      $weight={weight}
      $color={color}
      className={className}
      {...props}
    >
      {children}
    </StyledText>
  );
};

export default Text;