// Store용 사용자 타입 정의 (간소화된 버전)
export const StoreUserType = {
  id: '',
  name: '',
  email: '',
  isAdmin: false
};

// 상품 옵션 타입 정의
export const ProductOptionType = {
  id: '',
  type: '', // 'color', 'size', etc.
  name: '',
  value: '',
  additionalPrice: 0
};

// 상품 타입 정의
export const ProductType = {
  id: '',
  name: '',
  price: 0,
  image: '',
  description: '',
  category: '',
  stock: 0,
  options: [] // ProductOptionType 배열
};

// 장바구니 아이템 타입 정의
export const CartItemType = {
  id: '',
  productId: '',
  name: '',
  price: 0,
  quantity: 1,
  image: '',
  selectedOptions: [], // 선택된 옵션들 { optionType: 'color', optionValue: 'red', optionName: '빨간색', additionalPrice: 0 }
  finalPrice: 0 // 옵션 추가 가격 포함된 최종 가격
};

// 주문 타입 정의
export const OrderType = {
  id: '',
  userId: '',
  items: [],
  totalPrice: 0,
  status: 'pending', // 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  createdAt: '',
  shippingAddress: ''
};

// 카테고리 타입 정의
export const CategoryType = {
  id: '',
  name: '',
  description: ''
};