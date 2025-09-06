// ========================================
// 찜하기 관련 헬퍼 함수들
// ========================================

/**
 * 찜하기 아이템 유효성 검사
 * @param {Object} item - 찜하기 아이템
 * @returns {Object} 검증 결과 { isValid: boolean, errors: string[] }
 */
export const validateWishlistItem = (item) => {
  const errors = [];
  
  if (!item.productId) {
    errors.push('상품 ID가 필요합니다.');
  }
  
  if (!item.name || item.name.trim().length === 0) {
    errors.push('상품명이 필요합니다.');
  }
  
  if (!item.price || (typeof item.price !== 'number' && typeof item.price !== 'object')) {
    errors.push('유효한 가격 정보가 필요합니다.');
  }
  
  if (!item.image || item.image.trim().length === 0) {
    errors.push('상품 이미지가 필요합니다.');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * 찜하기 아이템 가격 계산
 * @param {Object} item - 찜하기 아이템
 * @returns {number} 최종 가격
 */
export const getWishlistItemPrice = (item) => {
  if (typeof item.price === 'number') {
    return item.price;
  }
  
  if (typeof item.price === 'object') {
    // 할인가가 있으면 할인가, 없으면 정가
    return item.price.sale || item.price.regular || 0;
  }
  
  return 0;
};

/**
 * 찜하기 아이템 가격 포맷팅
 * @param {Object} item - 찜하기 아이템
 * @returns {string} 포맷된 가격 문자열
 */
export const formatWishlistItemPrice = (item) => {
  const price = getWishlistItemPrice(item);
  return `${price.toLocaleString('ko-KR')}원`;
};

/**
 * 찜하기 아이템 할인율 계산
 * @param {Object} item - 찜하기 아이템
 * @returns {number} 할인율 (0-100)
 */
export const getWishlistItemDiscountRate = (item) => {
  if (typeof item.price !== 'object') {
    return 0;
  }
  
  const { regular, sale } = item.price;
  
  if (!sale || !regular || sale >= regular) {
    return 0;
  }
  
  return Math.round(((regular - sale) / regular) * 100);
};

/**
 * 찜하기 아이템이 할인 중인지 확인
 * @param {Object} item - 찜하기 아이템
 * @returns {boolean} 할인 여부
 */
export const isWishlistItemOnSale = (item) => {
  return getWishlistItemDiscountRate(item) > 0;
};

/**
 * 찜하기 목록을 브랜드별로 그룹화
 * @param {Object[]} items - 찜하기 아이템 배열
 * @returns {Object} 브랜드별 그룹화된 객체
 */
export const groupWishlistByBrand = (items) => {
  return items.reduce((groups, item) => {
    const brand = item.brand || '기타';
    if (!groups[brand]) {
      groups[brand] = [];
    }
    groups[brand].push(item);
    return groups;
  }, {});
};

/**
 * 찜하기 목록을 카테고리별로 그룹화
 * @param {Object[]} items - 찜하기 아이템 배열
 * @returns {Object} 카테고리별 그룹화된 객체
 */
export const groupWishlistByCategory = (items) => {
  return items.reduce((groups, item) => {
    const category = item.category?.main || '기타';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

/**
 * 찜하기 목록을 가격대별로 그룹화
 * @param {Object[]} items - 찜하기 아이템 배열
 * @param {number[]} priceRanges - 가격대 구간 배열 (예: [10000, 50000, 100000])
 * @returns {Object} 가격대별 그룹화된 객체
 */
export const groupWishlistByPriceRange = (items, priceRanges = [10000, 50000, 100000, 200000]) => {
  const groups = {};
  
  // 가격대 구간 레이블 생성
  const ranges = [
    { min: 0, max: priceRanges[0], label: `${priceRanges[0].toLocaleString('ko-KR')}원 미만` },
    ...priceRanges.slice(0, -1).map((price, index) => ({
      min: price,
      max: priceRanges[index + 1],
      label: `${price.toLocaleString('ko-KR')} - ${priceRanges[index + 1].toLocaleString('ko-KR')}원`
    })),
    { 
      min: priceRanges[priceRanges.length - 1], 
      max: Infinity, 
      label: `${priceRanges[priceRanges.length - 1].toLocaleString('ko-KR')}원 이상` 
    }
  ];
  
  // 각 구간 초기화
  ranges.forEach(range => {
    groups[range.label] = [];
  });
  
  // 아이템들을 가격대별로 분류
  items.forEach(item => {
    const price = getWishlistItemPrice(item);
    const range = ranges.find(r => price >= r.min && price < r.max);
    if (range) {
      groups[range.label].push(item);
    }
  });
  
  return groups;
};

/**
 * 찜하기 목록에서 최고/최저 가격 상품 찾기
 * @param {Object[]} items - 찜하기 아이템 배열
 * @returns {Object} { mostExpensive, cheapest }
 */
export const getWishlistPriceExtremes = (items) => {
  if (items.length === 0) {
    return { mostExpensive: null, cheapest: null };
  }
  
  let mostExpensive = items[0];
  let cheapest = items[0];
  let highestPrice = getWishlistItemPrice(mostExpensive);
  let lowestPrice = getWishlistItemPrice(cheapest);
  
  items.forEach(item => {
    const price = getWishlistItemPrice(item);
    if (price > highestPrice) {
      highestPrice = price;
      mostExpensive = item;
    }
    if (price < lowestPrice) {
      lowestPrice = price;
      cheapest = item;
    }
  });
  
  return { mostExpensive, cheapest };
};

/**
 * 찜하기 목록의 총 가치 계산
 * @param {Object[]} items - 찜하기 아이템 배열
 * @returns {Object} { totalValue, averagePrice, totalItems }
 */
export const calculateWishlistValue = (items) => {
  if (items.length === 0) {
    return { totalValue: 0, averagePrice: 0, totalItems: 0 };
  }
  
  const totalValue = items.reduce((sum, item) => {
    return sum + getWishlistItemPrice(item);
  }, 0);
  
  const averagePrice = totalValue / items.length;
  
  return {
    totalValue,
    averagePrice: Math.round(averagePrice),
    totalItems: items.length
  };
};

/**
 * 찜하기 아이템이 최근에 추가된 것인지 확인 (N일 이내)
 * @param {Object} item - 찜하기 아이템
 * @param {number} days - 기준 일수 (기본값: 7일)
 * @returns {boolean} 최근 추가 여부
 */
export const isRecentlyAdded = (item, days = 7) => {
  if (!item.addedAt) return false;
  
  const addedDate = new Date(item.addedAt);
  const now = new Date();
  const daysDiff = (now - addedDate) / (1000 * 60 * 60 * 24);
  
  return daysDiff <= days;
};

/**
 * 찜하기 아이템 추가된 날짜를 상대적 시간으로 표시
 * @param {Object} item - 찜하기 아이템
 * @returns {string} 상대적 시간 문자열
 */
export const getRelativeAddedTime = (item) => {
  if (!item.addedAt) return '알 수 없음';
  
  const addedDate = new Date(item.addedAt);
  const now = new Date();
  const diffMs = now - addedDate;
  
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  
  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < 60) return `${diffMinutes}분 전`;
  if (diffHours < 24) return `${diffHours}시간 전`;
  if (diffDays < 7) return `${diffDays}일 전`;
  if (diffWeeks < 4) return `${diffWeeks}주 전`;
  if (diffMonths < 12) return `${diffMonths}개월 전`;
  
  return addedDate.toLocaleDateString('ko-KR');
};

/**
 * 찜하기 목록을 추가 날짜별로 그룹화
 * @param {Object[]} items - 찜하기 아이템 배열
 * @returns {Object} 날짜별 그룹화된 객체
 */
export const groupWishlistByDate = (items) => {
  const groups = {
    '오늘': [],
    '어제': [],
    '이번 주': [],
    '지난 주': [],
    '이번 달': [],
    '지난 달': [],
    '더 오래 전': []
  };
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekStart = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
  const lastWeekStart = new Date(weekStart.getTime() - (7 * 24 * 60 * 60 * 1000));
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  
  items.forEach(item => {
    if (!item.addedAt) {
      groups['더 오래 전'].push(item);
      return;
    }
    
    const addedDate = new Date(item.addedAt);
    const addedDay = new Date(addedDate.getFullYear(), addedDate.getMonth(), addedDate.getDate());
    
    if (addedDay.getTime() === today.getTime()) {
      groups['오늘'].push(item);
    } else if (addedDay.getTime() === yesterday.getTime()) {
      groups['어제'].push(item);
    } else if (addedDate >= weekStart) {
      groups['이번 주'].push(item);
    } else if (addedDate >= lastWeekStart) {
      groups['지난 주'].push(item);
    } else if (addedDate >= monthStart) {
      groups['이번 달'].push(item);
    } else if (addedDate >= lastMonthStart) {
      groups['지난 달'].push(item);
    } else {
      groups['더 오래 전'].push(item);
    }
  });
  
  // 비어있는 그룹 제거
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });
  
  return groups;
};

/**
 * 찜하기 아이템을 장바구니에 추가할 수 있는지 확인
 * @param {Object} item - 찜하기 아이템
 * @returns {Object} { canAdd: boolean, reason?: string }
 */
export const canAddWishlistItemToCart = (item) => {
  // 상품 상태 확인
  if (item.status === 'discontinued') {
    return { canAdd: false, reason: '단종된 상품입니다.' };
  }
  
  if (item.status === 'out_of_stock') {
    return { canAdd: false, reason: '품절된 상품입니다.' };
  }
  
  if (item.status === 'inactive') {
    return { canAdd: false, reason: '판매 중단된 상품입니다.' };
  }
  
  // 가격 확인
  const price = getWishlistItemPrice(item);
  if (price <= 0) {
    return { canAdd: false, reason: '가격 정보가 올바르지 않습니다.' };
  }
  
  return { canAdd: true };
};

// 개발 환경에서 전역 접근
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.PZNGR_WISHLIST_HELPERS = {
    validateWishlistItem,
    getWishlistItemPrice,
    formatWishlistItemPrice,
    getWishlistItemDiscountRate,
    isWishlistItemOnSale,
    groupWishlistByBrand,
    groupWishlistByCategory,
    groupWishlistByPriceRange,
    getWishlistPriceExtremes,
    calculateWishlistValue,
    isRecentlyAdded,
    getRelativeAddedTime,
    groupWishlistByDate,
    canAddWishlistItemToCart
  };
  console.log('🛠️ Wishlist helpers available at window.PZNGR_WISHLIST_HELPERS');
}