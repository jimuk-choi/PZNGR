import React from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import Button from "../../components/atoms/Button/Button.jsx";
import { useCartStore } from "../../stores/cartStore.js";
import {
  CartContainer,
  CartTitle,
  EmptyCartMessage,
  CartItemsContainer,
  CartItem,
  CartItemImage,
  CartItemInfo,
  CartItemName,
  CartItemPrice,
  CartItemOptions,
  CartItemQuantity,
  CartItemActions,
  QuantityButton,
  RemoveButton,
  CartSummary,
  CartTotal,
  CheckoutButton,
} from "./Cart.styles.jsx";

const Cart = () => {
  const {
    items,
    totalCount,
    isEmpty,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getFormattedTotalPrice,
    getItemDisplayName,
    getFormattedItemPrice,
    clearCart,
  } = useCartStore();

  const handleQuantityIncrease = (itemId) => {
    increaseQuantity(itemId);
  };

  const handleQuantityDecrease = (itemId) => {
    decreaseQuantity(itemId);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCheckout = () => {
    // 주문 페이지로 이동하는 로직 추가 예정
    console.log('주문하기 클릭됨');
    alert('주문 기능은 추후 구현 예정입니다.');
  };

  const handleClearCart = () => {
    if (window.confirm('장바구니를 비우시겠습니까?')) {
      clearCart();
    }
  };

  return (
    <PageTemplate>
      <Container>
        <CartContainer>
          <CartTitle>
            <Text size="xxl" weight="semibold">
              장바구니 ({totalCount})
            </Text>
            {!isEmpty() && (
              <Button variant="outlined" size="small" onClick={handleClearCart}>
                전체 삭제
              </Button>
            )}
          </CartTitle>
          
          {isEmpty() ? (
            <EmptyCartMessage>
              <Text size="md" color="gray">
                장바구니가 비어있습니다.
              </Text>
            </EmptyCartMessage>
          ) : (
            <>
              <CartItemsContainer>
                {items.map((item) => (
                  <CartItem key={item.id}>
                    <CartItemImage>
                      <img src={item.image} alt={item.name} />
                    </CartItemImage>
                    
                    <CartItemInfo>
                      <CartItemName>
                        <Text size="md" weight="medium">
                          {getItemDisplayName(item)}
                        </Text>
                      </CartItemName>
                      
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <CartItemOptions>
                          {item.selectedOptions.map((option, index) => (
                            <Text key={index} size="sm" color="gray">
                              {option.optionName || option.optionValue}
                              {option.additionalPrice > 0 && ` (+${option.additionalPrice.toLocaleString()}원)`}
                            </Text>
                          ))}
                        </CartItemOptions>
                      )}
                      
                      <CartItemPrice>
                        <Text size="md" weight="semibold">
                          {getFormattedItemPrice(item)}
                        </Text>
                      </CartItemPrice>
                    </CartItemInfo>
                    
                    <CartItemActions>
                      <CartItemQuantity>
                        <QuantityButton onClick={() => handleQuantityDecrease(item.id)}>
                          -
                        </QuantityButton>
                        <span>{item.quantity}</span>
                        <QuantityButton onClick={() => handleQuantityIncrease(item.id)}>
                          +
                        </QuantityButton>
                      </CartItemQuantity>
                      
                      <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                        삭제
                      </RemoveButton>
                    </CartItemActions>
                  </CartItem>
                ))}
              </CartItemsContainer>
              
              <CartSummary>
                <CartTotal>
                  <Text size="lg" weight="semibold">
                    총 결제금액: {getFormattedTotalPrice()}
                  </Text>
                </CartTotal>
                
                <CheckoutButton>
                  <Button variant="primary" size="large" onClick={handleCheckout}>
                    주문하기
                  </Button>
                </CheckoutButton>
              </CartSummary>
            </>
          )}
        </CartContainer>
      </Container>
    </PageTemplate>
  );
};

export default Cart;