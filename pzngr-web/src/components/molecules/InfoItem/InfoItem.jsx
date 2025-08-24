import React from "react";
import Text from "../../atoms/Text/Text.jsx";
import Container from "../../atoms/Container/Container.jsx";

const InfoItem = ({ 
  label,
  value,
  direction = "column",
  className = "",
  children,
  ...props 
}) => {
  if (children) {
    return (
      <Container
        direction={direction}
        align="flex-start"
        gap="xs"
        className={className}
        {...props}
      >
        {children}
      </Container>
    );
  }

  return (
    <Container
      direction={direction}
      align="flex-start"
      gap="xs"
      className={className}
      {...props}
    >
      <Text variant="info-label" size="sm" weight="semibold">
        {label}
      </Text>
      <Text size="sm" color="black">
        {value}
      </Text>
    </Container>
  );
};

export default InfoItem;