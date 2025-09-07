import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createEmptyCoupon, validateCoupon, calculateDiscount, COUPON_STATUS, generateCouponCode } from '../models/Coupon';

const DEFAULT_COUPONS = [
  {
    id: 'coupon_new_member_10',
    code: 'NEWBIE10',
    name: '신규 회원 10% 할인',
    description: '첫 주문 시 사용 가능한 10% 할인 쿠폰입니다.',
    type: 'percentage',
    discountValue: 10,
    maxDiscountAmount: 10000,
    minOrderAmount: 50000,
    usage: {
      limit: 1000,
      limitPerUser: 1,
      used: 15
    },
    validity: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
      isAlwaysValid: false
    },
    conditions: [
      { 
        id: 'condition_first_order',
        type: 'first_order', 
        value: true 
      }
    ],
    target: {
      categories: [],
      products: [],
      excludeDiscountedItems: false
    },
    display: {
      isPublic: true,
      showInList: true,
      bannerImage: '',
      backgroundColor: '#4CAF50'
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin'
  },
  {
    id: 'coupon_5000_off',
    code: 'SAVE5000',
    name: '5만원 이상 5000원 할인',
    description: '5만원 이상 주문시 5000원을 할인해드립니다.',
    type: 'fixed_amount',
    discountValue: 5000,
    maxDiscountAmount: 0,
    minOrderAmount: 50000,
    usage: {
      limit: 500,
      limitPerUser: 3,
      used: 87
    },
    validity: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-06-30'),
      isAlwaysValid: false
    },
    conditions: [
      {
        id: 'condition_min_amount',
        type: 'min_order_amount',
        value: 50000
      }
    ],
    target: {
      categories: [],
      products: [],
      excludeDiscountedItems: true
    },
    display: {
      isPublic: true,
      showInList: true,
      bannerImage: '',
      backgroundColor: '#FF9800'
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin'
  },
  {
    id: 'coupon_free_shipping',
    code: 'FREESHIP',
    name: '무료배송 쿠폰',
    description: '3만원 이상 주문시 무료배송 혜택을 받으세요.',
    type: 'free_shipping',
    discountValue: 0,
    maxDiscountAmount: 0,
    minOrderAmount: 30000,
    usage: {
      limit: 0,
      limitPerUser: 1,
      used: 234
    },
    validity: {
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
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
      backgroundColor: '#2196F3'
    },
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    createdBy: 'admin'
  }
];

export const useCouponStore = create(
  persist(
    (set, get) => ({
      coupons: DEFAULT_COUPONS,
      userCoupons: {},
      
      getAllCoupons: () => {
        return get().coupons;
      },
      
      getActiveCoupons: () => {
        return get().coupons.filter(coupon => coupon.status === COUPON_STATUS.ACTIVE);
      },
      
      getPublicCoupons: () => {
        return get().coupons.filter(coupon => 
          coupon.status === COUPON_STATUS.ACTIVE && 
          coupon.display.isPublic &&
          coupon.display.showInList
        );
      },
      
      getCouponById: (couponId) => {
        return get().coupons.find(coupon => coupon.id === couponId);
      },
      
      getCouponByCode: (code) => {
        return get().coupons.find(coupon => 
          coupon.code.toLowerCase() === code.toLowerCase() &&
          coupon.status === COUPON_STATUS.ACTIVE
        );
      },
      
      addCoupon: (couponData) => {
        const newCoupon = {
          ...createEmptyCoupon(),
          ...couponData,
          id: couponData.id || `coupon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          code: couponData.code || generateCouponCode(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          coupons: [...state.coupons, newCoupon]
        }));
        
        return newCoupon.id;
      },
      
      updateCoupon: (couponId, updates) => {
        set((state) => ({
          coupons: state.coupons.map(coupon =>
            coupon.id === couponId
              ? {
                  ...coupon,
                  ...updates,
                  updatedAt: new Date()
                }
              : coupon
          )
        }));
      },
      
      removeCoupon: (couponId) => {
        set((state) => ({
          coupons: state.coupons.filter(coupon => coupon.id !== couponId)
        }));
      },
      
      duplicateCoupon: (couponId) => {
        const coupon = get().getCouponById(couponId);
        if (!coupon) return null;
        
        const duplicatedCoupon = {
          ...coupon,
          id: `coupon_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          code: generateCouponCode(),
          name: `${coupon.name} (복사본)`,
          usage: {
            ...coupon.usage,
            used: 0
          },
          status: COUPON_STATUS.INACTIVE,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        set((state) => ({
          coupons: [...state.coupons, duplicatedCoupon]
        }));
        
        return duplicatedCoupon.id;
      },
      
      validateCouponUsage: (couponCode, orderAmount = 0, orderCategories = [], orderProducts = [], userId = null) => {
        const coupon = get().getCouponByCode(couponCode);
        if (!coupon) {
          return { valid: false, reason: '존재하지 않는 쿠폰 코드입니다.' };
        }
        
        const validation = validateCoupon(coupon, orderAmount, orderCategories, orderProducts);
        if (!validation.valid) {
          return validation;
        }
        
        if (userId && coupon.usage.limitPerUser > 0) {
          const userUsageCount = get().getUserCouponUsageCount(userId, coupon.id);
          if (userUsageCount >= coupon.usage.limitPerUser) {
            return { 
              valid: false, 
              reason: `이 쿠폰은 사용자당 최대 ${coupon.usage.limitPerUser}회만 사용 가능합니다.` 
            };
          }
        }
        
        return { valid: true, coupon };
      },
      
      applyCoupon: (couponCode, orderAmount, orderItems = [], userId = null) => {
        const validation = get().validateCouponUsage(couponCode, orderAmount, [], [], userId);
        if (!validation.valid) {
          return { success: false, message: validation.reason };
        }
        
        const discountInfo = calculateDiscount(validation.coupon, orderAmount, orderItems);
        
        return {
          success: true,
          coupon: validation.coupon,
          discountAmount: discountInfo.discountAmount,
          finalAmount: discountInfo.finalAmount,
          savings: discountInfo.discountAmount
        };
      },
      
      useCoupon: (couponId, userId = null) => {
        const coupon = get().getCouponById(couponId);
        if (!coupon) return false;
        
        set((state) => ({
          coupons: state.coupons.map(c =>
            c.id === couponId
              ? {
                  ...c,
                  usage: {
                    ...c.usage,
                    used: c.usage.used + 1
                  },
                  updatedAt: new Date()
                }
              : c
          )
        }));
        
        if (userId) {
          set((state) => ({
            userCoupons: {
              ...state.userCoupons,
              [userId]: [
                ...(state.userCoupons[userId] || []),
                {
                  couponId,
                  usedAt: new Date(),
                  orderId: null
                }
              ]
            }
          }));
        }
        
        return true;
      },
      
      getUserCouponUsageCount: (userId, couponId) => {
        const userCoupons = get().userCoupons[userId] || [];
        return userCoupons.filter(usage => usage.couponId === couponId).length;
      },
      
      getUserCouponHistory: (userId) => {
        return get().userCoupons[userId] || [];
      },
      
      updateCouponStatus: (couponId, status) => {
        get().updateCoupon(couponId, { status });
      },
      
      incrementCouponUsage: (couponId) => {
        const coupon = get().getCouponById(couponId);
        if (coupon) {
          get().updateCoupon(couponId, {
            usage: {
              ...coupon.usage,
              used: coupon.usage.used + 1
            }
          });
        }
      },
      
      searchCoupons: (searchTerm) => {
        if (!searchTerm) return get().coupons;
        
        const term = searchTerm.toLowerCase();
        return get().coupons.filter(coupon =>
          coupon.name.toLowerCase().includes(term) ||
          coupon.code.toLowerCase().includes(term) ||
          coupon.description.toLowerCase().includes(term)
        );
      },
      
      getCouponStatistics: () => {
        const coupons = get().coupons;
        return {
          total: coupons.length,
          active: coupons.filter(c => c.status === COUPON_STATUS.ACTIVE).length,
          inactive: coupons.filter(c => c.status === COUPON_STATUS.INACTIVE).length,
          expired: coupons.filter(c => c.status === COUPON_STATUS.EXPIRED).length,
          exhausted: coupons.filter(c => c.status === COUPON_STATUS.EXHAUSTED).length,
          totalUsed: coupons.reduce((sum, c) => sum + c.usage.used, 0)
        };
      },
      
      getExpiringSoonCoupons: (days = 7) => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + days);
        
        return get().coupons.filter(coupon =>
          coupon.status === COUPON_STATUS.ACTIVE &&
          !coupon.validity.isAlwaysValid &&
          new Date(coupon.validity.endDate) <= targetDate &&
          new Date(coupon.validity.endDate) >= new Date()
        );
      },
      
      getCouponsByCategory: (categoryId) => {
        return get().coupons.filter(coupon =>
          coupon.status === COUPON_STATUS.ACTIVE &&
          (coupon.target.categories.length === 0 || coupon.target.categories.includes(categoryId))
        );
      },
      
      getCouponsByProduct: (productId) => {
        return get().coupons.filter(coupon =>
          coupon.status === COUPON_STATUS.ACTIVE &&
          (coupon.target.products.length === 0 || coupon.target.products.includes(productId))
        );
      },
      
      checkExpiredCoupons: () => {
        const now = new Date();
        set((state) => ({
          coupons: state.coupons.map(coupon => {
            if (coupon.status === COUPON_STATUS.ACTIVE &&
                !coupon.validity.isAlwaysValid &&
                new Date(coupon.validity.endDate) < now) {
              return {
                ...coupon,
                status: COUPON_STATUS.EXPIRED,
                updatedAt: new Date()
              };
            }
            if (coupon.status === COUPON_STATUS.ACTIVE &&
                coupon.usage.limit > 0 &&
                coupon.usage.used >= coupon.usage.limit) {
              return {
                ...coupon,
                status: COUPON_STATUS.EXHAUSTED,
                updatedAt: new Date()
              };
            }
            return coupon;
          })
        }));
      },
      
      bulkUpdateCoupons: (couponIds, updates) => {
        set((state) => ({
          coupons: state.coupons.map(coupon =>
            couponIds.includes(coupon.id)
              ? {
                  ...coupon,
                  ...updates,
                  updatedAt: new Date()
                }
              : coupon
          )
        }));
      },
      
      resetStore: () => {
        set({
          coupons: DEFAULT_COUPONS,
          userCoupons: {}
        });
      }
    }),
    {
      name: 'coupon-store',
      version: 1
    }
  )
);