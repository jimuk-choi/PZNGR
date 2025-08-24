import React from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import {
  CartContainer,
  CartTitle,
  EmptyCartMessage,
} from "./Cart.styles.jsx";

const Cart = () => {
  return (
    <PageTemplate>
      <Container>
        <CartContainer>
          <CartTitle>
            <Text size="xxl" weight="semibold">
              장바구니
            </Text>
          </CartTitle>
          
          <EmptyCartMessage>
            <Text size="md" color="gray">
              장바구니가 비어있습니다.
            </Text>
          </EmptyCartMessage>
        </CartContainer>
      </Container>
    </PageTemplate>
  );
};

export default Cart;