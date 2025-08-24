import React from "react";
import { StyledIcon, IconWrapper } from "./Icon.styles.jsx";

const Icon = ({ 
  name,
  size = "medium",
  color = "black",
  clickable = false,
  onClick,
  className = "",
  ...props 
}) => {
  if (clickable) {
    return (
      <IconWrapper
        $size={size}
        onClick={onClick}
        className={className}
        {...props}
      >
        <StyledIcon 
          className="material-symbols-outlined"
          $size={size}
          $color={color}
        >
          {name}
        </StyledIcon>
      </IconWrapper>
    );
  }

  return (
    <StyledIcon 
      className="material-symbols-outlined"
      $size={size}
      $color={color}
      {...props}
    >
      {name}
    </StyledIcon>
  );
};

export default Icon;