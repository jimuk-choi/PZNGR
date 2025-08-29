// ========================================
// 더미 사용자 데이터
// ========================================

import { USER_ROLES, USER_STATUS, GENDER, MEMBERSHIP_TIER, ADDRESS_TYPE } from '../types';

// 더미 주소 데이터
export const mockAddresses = [
  {
    id: 'addr_1',
    userId: 'user_1',
    type: ADDRESS_TYPE.HOME,
    recipientName: '김철수',
    recipientPhone: '010-1234-5678',
    zipCode: '06292',
    address: '서울특별시 강남구 테헤란로 123',
    detailAddress: '456호',
    addressAlias: '우리집',
    deliveryNote: '문앞에 두고 가세요',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-15T09:00:00Z'
  },
  {
    id: 'addr_2',
    userId: 'user_1',
    type: ADDRESS_TYPE.OFFICE,
    recipientName: '김철수',
    recipientPhone: '010-1234-5678',
    zipCode: '03181',
    address: '서울특별시 종로구 세종대로 175',
    detailAddress: '10층 1001호',
    addressAlias: '회사',
    deliveryNote: '경비실에 맡겨주세요',
    isDefault: false,
    isActive: true,
    createdAt: '2024-02-01T14:30:00Z',
    updatedAt: '2024-02-01T14:30:00Z'
  },
  {
    id: 'addr_3',
    userId: 'user_2',
    type: ADDRESS_TYPE.HOME,
    recipientName: '박영희',
    recipientPhone: '010-9876-5432',
    zipCode: '48058',
    address: '부산광역시 해운대구 우동 1394',
    detailAddress: '101동 203호',
    addressAlias: '집',
    deliveryNote: '부재시 경비실 보관',
    isDefault: true,
    isActive: true,
    createdAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-01-20T11:15:00Z'
  }
];

// 더미 사용자 데이터
export const mockUsers = [
  {
    // 일반 사용자 1
    id: 'user_1',
    email: 'kimcs@example.com',
    password: 'hashedPassword123!', // 실제로는 해시된 값
    name: '김철수',
    phone: '010-1234-5678',
    birthDate: '1990-05-15',
    gender: GENDER.MALE,
    
    // 시스템 정보
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE,
    membershipTier: MEMBERSHIP_TIER.GOLD,
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-03-10T14:22:00Z',
    lastLoginAt: '2024-03-15T10:30:00Z',
    
    // 통계 정보
    totalSpent: 450000,
    orderCount: 12,
    
    // 설정
    emailNotifications: true,
    smsNotifications: true,
    marketingConsent: true,
    
    // 기본 주소
    defaultAddress: mockAddresses[0],
    
    // 프로필 이미지
    profileImage: null
  },
  
  {
    // 일반 사용자 2
    id: 'user_2',
    email: 'parkyh@example.com',
    password: 'hashedPassword456!',
    name: '박영희',
    phone: '010-9876-5432',
    birthDate: '1988-12-03',
    gender: GENDER.FEMALE,
    
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE,
    membershipTier: MEMBERSHIP_TIER.SILVER,
    createdAt: '2024-01-20T11:15:00Z',
    updatedAt: '2024-03-08T16:45:00Z',
    lastLoginAt: '2024-03-14T09:12:00Z',
    
    totalSpent: 180000,
    orderCount: 7,
    
    emailNotifications: false,
    smsNotifications: true,
    marketingConsent: false,
    
    defaultAddress: mockAddresses[2],
    
    profileImage: null
  },
  
  {
    // 관리자 사용자
    id: 'admin_1',
    email: 'admin@pzngr.com',
    password: 'hashedAdminPassword789!',
    name: '관리자',
    phone: '010-0000-0000',
    birthDate: '1985-03-20',
    gender: GENDER.PREFER_NOT_TO_SAY,
    
    role: USER_ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    membershipTier: MEMBERSHIP_TIER.PLATINUM,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-03-15T12:00:00Z',
    lastLoginAt: '2024-03-15T15:45:00Z',
    
    totalSpent: 0,
    orderCount: 0,
    
    emailNotifications: true,
    smsNotifications: true,
    marketingConsent: false,
    
    defaultAddress: {
      id: 'addr_admin',
      userId: 'admin_1',
      type: ADDRESS_TYPE.OFFICE,
      recipientName: '관리자',
      recipientPhone: '010-0000-0000',
      zipCode: '06292',
      address: '서울특별시 강남구 테헤란로 456',
      detailAddress: 'PZNGR 본사',
      addressAlias: '본사',
      deliveryNote: '관리자 전용',
      isDefault: true,
      isActive: true,
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2023-12-01T00:00:00Z'
    },
    
    profileImage: null
  },
  
  {
    // 신규 사용자 (브론즈)
    id: 'user_3',
    email: 'newuser@example.com',
    password: 'hashedNewPassword!',
    name: '이신규',
    phone: '010-5555-6666',
    birthDate: '1995-08-22',
    gender: GENDER.MALE,
    
    role: USER_ROLES.USER,
    status: USER_STATUS.ACTIVE,
    membershipTier: MEMBERSHIP_TIER.BRONZE,
    createdAt: '2024-03-01T14:20:00Z',
    updatedAt: '2024-03-01T14:20:00Z',
    lastLoginAt: '2024-03-15T08:30:00Z',
    
    totalSpent: 32000,
    orderCount: 1,
    
    emailNotifications: true,
    smsNotifications: false,
    marketingConsent: true,
    
    defaultAddress: {
      id: 'addr_4',
      userId: 'user_3',
      type: ADDRESS_TYPE.HOME,
      recipientName: '이신규',
      recipientPhone: '010-5555-6666',
      zipCode: '13494',
      address: '경기도 성남시 분당구 판교역로 235',
      detailAddress: '102동 1502호',
      addressAlias: '집',
      deliveryNote: '직접 수령',
      isDefault: true,
      isActive: true,
      createdAt: '2024-03-01T14:25:00Z',
      updatedAt: '2024-03-01T14:25:00Z'
    },
    
    profileImage: null
  },
  
  {
    // 정지된 사용자
    id: 'user_4',
    email: 'suspended@example.com',
    password: 'hashedSuspendedPassword!',
    name: '정지자',
    phone: '010-7777-8888',
    birthDate: '1992-11-10',
    gender: GENDER.FEMALE,
    
    role: USER_ROLES.USER,
    status: USER_STATUS.SUSPENDED,
    membershipTier: MEMBERSHIP_TIER.BRONZE,
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-03-10T09:15:00Z',
    lastLoginAt: '2024-03-09T20:45:00Z',
    
    totalSpent: 95000,
    orderCount: 3,
    
    emailNotifications: true,
    smsNotifications: true,
    marketingConsent: false,
    
    defaultAddress: {
      id: 'addr_5',
      userId: 'user_4',
      type: ADDRESS_TYPE.HOME,
      recipientName: '정지자',
      recipientPhone: '010-7777-8888',
      zipCode: '34126',
      address: '대전광역시 유성구 대학로 99',
      detailAddress: '303호',
      addressAlias: '집',
      deliveryNote: '',
      isDefault: true,
      isActive: true,
      createdAt: '2024-02-15T10:35:00Z',
      updatedAt: '2024-02-15T10:35:00Z'
    },
    
    profileImage: null
  }
];

// 사용자 조회 헬퍼 함수들
export const getUserById = (userId) => {
  return mockUsers.find(user => user.id === userId);
};

export const getUserByEmail = (email) => {
  return mockUsers.find(user => user.email === email);
};

export const getActiveUsers = () => {
  return mockUsers.filter(user => user.status === USER_STATUS.ACTIVE);
};

export const getUsersByRole = (role) => {
  return mockUsers.filter(user => user.role === role);
};

export const getUsersByTier = (tier) => {
  return mockUsers.filter(user => user.membershipTier === tier);
};

// 주소 조회 헬퍼 함수들
export const getAddressesByUserId = (userId) => {
  return mockAddresses.filter(address => address.userId === userId);
};

export const getDefaultAddress = (userId) => {
  return mockAddresses.find(address => address.userId === userId && address.isDefault);
};

// 사용자 통계 함수들
export const getUserStats = () => {
  return {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(user => user.status === USER_STATUS.ACTIVE).length,
    suspendedUsers: mockUsers.filter(user => user.status === USER_STATUS.SUSPENDED).length,
    adminUsers: mockUsers.filter(user => user.role === USER_ROLES.ADMIN).length,
    totalRevenue: mockUsers.reduce((sum, user) => sum + user.totalSpent, 0),
    tierDistribution: {
      [MEMBERSHIP_TIER.BRONZE]: mockUsers.filter(user => user.membershipTier === MEMBERSHIP_TIER.BRONZE).length,
      [MEMBERSHIP_TIER.SILVER]: mockUsers.filter(user => user.membershipTier === MEMBERSHIP_TIER.SILVER).length,
      [MEMBERSHIP_TIER.GOLD]: mockUsers.filter(user => user.membershipTier === MEMBERSHIP_TIER.GOLD).length,
      [MEMBERSHIP_TIER.PLATINUM]: mockUsers.filter(user => user.membershipTier === MEMBERSHIP_TIER.PLATINUM).length
    }
  };
};