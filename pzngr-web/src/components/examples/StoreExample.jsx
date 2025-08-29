import React, { useState } from 'react';
import styled from 'styled-components';
import { useUserStore, useProductStore, useCartStore, useOrderStore, ORDER_STATUS } from '../../stores';

const ExampleContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const Button = styled.button`
  margin: 5px;
  padding: 10px 15px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #0056b3;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  margin: 5px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ProductCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  margin: 10px;
  display: inline-block;
  width: 200px;
  vertical-align: top;
`;

const CartItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
`;

const StatusDisplay = styled.div`
  background: #e8f4fd;
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
`;

// Store 사용 예시 컴포넌트
const StoreExample = () => {
  // Store hooks 사용
  const { 
    isLoggedIn, 
    user, 
    login, 
    logout, 
    isAuthenticated,
    isAdmin 
  } = useUserStore();

  const { 
    products, 
    categories,
    selectedCategory,
    setSelectedCategory,
    getFilteredProducts,
    searchProducts 
  } = useProductStore();

  const { 
    items: cartItems, 
    totalCount, 
    totalPrice,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getFormattedTotalPrice,
    isEmpty 
  } = useCartStore();

  const { 
    orders,
    createOrder,
    updateOrderStatus,
    getOrderStatusText 
  } = useOrderStore();

  // 로컬 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [loginForm, setLoginForm] = useState({ name: '', email: '' });

  // 사용자 관련 함수들
  const handleLogin = () => {
    if (loginForm.name && loginForm.email) {
      login({
        id: Date.now().toString(),
        name: loginForm.name,
        email: loginForm.email,
        isAdmin: loginForm.email.includes('admin')
      });
      setLoginForm({ name: '', email: '' });
    }
  };

  const handleLogout = () => {
    logout();
  };

  // 장바구니 관련 함수들
  const handleAddToCart = (product) => {
    addToCart(product, 1);
  };

  const handleCreateOrder = () => {
    if (isEmpty() || !isAuthenticated()) {
      alert('장바구니가 비어있거나 로그인이 필요합니다.');
      return;
    }

    const orderData = {
      userId: user.id,
      items: cartItems,
      totalPrice: totalPrice,
      shippingAddress: {
        name: user.name,
        phone: '010-1234-5678',
        address: '서울시 강남구',
        detailAddress: '테헤란로 123',
        zipCode: '12345'
      }
    };

    createOrder(orderData);
    clearCart();
    alert('주문이 생성되었습니다!');
  };

  // 필터된 상품들
  const filteredProducts = searchQuery 
    ? searchProducts(searchQuery)
    : getFilteredProducts();

  return (
    <ExampleContainer>
      <h1>🛍️ Zustand 전역 상태 관리 예시</h1>
      
      {/* 사용자 상태 섹션 */}
      <Section>
        <SectionTitle>👤 사용자 상태 관리 (UserStore)</SectionTitle>
        
        <StatusDisplay>
          <strong>현재 상태:</strong><br/>
          로그인 상태: {isLoggedIn ? '로그인됨' : '로그아웃됨'}<br/>
          인증 상태: {isAuthenticated() ? '인증됨' : '인증 안됨'}<br/>
          관리자 여부: {isAdmin() ? 'YES' : 'NO'}<br/>
          {user && (
            <>
              사용자 정보: {user.name} ({user.email})<br/>
            </>
          )}
        </StatusDisplay>

        {!isLoggedIn ? (
          <div>
            <Input
              type="text"
              placeholder="이름"
              value={loginForm.name}
              onChange={(e) => setLoginForm({...loginForm, name: e.target.value})}
            />
            <Input
              type="email"
              placeholder="이메일 (admin 포함시 관리자)"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            />
            <Button onClick={handleLogin}>로그인</Button>
          </div>
        ) : (
          <Button onClick={handleLogout}>로그아웃</Button>
        )}
      </Section>

      {/* 상품 상태 섹션 */}
      <Section>
        <SectionTitle>📦 상품 상태 관리 (ProductStore)</SectionTitle>
        
        <div>
          <strong>카테고리 필터:</strong>
          {categories.map(category => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              style={{
                background: selectedCategory === category.id ? '#28a745' : '#007bff'
              }}
            >
              {category.name}
            </Button>
          ))}
        </div>

        <div>
          <Input
            type="text"
            placeholder="상품 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div>
          <strong>상품 목록 ({filteredProducts.length}개):</strong>
          {filteredProducts.map(product => (
            <ProductCard key={product.id}>
              <img 
                src={product.image} 
                alt={product.name}
                style={{ width: '100%', height: '120px', objectFit: 'cover' }}
              />
              <h4>{product.name}</h4>
              <p>가격: {product.price.toLocaleString()}원</p>
              <p>재고: {product.stock}개</p>
              <Button 
                onClick={() => handleAddToCart(product)}
                disabled={product.stock === 0}
              >
                장바구니에 추가
              </Button>
            </ProductCard>
          ))}
        </div>
      </Section>

      {/* 장바구니 상태 섹션 */}
      <Section>
        <SectionTitle>🛒 장바구니 상태 관리 (CartStore)</SectionTitle>
        
        <StatusDisplay>
          <strong>장바구니 현황:</strong><br/>
          총 상품 수: {totalCount}개<br/>
          총 금액: {getFormattedTotalPrice()}<br/>
          장바구니 상태: {isEmpty() ? '비어있음' : '상품 있음'}
        </StatusDisplay>

        {!isEmpty() && (
          <div>
            <strong>장바구니 아이템:</strong>
            {cartItems.map(item => (
              <CartItem key={item.id}>
                <div>
                  <strong>{item.name}</strong><br/>
                  {item.price.toLocaleString()}원 × {item.quantity}개
                </div>
                <div>
                  <Button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                    -
                  </Button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                    +
                  </Button>
                  <Button onClick={() => removeFromCart(item.id)}>
                    삭제
                  </Button>
                </div>
              </CartItem>
            ))}
            <Button onClick={clearCart}>장바구니 비우기</Button>
            <Button onClick={handleCreateOrder}>주문하기</Button>
          </div>
        )}
      </Section>

      {/* 주문 상태 섹션 */}
      <Section>
        <SectionTitle>📋 주문 상태 관리 (OrderStore)</SectionTitle>
        
        <StatusDisplay>
          <strong>주문 현황:</strong><br/>
          총 주문 수: {orders.length}개<br/>
          {isLoggedIn && (
            <>최근 주문: {orders.filter(order => order.userId === user.id).length}개</>
          )}
        </StatusDisplay>

        {orders.length > 0 && (
          <div>
            <strong>주문 목록:</strong>
            {orders.slice(0, 5).map(order => (
              <div key={order.id} style={{
                border: '1px solid #ddd',
                padding: '15px',
                margin: '10px 0',
                borderRadius: '8px'
              }}>
                <div>
                  <strong>주문 ID:</strong> {order.id}<br/>
                  <strong>상태:</strong> {getOrderStatusText(order.status)}<br/>
                  <strong>총 금액:</strong> {order.totalPrice.toLocaleString()}원<br/>
                  <strong>상품 수:</strong> {order.items.length}개<br/>
                  <strong>주문일:</strong> {new Date(order.createdAt).toLocaleDateString()}
                </div>
                <div style={{ marginTop: '10px' }}>
                  {order.status === ORDER_STATUS.PENDING && (
                    <Button onClick={() => updateOrderStatus(order.id, ORDER_STATUS.CONFIRMED)}>
                      주문 확인
                    </Button>
                  )}
                  {order.status === ORDER_STATUS.CONFIRMED && (
                    <Button onClick={() => updateOrderStatus(order.id, ORDER_STATUS.SHIPPED)}>
                      배송 시작
                    </Button>
                  )}
                  {order.status === ORDER_STATUS.SHIPPED && (
                    <Button onClick={() => updateOrderStatus(order.id, ORDER_STATUS.DELIVERED)}>
                      배송 완료
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>
    </ExampleContainer>
  );
};

export default StoreExample;