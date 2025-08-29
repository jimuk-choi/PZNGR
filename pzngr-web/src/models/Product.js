// ========================================
// 상품(Product) 데이터 모델 정의
// ========================================

/**
 * 상품 상태 열거형
 * @readonly
 * @enum {string}
 */
export const PRODUCT_STATUS = {
  /** 판매중 */
  ACTIVE: 'active',
  /** 품절 */
  OUT_OF_STOCK: 'out_of_stock',
  /** 일시중단 */
  INACTIVE: 'inactive',
  /** 단종 */
  DISCONTINUED: 'discontinued'
};

/**
 * 상품 가격 타입
 * @readonly
 * @enum {string}
 */
export const PRICE_TYPE = {
  /** 고정가격 */
  FIXED: 'fixed',
  /** 할인가격 */
  DISCOUNTED: 'discounted',
  /** 프로모션가격 */
  PROMOTION: 'promotion'
};

/**
 * 상품 무게 단위
 * @readonly
 * @enum {string}
 */
export const WEIGHT_UNIT = {
  GRAM: 'g',
  KILOGRAM: 'kg',
  POUND: 'lb'
};

/**
 * 상품 크기 단위
 * @readonly
 * @enum {string}
 */
export const SIZE_UNIT = {
  CENTIMETER: 'cm',
  METER: 'm',
  INCH: 'inch'
};

/**
 * 상품 기본 데이터 구조
 * @typedef {Object} Product
 * @property {string} id - 상품 고유 식별자
 * @property {string} name - 상품명
 * @property {string} description - 상품 설명
 * @property {string} shortDescription - 짧은 상품 설명 (목록에서 표시용)
 * @property {string} brand - 브랜드명
 * @property {string} model - 모델명
 * @property {string} sku - Stock Keeping Unit (재고 관리 코드)
 * @property {string} barcode - 바코드 번호
 * 
 * @property {Object} price - 가격 정보
 * @property {number} price.regular - 정가
 * @property {number} price.sale - 판매가
 * @property {number} price.discount - 할인 금액
 * @property {number} price.discountRate - 할인율 (%)
 * @property {string} price.currency - 통화 ('KRW', 'USD' 등)
 * @property {string} price.type - 가격 타입 (PRICE_TYPE)
 * 
 * @property {Object} images - 이미지 정보
 * @property {string} images.main - 메인 이미지 URL
 * @property {string[]} images.gallery - 상세 이미지 URL 배열
 * @property {string} images.thumbnail - 썸네일 이미지 URL
 * @property {string} images.hover - 마우스 오버시 표시할 이미지 URL
 * 
 * @property {Object} category - 카테고리 정보
 * @property {string} category.main - 대분류 ID
 * @property {string} category.sub - 중분류 ID
 * @property {string} category.detail - 소분류 ID
 * @property {string[]} category.tags - 태그 배열
 * 
 * @property {Object} specifications - 상품 사양
 * @property {Object} specifications.dimensions - 크기 정보
 * @property {number} specifications.dimensions.width - 너비
 * @property {number} specifications.dimensions.height - 높이
 * @property {number} specifications.dimensions.depth - 깊이
 * @property {string} specifications.dimensions.unit - 단위 (SIZE_UNIT)
 * @property {Object} specifications.weight - 무게 정보
 * @property {number} specifications.weight.value - 무게 값
 * @property {string} specifications.weight.unit - 무게 단위 (WEIGHT_UNIT)
 * @property {string} specifications.material - 재질
 * @property {string} specifications.color - 기본 색상
 * @property {string} specifications.origin - 원산지
 * @property {string} specifications.manufacturer - 제조사
 * 
 * @property {Object[]} options - 상품 옵션 배열
 * @property {string} options[].id - 옵션 고유 식별자
 * @property {string} options[].name - 옵션명 ('색상', '사이즈' 등)
 * @property {string} options[].type - 옵션 타입 ('select', 'radio', 'checkbox')
 * @property {boolean} options[].required - 필수 옵션 여부
 * @property {Object[]} options[].values - 옵션 값들
 * @property {string} options[].values[].id - 옵션 값 ID
 * @property {string} options[].values[].name - 옵션 값 이름
 * @property {number} options[].values[].additionalPrice - 추가 가격
 * @property {string} options[].values[].image - 옵션별 이미지 URL
 * @property {number} options[].values[].stock - 옵션별 재고 수량
 * 
 * @property {Object} inventory - 재고 정보
 * @property {number} inventory.total - 전체 재고 수량
 * @property {number} inventory.available - 판매 가능 재고
 * @property {number} inventory.reserved - 예약된 재고
 * @property {number} inventory.safetyStock - 안전 재고
 * @property {boolean} inventory.trackStock - 재고 추적 여부
 * @property {boolean} inventory.allowBackorder - 품절시 주문 허용 여부
 * 
 * @property {Object} seo - SEO 정보
 * @property {string} seo.title - SEO 제목
 * @property {string} seo.description - SEO 설명
 * @property {string[]} seo.keywords - SEO 키워드 배열
 * @property {string} seo.slug - URL 슬러그
 * 
 * @property {Object} shipping - 배송 정보
 * @property {boolean} shipping.freeShipping - 무료배송 여부
 * @property {number} shipping.weight - 배송 무게
 * @property {Object} shipping.dimensions - 배송 크기
 * @property {number} shipping.fee - 배송비
 * @property {string[]} shipping.restrictions - 배송 제한 지역
 * 
 * @property {Object} display - 진열 정보
 * @property {boolean} display.featured - 추천 상품 여부
 * @property {boolean} display.newProduct - 신상품 여부
 * @property {boolean} display.bestSeller - 베스트셀러 여부
 * @property {number} display.sortOrder - 정렬 순서
 * @property {Date} display.startDate - 진열 시작일
 * @property {Date} display.endDate - 진열 종료일
 * 
 * @property {Object} stats - 통계 정보
 * @property {number} stats.viewCount - 조회수
 * @property {number} stats.purchaseCount - 구매수
 * @property {number} stats.wishlistCount - 위시리스트 등록 수
 * @property {number} stats.rating - 평균 평점
 * @property {number} stats.reviewCount - 리뷰 수
 * 
 * @property {string} status - 상품 상태 (PRODUCT_STATUS)
 * @property {Date} createdAt - 등록일
 * @property {Date} updatedAt - 수정일
 * @property {string} createdBy - 등록자 ID
 * @property {string} updatedBy - 수정자 ID
 */

/**
 * 빈 상품 객체 생성
 * @returns {Product} 기본값이 설정된 빈 상품 객체
 */
export const createEmptyProduct = () => ({
  id: '',
  name: '',
  description: '',
  shortDescription: '',
  brand: '',
  model: '',
  sku: '',
  barcode: '',
  
  price: {
    regular: 0,
    sale: 0,
    discount: 0,
    discountRate: 0,
    currency: 'KRW',
    type: PRICE_TYPE.FIXED
  },
  
  images: {
    main: '',
    gallery: [],
    thumbnail: '',
    hover: ''
  },
  
  category: {
    main: '',
    sub: '',
    detail: '',
    tags: []
  },
  
  specifications: {
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      unit: SIZE_UNIT.CENTIMETER
    },
    weight: {
      value: 0,
      unit: WEIGHT_UNIT.GRAM
    },
    material: '',
    color: '',
    origin: '',
    manufacturer: ''
  },
  
  options: [],
  
  inventory: {
    total: 0,
    available: 0,
    reserved: 0,
    safetyStock: 0,
    trackStock: true,
    allowBackorder: false
  },
  
  seo: {
    title: '',
    description: '',
    keywords: [],
    slug: ''
  },
  
  shipping: {
    freeShipping: false,
    weight: 0,
    dimensions: {
      width: 0,
      height: 0,
      depth: 0,
      unit: SIZE_UNIT.CENTIMETER
    },
    fee: 0,
    restrictions: []
  },
  
  display: {
    featured: false,
    newProduct: false,
    bestSeller: false,
    sortOrder: 0,
    startDate: new Date(),
    endDate: null
  },
  
  stats: {
    viewCount: 0,
    purchaseCount: 0,
    wishlistCount: 0,
    rating: 0,
    reviewCount: 0
  },
  
  status: PRODUCT_STATUS.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: '',
  updatedBy: ''
});

/**
 * 상품 옵션 타입
 * @readonly
 * @enum {string}
 */
export const OPTION_TYPE = {
  /** 단일 선택 (드롭다운) */
  SELECT: 'select',
  /** 단일 선택 (라디오 버튼) */
  RADIO: 'radio',
  /** 다중 선택 (체크박스) */
  CHECKBOX: 'checkbox',
  /** 텍스트 입력 */
  TEXT: 'text',
  /** 숫자 입력 */
  NUMBER: 'number'
};

/**
 * 상품 옵션 생성
 * @param {string} name - 옵션명
 * @param {string} type - 옵션 타입
 * @param {boolean} required - 필수 여부
 * @returns {Object} 상품 옵션 객체
 */
export const createProductOption = (name, type = OPTION_TYPE.SELECT, required = false) => ({
  id: `option_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  type,
  required,
  values: []
});

/**
 * 상품 옵션 값 생성
 * @param {string} name - 옵션 값 이름
 * @param {number} additionalPrice - 추가 가격
 * @param {string} image - 옵션 이미지 URL
 * @param {number} stock - 재고 수량
 * @returns {Object} 옵션 값 객체
 */
export const createOptionValue = (name, additionalPrice = 0, image = '', stock = 0) => ({
  id: `value_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  name,
  additionalPrice,
  image,
  stock
});