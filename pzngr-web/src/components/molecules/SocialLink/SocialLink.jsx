import React from "react";
import Image from "../../atoms/Image/Image.jsx";
import Container from "../../atoms/Container/Container.jsx";

const SocialLink = ({ 
  href,
  icon,
  alt,
  className = "",
  ...props 
}) => {
  return (
    <Container
      as="a"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      <Image 
        src={icon} 
        alt={alt} 
        variant="icon"
      />
    </Container>
  );
};

export default SocialLink;