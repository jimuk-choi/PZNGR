import React, { useState, useEffect } from 'react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import { useCouponStore } from '../../../stores/couponStore';
import { useUserStore } from '../../../stores/userStore';
import * as S from './CouponApplicator.styles';

const CouponApplicator = ({ 
  orderAmount = 0, 
  orderItems = [], 
  onCouponApply = () => {}, 
  onCouponRemove = () => {},
  appliedCoupon = null,
  disabled = false 
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showAvailableCoupons, setShowAvailableCoupons] = useState(false);
  
  const { 
    validateCouponUsage, 
    applyCoupon, 
    getPublicCoupons
  } = useCouponStore();
  
  const { user } = useUserStore();
  
  const availableCoupons = getPublicCoupons();
  
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setMessage('쿠폰 코드를 입력해주세요.');
      return;
    }
    
    setIsLoading(true);
    setMessage('');
    
    try {
      const result = applyCoupon(
        couponCode.trim(),
        orderAmount,
        orderItems,
        user?.id
      );
      
      if (result.success) {
        onCouponApply({
          coupon: result.coupon,
          discountAmount: result.discountAmount,
          finalAmount: result.finalAmount,
          savings: result.savings
        });
        setMessage(`✅ 쿠폰이 적용되었습니다! ${result.savings.toLocaleString()}원 할인`);
        setCouponCode('');
      } else {
        setMessage(`❌ ${result.message}`);
      }
    } catch (error) {
      console.error('쿠폰 적용 오류:', error);
      setMessage('❌ 쿠폰 적용 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRemoveCoupon = () => {
    onCouponRemove();
    setMessage('쿠폰이 제거되었습니다.');
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleUseCoupon = (coupon) => {
    setCouponCode(coupon.code);
    setShowAvailableCoupons(false);
  };
  
  const getApplicableCoupons = () => {
    if (!orderItems.length) return availableCoupons;
    
    const orderCategories = orderItems.map(item => item.category).filter(Boolean);
    const orderProducts = orderItems.map(item => item.productId || item.id).filter(Boolean);
    
    return availableCoupons.filter(coupon => {
      const validation = validateCouponUsage(
        coupon.code,
        orderAmount,
        orderCategories,
        orderProducts,
        user?.id
      );
      return validation.valid;
    });
  };
  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);
  
  if (disabled) {
    return (
      <S.DisabledContainer>
        <Text variant="body2" color="gray">
          주문 금액이 0원일 때는 쿠폰을 사용할 수 없습니다.
        </Text>
      </S.DisabledContainer>
    );
  }
  
  return (
    <S.Container>
      {appliedCoupon ? (
        <S.AppliedCouponSection>
          <S.AppliedCouponCard>
            <S.CouponInfo>
              <S.CouponName>{appliedCoupon.name}</S.CouponName>
              <S.CouponCode>{appliedCoupon.code}</S.CouponCode>
              <S.DiscountAmount>
                -{appliedCoupon.discountAmount?.toLocaleString()}원 할인
              </S.DiscountAmount>
            </S.CouponInfo>
            <Button 
              size="small" 
              variant="outline" 
              onClick={handleRemoveCoupon}
            >
              제거
            </Button>
          </S.AppliedCouponCard>
        </S.AppliedCouponSection>
      ) : (
        <S.InputSection>
          <Text variant="h4">할인 쿠폰</Text>
          
          <S.CouponInputGroup>
            <S.CouponInput
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="쿠폰 코드를 입력하세요"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleApplyCoupon();
                }
              }}
              disabled={isLoading}
            />
            <Button 
              onClick={handleApplyCoupon} 
              disabled={isLoading || !couponCode.trim()}
              size="small"
            >
              {isLoading ? '확인 중...' : '적용'}
            </Button>
          </S.CouponInputGroup>
          
          <S.AvailableCouponsToggle>
            <Button 
              variant="text" 
              size="small"
              onClick={() => setShowAvailableCoupons(!showAvailableCoupons)}
            >
              {showAvailableCoupons ? '▲ 사용 가능한 쿠폰 숨기기' : '▼ 사용 가능한 쿠폰 보기'}
            </Button>
          </S.AvailableCouponsToggle>
          
          {showAvailableCoupons && (
            <S.AvailableCouponsSection>
              <Text variant="body2" color="gray" style={{ marginBottom: '0.5rem' }}>
                현재 주문에 사용 가능한 쿠폰
              </Text>
              
              <S.CouponList>
                {getApplicableCoupons().map(coupon => (
                  <S.CouponItem key={coupon.id} onClick={() => handleUseCoupon(coupon)}>
                    <S.CouponItemHeader>
                      <S.CouponItemName>{coupon.name}</S.CouponItemName>
                      <S.CouponItemCode>{coupon.code}</S.CouponItemCode>
                    </S.CouponItemHeader>
                    <S.CouponItemDescription>
                      {coupon.description}
                    </S.CouponItemDescription>
                    <S.CouponItemDetails>
                      <span>
                        {coupon.type === 'percentage' && `${coupon.discountValue}% 할인`}
                        {coupon.type === 'fixed_amount' && `${coupon.discountValue.toLocaleString()}원 할인`}
                        {coupon.type === 'free_shipping' && '무료배송'}
                      </span>
                      {coupon.minOrderAmount > 0 && (
                        <span>최소 주문: {coupon.minOrderAmount.toLocaleString()}원</span>
                      )}
                    </S.CouponItemDetails>
                  </S.CouponItem>
                ))}
                
                {getApplicableCoupons().length === 0 && (
                  <S.EmptyState>
                    <Text variant="body2" color="gray">
                      현재 주문에 사용 가능한 쿠폰이 없습니다.
                    </Text>
                  </S.EmptyState>
                )}
              </S.CouponList>
            </S.AvailableCouponsSection>
          )}
        </S.InputSection>
      )}
      
      {message && (
        <S.Message $isError={message.includes('❌')}>
          <Text variant="body2">
            {message}
          </Text>
        </S.Message>
      )}
    </S.Container>
  );
};

export default CouponApplicator;