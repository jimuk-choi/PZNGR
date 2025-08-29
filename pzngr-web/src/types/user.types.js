// ========================================
// 사용자 관리 시스템 타입 정의
// ========================================

// 사용자 역할/권한 정의
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin'
};

// 회원 상태 정의
export const USER_STATUS = {
  ACTIVE: 'active',           // 활성 회원
  INACTIVE: 'inactive',       // 비활성 회원
  SUSPENDED: 'suspended',     // 정지된 회원
  DELETED: 'deleted'          // 탈퇴한 회원
};

// 성별 정의
export const GENDER = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say'
};

// 회원 등급 정의
export const MEMBERSHIP_TIER = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum'
};

// 기본 사용자 정보 타입
export const UserType = {
  // 기본 정보
  id: '',
  email: '',
  password: '', // 실제로는 해시된 값
  name: '',
  
  // 부가 정보
  phone: '',
  birthDate: '', // YYYY-MM-DD 형식
  gender: GENDER.PREFER_NOT_TO_SAY,
  
  // 시스템 정보
  role: USER_ROLES.USER,
  status: USER_STATUS.ACTIVE,
  membershipTier: MEMBERSHIP_TIER.BRONZE,
  createdAt: '',
  updatedAt: '',
  lastLoginAt: null,
  
  // 통계 정보
  totalSpent: 0,
  orderCount: 0,
  
  // 설정
  emailNotifications: true,
  smsNotifications: true,
  marketingConsent: false,
  
  // 주소 정보 (기본 주소만)
  defaultAddress: null, // AddressType 참조
  
  // 프로필 이미지
  profileImage: null
};

// 로그인용 사용자 정보 (민감한 정보 제외)
export const PublicUserType = {
  id: '',
  email: '',
  name: '',
  phone: '',
  role: USER_ROLES.USER,
  status: USER_STATUS.ACTIVE,
  membershipTier: MEMBERSHIP_TIER.BRONZE,
  profileImage: null,
  defaultAddress: null
};

// 회원가입 폼 데이터 타입
export const UserRegistrationFormType = {
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  phone: '',
  birthDate: '',
  gender: GENDER.PREFER_NOT_TO_SAY,
  emailNotifications: true,
  smsNotifications: true,
  marketingConsent: false,
  termsAccepted: false,
  privacyAccepted: false
};

// 로그인 폼 데이터 타입
export const LoginFormType = {
  email: '',
  password: '',
  rememberMe: false
};

// 프로필 업데이트 폼 데이터 타입
export const ProfileUpdateFormType = {
  name: '',
  phone: '',
  birthDate: '',
  gender: GENDER.PREFER_NOT_TO_SAY,
  emailNotifications: true,
  smsNotifications: true,
  marketingConsent: false
};

// 비밀번호 변경 폼 데이터 타입
export const PasswordChangeFormType = {
  currentPassword: '',
  newPassword: '',
  confirmNewPassword: ''
};

// 회원 등급별 혜택 정의
export const MEMBERSHIP_BENEFITS = {
  [MEMBERSHIP_TIER.BRONZE]: {
    name: '브론즈',
    discountRate: 0,
    freeShippingThreshold: 50000,
    pointsMultiplier: 1.0,
    color: '#CD7F32'
  },
  [MEMBERSHIP_TIER.SILVER]: {
    name: '실버',
    discountRate: 0.03,
    freeShippingThreshold: 30000,
    pointsMultiplier: 1.2,
    color: '#C0C0C0'
  },
  [MEMBERSHIP_TIER.GOLD]: {
    name: '골드',
    discountRate: 0.05,
    freeShippingThreshold: 0,
    pointsMultiplier: 1.5,
    color: '#FFD700'
  },
  [MEMBERSHIP_TIER.PLATINUM]: {
    name: '플래티넘',
    discountRate: 0.1,
    freeShippingThreshold: 0,
    pointsMultiplier: 2.0,
    color: '#E5E4E2'
  }
};

// 등급 승급 조건
export const TIER_UPGRADE_THRESHOLDS = {
  [MEMBERSHIP_TIER.SILVER]: 100000,   // 10만원 이상 구매
  [MEMBERSHIP_TIER.GOLD]: 300000,     // 30만원 이상 구매
  [MEMBERSHIP_TIER.PLATINUM]: 500000  // 50만원 이상 구매
};