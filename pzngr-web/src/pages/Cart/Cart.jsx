import React, { useState, useMemo } from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import Button from "../../components/atoms/Button/Button.jsx";
import CouponApplicator from "../../components/molecules/CouponApplicator";
import { useCartStore } from "../../stores/cartStore.js";
import { useCouponStore } from "../../stores/couponStore.js";
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
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  
  const {
    items,
    totalCount,
    isEmpty,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getItemDisplayName,
    getFormattedItemPrice,
    clearCart,
    getTotalPrice,
  } = useCartStore();
  
  const { useCoupon: updateCouponUsage } = useCouponStore();
  
  const totalPrice = getTotalPrice();
  const finalPrice = totalPrice - discountAmount;
  const formattedFinalPrice = finalPrice.toLocaleString();
  
  const orderItems = useMemo(() => {
    return items.map(item => ({
      id: item.productId || item.id,
      productId: item.productId || item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
      selectedOptions: item.selectedOptions || []
    }));
  }, [items]);

  const handleQuantityIncrease = (itemId) => {
    increaseQuantity(itemId);
  };

  const handleQuantityDecrease = (itemId) => {
    decreaseQuantity(itemId);
  };

  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId);
  };

  const handleCouponApply = (couponData) => {
    setAppliedCoupon({
      ...couponData.coupon,
      discountAmount: couponData.discountAmount
    });
    setDiscountAmount(couponData.discountAmount);
    
    // 쿠폰 사용 카운트 증가
    updateCouponUsage(couponData.coupon.id);
  };

  const handleCouponRemove = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const handleCheckout = () => {
    if (appliedCoupon) {
      console.log('적용된 쿠폰:', appliedCoupon);
      console.log('할인 금액:', discountAmount);
      console.log('최종 결제 금액:', finalPrice);
    }
    alert(`주문 기능은 추후 구현 예정입니다.\n${appliedCoupon ? `쿠폰 할인: ${discountAmount.toLocaleString()}원\n` : ''}최종 금액: ${formattedFinalPrice}원`);
  };

  const handleClearCart = () => {
    if (window.confirm('장바구니를 비우시겠습니까?')) {
      clearCart();
      setAppliedCoupon(null);
      setDiscountAmount(0);
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
              
              <CouponApplicator
                orderAmount={totalPrice}
                orderItems={orderItems}
                onCouponApply={handleCouponApply}
                onCouponRemove={handleCouponRemove}
                appliedCoupon={appliedCoupon}
                disabled={totalPrice === 0}
              />
              
              <CartSummary>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <Text size="md">상품 금액:</Text>
                    <Text size="md">{totalPrice.toLocaleString()}원</Text>
                  </div>
                  {discountAmount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <Text size="md" color="green">쿠폰 할인:</Text>
                      <Text size="md" color="green">-{discountAmount.toLocaleString()}원</Text>
                    </div>
                  )}
                  <hr style={{ margin: '0.5rem 0', border: '1px solid #eee' }} />
                </div>
                
                <CartTotal>
                  <Text size="lg" weight="semibold">
                    총 결제금액: {formattedFinalPrice}원
                  </Text>
                  {discountAmount > 0 && (
                    <Text size="sm" color="green" style={{ marginTop: '0.25rem' }}>
                      {discountAmount.toLocaleString()}원 할인 적용됨
                    </Text>
                  )}
                </CartTotal>
                
                <CheckoutButton>
                  <Button variant="primary" size="large" onClick={handleCheckout}>
                    {finalPrice === 0 ? '무료 주문하기' : `${formattedFinalPrice}원 주문하기`}
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