// ========================================
// 쿠폰/할인 데이터 모델 정의
// ========================================

/**
 * 쿠폰 타입 열거형
 * @readonly
 * @enum {string}
 */
export const COUPON_TYPE = {
  /** 정률 할인 (퍼센트) */
  PERCENTAGE: 'percentage',
  /** 정액 할인 (고정 금액) */
  FIXED_AMOUNT: 'fixed_amount',
  /** 무료배송 */
  FREE_SHIPPING: 'free_shipping',
  /** 카테고리별 할인 */
  CATEGORY_DISCOUNT: 'category_discount',
  /** 상품별 할인 */
  PRODUCT_DISCOUNT: 'product_discount'
};

/**
 * 쿠폰 상태 열거형
 * @readonly
 * @enum {string}
 */
export const COUPON_STATUS = {
  /** 활성 */
  ACTIVE: 'active',
  /** 비활성 */
  INACTIVE: 'inactive',
  /** 만료됨 */
  EXPIRED: 'expired',
  /** 소진됨 */
  EXHAUSTED: 'exhausted'
};

/**
 * 적용 조건 타입
 * @readonly
 * @enum {string}
 */
export const CONDITION_TYPE = {
  /** 최소 주문 금액 */
  MIN_ORDER_AMOUNT: 'min_order_amount',
  /** 특정 카테고리 */
  CATEGORY: 'category',
  /** 특정 상품 */
  PRODUCT: 'product',
  /** 첫 주문 */
  FIRST_ORDER: 'first_order',
  /** 회원 등급 */
  MEMBER_GRADE: 'member_grade'
};

/**
 * 쿠폰 기본 데이터 구조
 * @typedef {Object} Coupon
 * @property {string} id - 쿠폰 고유 식별자
 * @property {string} code - 쿠폰 코드 (사용자 입력용)
 * @property {string} name - 쿠폰 이름
 * @property {string} description - 쿠폰 설명
 * 
 * @property {string} type - 쿠폰 타입 (COUPON_TYPE)
 * @property {number} discountValue - 할인 값 (퍼센트 또는 금액)
 * @property {number} maxDiscountAmount - 최대 할인 금액 (정률 할인시)
 * @property {number} minOrderAmount - 최소 주문 금액
 * 
 * @property {Object} usage - 사용량 정보
 * @property {number} usage.limit - 총 사용 제한 (0 = 무제한)
 * @property {number} usage.limitPerUser - 사용자별 사용 제한
 * @property {number} usage.used - 현재까지 사용된 횟수
 * 
 * @property {Object} validity - 유효기간 정보
 * @property {Date} validity.startDate - 시작일
 * @property {Date} validity.endDate - 종료일
 * @property {boolean} validity.isAlwaysValid - 항상 유효 여부
 * 
 * @property {Object[]} conditions - 적용 조건들
 * @property {string} conditions[].type - 조건 타입 (CONDITION_TYPE)
 * @property {*} conditions[].value - 조건 값
 * 
 * @property {Object} target - 적용 대상
 * @property {string[]} target.categories - 대상 카테고리 ID들
 * @property {string[]} target.products - 대상 상품 ID들
 * @property {boolean} target.excludeDiscountedItems - 이미 할인된 상품 제외
 * 
 * @property {Object} display - 진열 정보
 * @property {boolean} display.isPublic - 공개 여부
 * @property {boolean} display.showInList - 쿠폰 목록에 표시
 * @property {string} display.bannerImage - 배너 이미지 URL
 * @property {string} display.backgroundColor - 배경색
 * 
 * @property {string} status - 쿠폰 상태 (COUPON_STATUS)
 * @property {Date} createdAt - 생성일
 * @property {Date} updatedAt - 수정일
 * @property {string} createdBy - 생성자 ID
 */

/**
 * 빈 쿠폰 객체 생성
 * @returns {Coupon} 기본값이 설정된 빈 쿠폰 객체
 */
export const createEmptyCoupon = () => ({
  id: '',
  code: '',
  name: '',
  description: '',
  
  type: COUPON_TYPE.PERCENTAGE,
  discountValue: 0,
  maxDiscountAmount: 0,
  minOrderAmount: 0,
  
  usage: {
    limit: 0,
    limitPerUser: 1,
    used: 0
  },
  
  validity: {
    startDate: new Date(),
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
    isAlwaysValid: false
  },
  
  conditions: [],
  
  target: {
    categories: [],
    products: [],
    excludeDiscountedItems: false
  },
  
  display: {
    isPublic: true,
    showInList: true,
    bannerImage: '',
    backgroundColor: '#007bff'
  },
  
  status: COUPON_STATUS.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: ''
});

/**
 * 쿠폰 조건 생성
 * @param {string} type - 조건 타입
 * @param {*} value - 조건 값
 * @returns {Object} 쿠폰 조건 객체
 */
export const createCouponCondition = (type, value) => ({
  id: `condition_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  type,
  value
});

/**
 * 쿠폰 코드 생성
 * @param {string} prefix - 접두사
 * @param {number} length - 코드 길이
 * @returns {string} 생성된 쿠폰 코드
 */
export const generateCouponCode = (prefix = 'COUPON', length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix + '_';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * 쿠폰 유효성 검증
 * @param {Coupon} coupon - 검증할 쿠폰
 * @param {number} orderAmount - 주문 금액
 * @param {string[]} orderCategories - 주문 상품 카테고리들
 * @param {string[]} orderProducts - 주문 상품 ID들
 * @param {Object} user - 사용자 정보
 * @returns {Object} 검증 결과 { valid: boolean, reason?: string }
 */
export const validateCoupon = (coupon, orderAmount = 0, orderCategories = [], orderProducts = [], user = null) => {
  // 쿠폰 상태 확인
  if (coupon.status !== COUPON_STATUS.ACTIVE) {
    return { valid: false, reason: '사용할 수 없는 쿠폰입니다.' };
  }
  
  // 유효기간 확인
  if (!coupon.validity.isAlwaysValid) {
    const now = new Date();
    if (now < new Date(coupon.validity.startDate)) {
      return { valid: false, reason: '아직 사용할 수 없는 쿠폰입니다.' };
    }
    if (now > new Date(coupon.validity.endDate)) {
      return { valid: false, reason: '만료된 쿠폰입니다.' };
    }
  }
  
  // 사용 횟수 확인
  if (coupon.usage.limit > 0 && coupon.usage.used >= coupon.usage.limit) {
    return { valid: false, reason: '쿠폰 사용 한도가 초과되었습니다.' };
  }
  
  // 최소 주문 금액 확인
  if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount) {
    return { 
      valid: false, 
      reason: `최소 주문 금액 ${coupon.minOrderAmount.toLocaleString()}원 이상이어야 합니다.` 
    };
  }
  
  // 조건 확인
  for (const condition of coupon.conditions) {
    switch (condition.type) {
      case CONDITION_TYPE.MIN_ORDER_AMOUNT:
        if (orderAmount < condition.value) {
          return { 
            valid: false, 
            reason: `최소 주문 금액 ${condition.value.toLocaleString()}원 이상이어야 합니다.` 
          };
        }
        break;
        
      case CONDITION_TYPE.CATEGORY:
        if (!orderCategories.some(cat => condition.value.includes(cat))) {
          return { valid: false, reason: '해당 카테고리 상품이 없습니다.' };
        }
        break;
        
      case CONDITION_TYPE.PRODUCT:
        if (!orderProducts.some(prod => condition.value.includes(prod))) {
          return { valid: false, reason: '해당 상품이 장바구니에 없습니다.' };
        }
        break;
        
      case CONDITION_TYPE.FIRST_ORDER:
        // TODO: 사용자의 첫 주문인지 확인하는 로직 추가
        break;
    }
  }
  
  return { valid: true };
};

/**
 * 할인 금액 계산
 * @param {Coupon} coupon - 쿠폰 정보
 * @param {number} orderAmount - 주문 금액
 * @param {Object[]} orderItems - 주문 상품들
 * @returns {Object} 할인 정보 { discountAmount: number, finalAmount: number }
 */
export const calculateDiscount = (coupon, orderAmount, orderItems = []) => {
  let discountAmount = 0;
  
  switch (coupon.type) {
    case COUPON_TYPE.PERCENTAGE:
      discountAmount = Math.floor(orderAmount * (coupon.discountValue / 100));
      if (coupon.maxDiscountAmount > 0) {
        discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
      }
      break;
      
    case COUPON_TYPE.FIXED_AMOUNT:
      discountAmount = Math.min(coupon.discountValue, orderAmount);
      break;
      
    case COUPON_TYPE.FREE_SHIPPING:
      // 배송비 할인 (배송비 정보가 필요)
      discountAmount = 0; // TODO: 배송비 계산 로직 추가
      break;
      
    default:
      discountAmount = 0;
  }
  
  const finalAmount = Math.max(0, orderAmount - discountAmount);
  
  return {
    discountAmount,
    finalAmount
  };
};

/**
 * 기본 쿠폰 템플릿들
 */
export const DEFAULT_COUPON_TEMPLATES = [
  {
    name: '신규 회원 10% 할인',
    type: COUPON_TYPE.PERCENTAGE,
    discountValue: 10,
    maxDiscountAmount: 10000,
    minOrderAmount: 50000,
    conditions: [
      { type: CONDITION_TYPE.FIRST_ORDER, value: true }
    ]
  },
  {
    name: '5만원 이상 5000원 할인',
    type: COUPON_TYPE.FIXED_AMOUNT,
    discountValue: 5000,
    minOrderAmount: 50000
  },
  {
    name: '무료배송 쿠폰',
    type: COUPON_TYPE.FREE_SHIPPING,
    minOrderAmount: 30000
  }
];