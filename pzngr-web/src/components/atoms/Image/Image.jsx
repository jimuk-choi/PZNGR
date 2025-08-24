import React from "react";
import { StyledImage } from "./Image.styles.jsx";

const Image = ({ 
  src,
  alt,
  variant = "default",
  size = "auto",
  className = "",
  ...props 
}) => {
  return (
    <StyledImage
      src={src}
      alt={alt}
      $variant={variant}
      $size={size}
      className={className}
      {...props}
    />
  );
};

export default Image;