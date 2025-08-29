// ========================================
// 예시 상품 데이터 (다양한 카테고리)
// ========================================

import { 
  PRODUCT_STATUS, 
  PRICE_TYPE, 
  OPTION_TYPE,
  createProductOption,
  createOptionValue 
} from '../models/Product';

import { INVENTORY_STATUS } from '../models/Inventory';

// 기존 PZNGR 이미지 import
import DACT from "../components/atoms/Image/DA_CT.jpg";
import DAHS from "../components/atoms/Image/DA_HS.jpg";
import DANV from "../components/atoms/Image/DA_NV.jpg";
import DAOat from "../components/atoms/Image/DA_Oat.jpg";
import DPSBCC from "../components/atoms/Image/DPSB_CC.jpg";
import DPSBHO from "../components/atoms/Image/DPSB_HO.jpg";
import DPSBLN from "../components/atoms/Image/DPSB_LN.jpg";

/**
 * 색상 옵션 생성 헬퍼
 */
const createColorOption = () => {
  const option = createProductOption('색상', OPTION_TYPE.SELECT, true);
  option.values = [
    createOptionValue('스칼렛 오트', 0, DAOat, 10),
    createOptionValue('체스트넛 티라미수', 0, DACT, 8),
    createOptionValue('해리스 더 스카이', 0, DAHS, 12),
    createOptionValue('올드 포레스트', 0, DANV, 6)
  ];
  return option;
};

/**
 * 사이즈 옵션 생성 헬퍼
 */
const createSizeOption = () => {
  const option = createProductOption('사이즈', OPTION_TYPE.SELECT, true);
  option.values = [
    createOptionValue('XS', 0, '', 5),
    createOptionValue('S', 0, '', 15),
    createOptionValue('M', 0, '', 20),
    createOptionValue('L', 0, '', 18),
    createOptionValue('XL', 0, '', 10),
    createOptionValue('XXL', 2000, '', 3)
  ];
  return option;
};

/**
 * 반바지 색상 옵션 생성
 */
const createShortsColorOption = () => {
  const option = createProductOption('색상', OPTION_TYPE.SELECT, true);
  option.values = [
    createOptionValue('할로윈 오렌지', 0, DPSBHO, 8),
    createOptionValue('레몬 네이비', 0, DPSBLN, 12),
    createOptionValue('카카오 크림', 0, DPSBCC, 10)
  ];
  return option;
};

/**
 * 예시 상품 데이터
 */
export const mockProducts = [
  // === PZNGR 의류 상품들 ===
  {
    id: 'prod_001',
    name: 'Doodle Arch T-Shirt',
    description: '편안하고 스타일리시한 PZNGR 시그니처 티셔츠입니다. 고품질 면 소재로 제작되어 일상복으로 완벽합니다.',
    shortDescription: '편안하고 스타일리시한 시그니처 티셔츠',
    brand: 'PZNGR',
    model: 'DA-2024',
    sku: 'PZNGR-DA-001',
    barcode: '8801234567890',
    
    price: {
      regular: 38000,
      sale: 32000,
      discount: 6000,
      discountRate: 15.8,
      currency: 'KRW',
      type: PRICE_TYPE.DISCOUNTED
    },
    
    images: {
      main: DAOat,
      gallery: [DACT, DAHS, DANV, DAOat],
      thumbnail: DAOat,
      hover: DACT
    },
    
    category: {
      main: 'fashion',
      sub: 'tshirts',
      detail: '',
      tags: ['티셔츠', '면', 'PZNGR', '시그니처', '캐주얼']
    },
    
    specifications: {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: 'cm'
      },
      weight: {
        value: 200,
        unit: 'g'
      },
      material: '면 100%',
      color: '다양한 색상',
      origin: '한국',
      manufacturer: 'PZNGR'
    },
    
    options: [createColorOption(), createSizeOption()],
    
    inventory: {
      total: 72,
      available: 65,
      reserved: 7,
      damaged: 0,
      safetyStock: 10,
      reorderPoint: 20,
      maxStock: 100,
      trackStock: true,
      allowBackorder: false
    },
    
    seo: {
      title: 'Doodle Arch T-Shirt - PZNGR 시그니처 티셔츠',
      description: 'PZNGR의 시그니처 Doodle Arch 티셔츠. 편안한 면 소재, 다양한 색상 옵션',
      keywords: ['PZNGR', '티셔츠', 'Doodle Arch', '면티', '캐주얼'],
      slug: 'doodle-arch-tshirt'
    },
    
    shipping: {
      freeShipping: false,
      weight: 200,
      dimensions: {
        width: 30,
        height: 2,
        depth: 25,
        unit: 'cm'
      },
      fee: 3000,
      restrictions: []
    },
    
    display: {
      featured: true,
      newProduct: false,
      bestSeller: true,
      sortOrder: 1,
      startDate: new Date('2024-01-15'),
      endDate: null
    },
    
    stats: {
      viewCount: 1245,
      purchaseCount: 89,
      wishlistCount: 156,
      rating: 4.6,
      reviewCount: 32
    },
    
    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-03-10'),
    createdBy: 'admin_001',
    updatedBy: 'admin_001'
  },

  {
    id: 'prod_002',
    name: 'Doodle Plane SB (Short Pants)',
    description: '활동적인 일상을 위한 편안한 반바지입니다. 통기성이 좋은 소재로 여름철에 완벽합니다.',
    shortDescription: '활동적인 일상을 위한 편안한 반바지',
    brand: 'PZNGR',
    model: 'DPSB-2024',
    sku: 'PZNGR-DPSB-001',
    barcode: '8801234567891',
    
    price: {
      regular: 30000,
      sale: 25000,
      discount: 5000,
      discountRate: 16.7,
      currency: 'KRW',
      type: PRICE_TYPE.DISCOUNTED
    },
    
    images: {
      main: DPSBHO,
      gallery: [DPSBHO, DPSBLN, DPSBCC],
      thumbnail: DPSBHO,
      hover: DPSBLN
    },
    
    category: {
      main: 'fashion',
      sub: 'shorts',
      detail: '',
      tags: ['반바지', '쇼츠', 'PZNGR', '여름', '활동복']
    },
    
    specifications: {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: 'cm'
      },
      weight: {
        value: 180,
        unit: 'g'
      },
      material: '폴리에스터 65%, 면 35%',
      color: '다양한 색상',
      origin: '한국',
      manufacturer: 'PZNGR'
    },
    
    options: [createShortsColorOption(), createSizeOption()],
    
    inventory: {
      total: 45,
      available: 40,
      reserved: 5,
      damaged: 0,
      safetyStock: 8,
      reorderPoint: 15,
      maxStock: 80,
      trackStock: true,
      allowBackorder: false
    },
    
    seo: {
      title: 'Doodle Plane SB 반바지 - PZNGR 여름 컬렉션',
      description: 'PZNGR의 Doodle Plane 반바지. 통기성 좋은 소재, 편안한 착용감',
      keywords: ['PZNGR', '반바지', 'Doodle Plane', '여름옷', '활동복'],
      slug: 'doodle-plane-shorts'
    },
    
    shipping: {
      freeShipping: false,
      weight: 180,
      dimensions: {
        width: 28,
        height: 2,
        depth: 20,
        unit: 'cm'
      },
      fee: 3000,
      restrictions: []
    },
    
    display: {
      featured: true,
      newProduct: true,
      bestSeller: false,
      sortOrder: 2,
      startDate: new Date('2024-03-01'),
      endDate: null
    },
    
    stats: {
      viewCount: 892,
      purchaseCount: 45,
      wishlistCount: 89,
      rating: 4.4,
      reviewCount: 18
    },
    
    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-15'),
    createdBy: 'admin_001',
    updatedBy: 'admin_001'
  },

  // === 전자제품 예시 ===
  {
    id: 'prod_003',
    name: 'iPhone 15 Pro',
    description: 'Apple의 최신 플래그십 스마트폰. A17 Pro 칩셋과 Pro 카메라 시스템을 탑재하여 최고의 성능을 제공합니다.',
    shortDescription: 'Apple 최신 플래그십 스마트폰',
    brand: 'Apple',
    model: 'iPhone 15 Pro',
    sku: 'APPLE-IP15P-001',
    barcode: '0194253000000',
    
    price: {
      regular: 1550000,
      sale: 1550000,
      discount: 0,
      discountRate: 0,
      currency: 'KRW',
      type: PRICE_TYPE.FIXED
    },
    
    images: {
      main: '/images/products/iphone15pro-main.jpg',
      gallery: [
        '/images/products/iphone15pro-1.jpg',
        '/images/products/iphone15pro-2.jpg',
        '/images/products/iphone15pro-3.jpg'
      ],
      thumbnail: '/images/products/iphone15pro-thumb.jpg',
      hover: '/images/products/iphone15pro-hover.jpg'
    },
    
    category: {
      main: 'electronics',
      sub: 'smartphones',
      detail: 'premium',
      tags: ['iPhone', 'Apple', '스마트폰', '프리미엄', '5G']
    },
    
    specifications: {
      dimensions: {
        width: 76.7,
        height: 159.9,
        depth: 8.25,
        unit: 'cm'
      },
      weight: {
        value: 221,
        unit: 'g'
      },
      material: '티타늄, 유리',
      color: '다양한 색상',
      origin: '중국',
      manufacturer: 'Apple Inc.'
    },
    
    options: [
      (() => {
        const option = createProductOption('색상', OPTION_TYPE.SELECT, true);
        option.values = [
          createOptionValue('내추럴 티타늄', 0, '/images/colors/natural-titanium.jpg', 5),
          createOptionValue('블루 티타늄', 0, '/images/colors/blue-titanium.jpg', 8),
          createOptionValue('화이트 티타늄', 0, '/images/colors/white-titanium.jpg', 6),
          createOptionValue('블랙 티타늄', 0, '/images/colors/black-titanium.jpg', 10)
        ];
        return option;
      })(),
      (() => {
        const option = createProductOption('저장용량', OPTION_TYPE.SELECT, true);
        option.values = [
          createOptionValue('128GB', 0, '', 8),
          createOptionValue('256GB', 200000, '', 12),
          createOptionValue('512GB', 400000, '', 6),
          createOptionValue('1TB', 600000, '', 3)
        ];
        return option;
      })()
    ],
    
    inventory: {
      total: 35,
      available: 29,
      reserved: 6,
      damaged: 0,
      safetyStock: 5,
      reorderPoint: 10,
      maxStock: 50,
      trackStock: true,
      allowBackorder: false
    },
    
    seo: {
      title: 'iPhone 15 Pro - Apple 최신 스마트폰',
      description: 'Apple iPhone 15 Pro. A17 Pro 칩셋, Pro 카메라 시스템, 티타늄 디자인',
      keywords: ['iPhone', 'Apple', '스마트폰', 'iPhone15Pro', 'A17Pro'],
      slug: 'iphone-15-pro'
    },
    
    shipping: {
      freeShipping: true,
      weight: 221,
      dimensions: {
        width: 20,
        height: 15,
        depth: 5,
        unit: 'cm'
      },
      fee: 0,
      restrictions: []
    },
    
    display: {
      featured: true,
      newProduct: true,
      bestSeller: true,
      sortOrder: 3,
      startDate: new Date('2024-02-01'),
      endDate: null
    },
    
    stats: {
      viewCount: 3245,
      purchaseCount: 156,
      wishlistCount: 892,
      rating: 4.8,
      reviewCount: 89
    },
    
    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-03-15'),
    createdBy: 'admin_002',
    updatedBy: 'admin_002'
  },

  // === 식품 예시 ===
  {
    id: 'prod_004',
    name: '유기농 블루베리',
    description: '신선하고 달콤한 유기농 블루베리입니다. 항산화 성분이 풍부하여 건강에 좋습니다.',
    shortDescription: '신선하고 달콤한 유기농 블루베리',
    brand: '자연식품',
    model: 'ORGANIC-BB-2024',
    sku: 'ORGANIC-BLUEBERRY-001',
    barcode: '8809876543210',
    
    price: {
      regular: 15000,
      sale: 12000,
      discount: 3000,
      discountRate: 20,
      currency: 'KRW',
      type: PRICE_TYPE.PROMOTION
    },
    
    images: {
      main: '/images/products/blueberry-main.jpg',
      gallery: [
        '/images/products/blueberry-1.jpg',
        '/images/products/blueberry-2.jpg'
      ],
      thumbnail: '/images/products/blueberry-thumb.jpg',
      hover: '/images/products/blueberry-hover.jpg'
    },
    
    category: {
      main: 'food',
      sub: 'fruits',
      detail: 'organic',
      tags: ['블루베리', '유기농', '과일', '신선', '항산화']
    },
    
    specifications: {
      dimensions: {
        width: 15,
        height: 8,
        depth: 12,
        unit: 'cm'
      },
      weight: {
        value: 500,
        unit: 'g'
      },
      material: '유기농 블루베리',
      color: '진한 보라색',
      origin: '한국',
      manufacturer: '자연농장'
    },
    
    options: [
      (() => {
        const option = createProductOption('용량', OPTION_TYPE.SELECT, true);
        option.values = [
          createOptionValue('250g', 0, '', 20),
          createOptionValue('500g', 5000, '', 15),
          createOptionValue('1kg', 8000, '', 8)
        ];
        return option;
      })()
    ],
    
    inventory: {
      total: 50,
      available: 43,
      reserved: 7,
      damaged: 0,
      safetyStock: 10,
      reorderPoint: 15,
      maxStock: 80,
      trackStock: true,
      allowBackorder: false
    },
    
    seo: {
      title: '유기농 블루베리 - 신선한 제철 과일',
      description: '신선하고 달콤한 유기농 블루베리. 항산화 성분 풍부, 건강식품',
      keywords: ['블루베리', '유기농', '과일', '신선식품', '항산화'],
      slug: 'organic-blueberry'
    },
    
    shipping: {
      freeShipping: false,
      weight: 500,
      dimensions: {
        width: 15,
        height: 8,
        depth: 12,
        unit: 'cm'
      },
      fee: 5000,
      restrictions: ['냉장 배송 필요']
    },
    
    display: {
      featured: false,
      newProduct: true,
      bestSeller: false,
      sortOrder: 4,
      startDate: new Date('2024-03-10'),
      endDate: new Date('2024-04-30')
    },
    
    stats: {
      viewCount: 567,
      purchaseCount: 28,
      wishlistCount: 45,
      rating: 4.7,
      reviewCount: 12
    },
    
    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
    createdBy: 'admin_003',
    updatedBy: 'admin_003'
  },

  // === 품절 상품 예시 ===
  {
    id: 'prod_005',
    name: 'Limited Edition Hoodie',
    description: '한정판 후드티입니다. 프리미엄 소재와 특별한 디자인으로 제작되었습니다.',
    shortDescription: '한정판 프리미엄 후드티',
    brand: 'PZNGR',
    model: 'LE-HOODIE-2024',
    sku: 'PZNGR-LEH-001',
    barcode: '8801234567892',
    
    price: {
      regular: 89000,
      sale: 89000,
      discount: 0,
      discountRate: 0,
      currency: 'KRW',
      type: PRICE_TYPE.FIXED
    },
    
    images: {
      main: '/images/products/limited-hoodie-main.jpg',
      gallery: [
        '/images/products/limited-hoodie-1.jpg',
        '/images/products/limited-hoodie-2.jpg'
      ],
      thumbnail: '/images/products/limited-hoodie-thumb.jpg',
      hover: '/images/products/limited-hoodie-hover.jpg'
    },
    
    category: {
      main: 'fashion',
      sub: 'hoodies',
      detail: 'limited',
      tags: ['후드티', '한정판', 'PZNGR', '프리미엄', '스웨트셔츠']
    },
    
    specifications: {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: 'cm'
      },
      weight: {
        value: 450,
        unit: 'g'
      },
      material: '면 80%, 폴리에스터 20%',
      color: '차콜 그레이',
      origin: '한국',
      manufacturer: 'PZNGR'
    },
    
    options: [
      (() => {
        const option = createProductOption('사이즈', OPTION_TYPE.SELECT, true);
        option.values = [
          createOptionValue('S', 0, '', 0),
          createOptionValue('M', 0, '', 0),
          createOptionValue('L', 0, '', 0),
          createOptionValue('XL', 0, '', 0)
        ];
        return option;
      })()
    ],
    
    inventory: {
      total: 0,
      available: 0,
      reserved: 0,
      damaged: 0,
      safetyStock: 0,
      reorderPoint: 0,
      maxStock: 30,
      trackStock: true,
      allowBackorder: true
    },
    
    seo: {
      title: 'Limited Edition Hoodie - PZNGR 한정판',
      description: 'PZNGR 한정판 후드티. 프리미엄 소재, 특별한 디자인',
      keywords: ['후드티', '한정판', 'PZNGR', '프리미엄', '스웨트셔츠'],
      slug: 'limited-edition-hoodie'
    },
    
    shipping: {
      freeShipping: true,
      weight: 450,
      dimensions: {
        width: 35,
        height: 3,
        depth: 30,
        unit: 'cm'
      },
      fee: 0,
      restrictions: []
    },
    
    display: {
      featured: true,
      newProduct: false,
      bestSeller: true,
      sortOrder: 5,
      startDate: new Date('2024-01-01'),
      endDate: null
    },
    
    stats: {
      viewCount: 2156,
      purchaseCount: 89,
      wishlistCount: 456,
      rating: 4.9,
      reviewCount: 67
    },
    
    status: PRODUCT_STATUS.OUT_OF_STOCK,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-03-15'),
    createdBy: 'admin_001',
    updatedBy: 'admin_001'
  }
];

/**
 * 상품 조회 헬퍼 함수들
 */

/**
 * ID로 상품 조회
 * @param {string} productId - 상품 ID
 * @returns {Object|null} 상품 객체
 */
export const getProductById = (productId) => {
  return mockProducts.find(product => product.id === productId) || null;
};

/**
 * SKU로 상품 조회
 * @param {string} sku - SKU 코드
 * @returns {Object|null} 상품 객체
 */
export const getProductBySKU = (sku) => {
  return mockProducts.find(product => product.sku === sku) || null;
};

/**
 * 카테고리별 상품 조회
 * @param {string} categoryId - 카테고리 ID
 * @param {string} level - 카테고리 레벨 ('main', 'sub', 'detail')
 * @returns {Object[]} 상품 배열
 */
export const getProductsByCategory = (categoryId, level = 'main') => {
  return mockProducts.filter(product => product.category[level] === categoryId);
};

/**
 * 브랜드별 상품 조회
 * @param {string} brand - 브랜드명
 * @returns {Object[]} 상품 배열
 */
export const getProductsByBrand = (brand) => {
  return mockProducts.filter(product => 
    product.brand.toLowerCase().includes(brand.toLowerCase())
  );
};

/**
 * 상품 검색 (이름, 설명, 태그)
 * @param {string} query - 검색어
 * @returns {Object[]} 검색 결과 상품 배열
 */
export const searchProducts = (query) => {
  const searchTerm = query.toLowerCase();
  
  return mockProducts.filter(product => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.shortDescription.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  });
};

/**
 * 가격대별 상품 필터링
 * @param {number} minPrice - 최소 가격
 * @param {number} maxPrice - 최대 가격
 * @returns {Object[]} 필터된 상품 배열
 */
export const getProductsByPriceRange = (minPrice, maxPrice) => {
  return mockProducts.filter(product => {
    const price = product.price.sale || product.price.regular;
    return price >= minPrice && price <= maxPrice;
  });
};

/**
 * 추천 상품 조회
 * @returns {Object[]} 추천 상품 배열
 */
export const getFeaturedProducts = () => {
  return mockProducts
    .filter(product => product.display.featured)
    .sort((a, b) => a.display.sortOrder - b.display.sortOrder);
};

/**
 * 신상품 조회
 * @returns {Object[]} 신상품 배열
 */
export const getNewProducts = () => {
  return mockProducts
    .filter(product => product.display.newProduct)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * 베스트셀러 조회
 * @returns {Object[]} 베스트셀러 배열
 */
export const getBestSellers = () => {
  return mockProducts
    .filter(product => product.display.bestSeller)
    .sort((a, b) => b.stats.purchaseCount - a.stats.purchaseCount);
};

/**
 * 상품 통계 계산
 * @returns {Object} 상품 통계
 */
export const getProductStats = () => {
  return {
    totalProducts: mockProducts.length,
    activeProducts: mockProducts.filter(p => p.status === PRODUCT_STATUS.ACTIVE).length,
    outOfStockProducts: mockProducts.filter(p => p.status === PRODUCT_STATUS.OUT_OF_STOCK).length,
    inactiveProducts: mockProducts.filter(p => p.status === PRODUCT_STATUS.INACTIVE).length,
    totalValue: mockProducts.reduce((sum, product) => sum + (product.price.sale || product.price.regular), 0),
    totalInventory: mockProducts.reduce((sum, product) => sum + product.inventory.total, 0),
    averageRating: mockProducts.reduce((sum, product) => sum + product.stats.rating, 0) / mockProducts.length,
    totalReviews: mockProducts.reduce((sum, product) => sum + product.stats.reviewCount, 0),
    brandDistribution: mockProducts.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {}),
    categoryDistribution: mockProducts.reduce((acc, product) => {
      acc[product.category.main] = (acc[product.category.main] || 0) + 1;
      return acc;
    }, {})
  };
};