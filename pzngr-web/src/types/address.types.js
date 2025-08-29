// ========================================
// 주소 관리 시스템 타입 정의
// ========================================

// 주소 타입 정의
export const ADDRESS_TYPE = {
  HOME: 'home',         // 집
  OFFICE: 'office',     // 회사
  OTHER: 'other'        // 기타
};

// 기본 주소 타입
export const AddressType = {
  id: '',
  userId: '',
  
  // 주소 정보
  type: ADDRESS_TYPE.HOME,
  recipientName: '',        // 수령인 이름
  recipientPhone: '',       // 수령인 전화번호
  
  // 주소 상세
  zipCode: '',              // 우편번호
  address: '',              // 기본 주소 (도로명주소)
  detailAddress: '',        // 상세 주소 (동, 호수 등)
  
  // 추가 정보
  addressAlias: '',         // 주소별칭 (예: "우리집", "회사" 등)
  deliveryNote: '',         // 배송 메모
  
  // 시스템 정보
  isDefault: false,         // 기본 배송지 여부
  isActive: true,           // 활성 상태
  createdAt: '',
  updatedAt: ''
};

// 주소 생성/수정 폼 데이터 타입
export const AddressFormType = {
  type: ADDRESS_TYPE.HOME,
  recipientName: '',
  recipientPhone: '',
  zipCode: '',
  address: '',
  detailAddress: '',
  addressAlias: '',
  deliveryNote: '',
  isDefault: false
};

// 우편번호 검색 결과 타입
export const PostalCodeSearchResultType = {
  zipCode: '',
  address: '',              // 도로명주소
  jibunAddress: '',         // 지번주소
  englishAddress: '',       // 영문주소
  buildingName: '',         // 건물명
  sido: '',                 // 시도
  sigungu: '',             // 시군구
  roadname: '',            // 도로명
  buildingNumber: ''       // 건물번호
};

// 주소 검증 결과 타입
export const AddressValidationResultType = {
  isValid: false,
  errors: []
};

// 배송 가능 지역 타입
export const DeliveryZoneType = {
  id: '',
  name: '',
  zipCodes: [],            // 배송 가능한 우편번호 목록
  deliveryFee: 0,          // 배송비
  deliveryDays: 1,         // 배송 소요일
  isAvailable: true        // 배송 가능 여부
};

// 주소 타입별 표시명
export const ADDRESS_TYPE_LABELS = {
  [ADDRESS_TYPE.HOME]: '집',
  [ADDRESS_TYPE.OFFICE]: '회사',
  [ADDRESS_TYPE.OTHER]: '기타'
};

// 기본 배송비 정책
export const DELIVERY_POLICY = {
  FREE_SHIPPING_THRESHOLD: 30000,  // 무료배송 기준금액
  DEFAULT_DELIVERY_FEE: 3000,      // 기본 배송비
  JEJU_DELIVERY_FEE: 5000,         // 제주도 배송비
  REMOTE_AREA_DELIVERY_FEE: 5000   // 도서산간 배송비
};

// 우편번호별 특별 배송비 지역
export const SPECIAL_DELIVERY_AREAS = {
  JEJU: {
    name: '제주도',
    zipCodePrefixes: ['63'],
    deliveryFee: DELIVERY_POLICY.JEJU_DELIVERY_FEE,
    deliveryDays: 2
  },
  REMOTE: {
    name: '도서산간',
    zipCodePrefixes: ['59', '58', '56'], // 예시 우편번호
    deliveryFee: DELIVERY_POLICY.REMOTE_AREA_DELIVERY_FEE,
    deliveryDays: 3
  }
};