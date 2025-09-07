import React from "react";
import { StyledButton } from "./Button.styles.jsx";

const Button = ({ 
  children, 
  state = "default",
  variant,
  size,
  type,
  disabled,
  onClick, 
  className = "",
  ...props 
}) => {
  return (
    <StyledButton
      $state={state}
      $variant={variant}
      $size={size}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
      {...props}
    >
      {variant ? (
        children
      ) : (
        <>
          <span className="button-text">{children}</span>
          <div className="underline" />
        </>
      )}
    </StyledButton>
  );
};

export default Button;