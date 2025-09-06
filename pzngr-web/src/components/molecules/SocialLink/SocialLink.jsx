import React from "react";
import Container from "../../atoms/Container/Container.jsx";

const SocialLink = ({ 
  href,
  icon: IconComponent,
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
      {IconComponent && <IconComponent alt={alt} width="20" height="20" />}
    </Container>
  );
};

export default SocialLink;