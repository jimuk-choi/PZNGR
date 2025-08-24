import React from "react";
import Text from "../../atoms/Text/Text.jsx";
import Container from "../../atoms/Container/Container.jsx";

const InfoItem = ({ 
  label,
  value,
  direction = "column",
  className = "",
  children,
  isLongText = false,
  ...props 
}) => {
  if (children) {
    return (
      <Container
        direction={direction}
        align="flex-start"
        gap="xs"
        className={className}
        data-long-text={isLongText}
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
      data-long-text={isLongText}
      style={isLongText ? { 
        width: '100%', 
        minWidth: 0,
        wordWrap: 'break-word',
        overflowWrap: 'break-word'
      } : {}}
      {...props}
    >
      <Text variant="info-label" size="sm" weight="semibold">
        {label}
      </Text>
      <Text 
        size="sm" 
        color="black"
        style={isLongText ? {
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
          lineHeight: '1.4'
        } : {}}
      >
        {value}
      </Text>
    </Container>
  );
};

export default InfoItem;