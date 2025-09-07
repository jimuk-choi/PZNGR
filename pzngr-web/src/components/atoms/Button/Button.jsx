import React from "react";
import { StyledButton } from "./Button.styles.jsx";

const Button = ({ 
  children, 
  state = "default", 
  onClick, 
  className = "",
  ...props 
}) => {
  return (
    <StyledButton
      $state={state}
      onClick={onClick}
      className={className}
      {...props}
    >
      <span className="button-text">{children}</span>
      <div className="underline" />
    </StyledButton>
  );
};

export default Button;