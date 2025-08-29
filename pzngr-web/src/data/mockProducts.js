// ========================================
// 예시 상품 데이터 (다양한 카테고리)
// ========================================

import {
  PRODUCT_STATUS,
  PRICE_TYPE,
  OPTION_TYPE,
  createProductOption,
  createOptionValue,
} from "../models/Product";

// import { INVENTORY_STATUS } from '../models/Inventory'; // 현재 미사용

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
  const option = createProductOption("색상", OPTION_TYPE.SELECT, true);
  option.values = [
    createOptionValue("스칼렛 오트", 0, DAOat, 10),
    createOptionValue("체스트넛 티라미수", 0, DACT, 8),
    createOptionValue("해리스 더 스카이", 0, DAHS, 12),
    createOptionValue("올드 포레스트", 0, DANV, 6),
  ];
  return option;
};

/**
 * 사이즈 옵션 생성 헬퍼
 */
const createSizeOption = () => {
  const option = createProductOption("사이즈", OPTION_TYPE.SELECT, true);
  option.values = [
    createOptionValue("XS", 0, "", 5),
    createOptionValue("S", 0, "", 15),
    createOptionValue("M", 0, "", 20),
    createOptionValue("L", 0, "", 18),
    createOptionValue("XL", 0, "", 10),
    createOptionValue("XXL", 2000, "", 3),
  ];
  return option;
};

/**
 * 가방(SB) 색상 옵션 생성
 */
const createBagColorOption = () => {
  const option = createProductOption("색상", OPTION_TYPE.SELECT, true);
  option.values = [
    createOptionValue("할로윈 오렌지", 0, DPSBHO, 8),
    createOptionValue("레몬 네이비", 0, DPSBLN, 12),
    createOptionValue("카카오 크림", 0, DPSBCC, 10),
  ];
  return option;
};

/**
 * 예시 상품 데이터
 */
export const mockProducts = [
  // === PZNGR 의류 상품들 ===
  {
    id: "prod_001",
    name: "Doodle Arch T-Shirt - Scarlet Oat",
    description: "설명.",
    shortDescription: "편안하고 스타일리시한 시그니처 티셔츠",
    brand: "PZNGR",
    model: "DA-2024",
    sku: "PZNGR-DA-001",
    barcode: "8801234567890",

    price: {
      regular: 38000,
      sale: 32000,
      discount: 6000,
      discountRate: 15.8,
      currency: "KRW",
      type: PRICE_TYPE.DISCOUNTED,
    },

    images: {
      main: DAOat,
      gallery: [DACT, DAHS, DANV, DAOat],
      thumbnail: DAOat,
      hover: DACT,
    },

    category: {
      main: "fashion",
      sub: "tshirts",
      detail: "",
      tags: ["티셔츠", "면", "PZNGR", "시그니처", "캐주얼"],
    },

    specifications: {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: "cm",
      },
      weight: {
        value: 200,
        unit: "g",
      },
      material: "면 100%",
      color: "다양한 색상",
      origin: "한국",
      manufacturer: "PZNGR",
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
      allowBackorder: false,
    },

    seo: {
      title: "Doodle Arch T-Shirt - PZNGR 시그니처 티셔츠",
      description:
        "PZNGR의 시그니처 Doodle Arch 티셔츠. 편안한 면 소재, 다양한 색상 옵션",
      keywords: ["PZNGR", "티셔츠", "Doodle Arch", "면티", "캐주얼"],
      slug: "001",
    },

    shipping: {
      freeShipping: false,
      weight: 200,
      dimensions: {
        width: 30,
        height: 2,
        depth: 25,
        unit: "cm",
      },
      fee: 3000,
      restrictions: [],
    },

    display: {
      featured: true,
      newProduct: false,
      bestSeller: true,
      sortOrder: 1,
      startDate: new Date("2024-01-15"),
      endDate: null,
    },

    stats: {
      viewCount: 1245,
      purchaseCount: 89,
      wishlistCount: 156,
      rating: 4.6,
      reviewCount: 32,
    },

    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-03-10"),
    createdBy: "admin_001",
    updatedBy: "admin_001",
  },
  {
    id: "prod_002",
    name: "Doodle Arch T-Shirt - Chestnut Tiramisu",
    description: "설명",
    shortDescription: "활동적인 일상을 위한 편리한 숄더백",
    brand: "PZNGR",
    model: "DPSB-2024",
    sku: "PZNGR-DPSB-001",
    barcode: "8801234567891",

    price: {
      regular: 32000,
      sale: 32000,
      discount: 0,
      discountRate: 0,
      currency: "KRW",
      type: PRICE_TYPE.FIXED,
    },

    images: {
      main: DACT,
      gallery: [DACT, DAHS, DANV, DAOat],
      thumbnail: DACT,
      hover: DACT,
    },
    /* images: {
      main: DPSBHO,
      gallery: [DPSBHO, DPSBLN, DPSBCC],
      thumbnail: DPSBHO,
      hover: DPSBLN,
    }, */

    category: {
      main: "fashion",
      sub: "bags",
      detail: "",
      tags: ["숄더백", "가방", "PZNGR", "액세서리", "실용적"],
    },

    specifications: {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: "cm",
      },
      weight: {
        value: 180,
        unit: "g",
      },
      material: "캔버스 소재",
      color: "다양한 색상",
      origin: "한국",
      manufacturer: "PZNGR",
    },

    options: [createBagColorOption()],

    inventory: {
      total: 45,
      available: 40,
      reserved: 5,
      damaged: 0,
      safetyStock: 8,
      reorderPoint: 15,
      maxStock: 80,
      trackStock: true,
      allowBackorder: false,
    },

    seo: {
      title: "Doodle Plane SB 숄더백 - PZNGR 액세서리 컬렉션",
      description:
        "PZNGR의 Doodle Plane 숄더백. 실용적인 디자인, 편리한 사용감",
      keywords: ["PZNGR", "숄더백", "Doodle Plane", "가방", "액세서리"],
      slug: "002",
    },

    shipping: {
      freeShipping: false,
      weight: 180,
      dimensions: {
        width: 28,
        height: 2,
        depth: 20,
        unit: "cm",
      },
      fee: 3000,
      restrictions: [],
    },

    display: {
      featured: true,
      newProduct: true,
      bestSeller: false,
      sortOrder: 2,
      startDate: new Date("2024-03-01"),
      endDate: null,
    },

    stats: {
      viewCount: 892,
      purchaseCount: 45,
      wishlistCount: 89,
      rating: 4.4,
      reviewCount: 18,
    },

    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-15"),
    createdBy: "admin_001",
    updatedBy: "admin_001",
  },
  {
    id: "prod_003",
    name: "Doodle Arch T-Shirt - Harris The Sky",
    description: "편안하고 스타일리시한 PZNGR 시그니처 티셔츠입니다.",
    shortDescription: "편안하고 스타일리시한 시그니처 티셔츠",
    brand: "PZNGR",
    model: "DPSB-2024",
    sku: "PZNGR-DPSB-001",
    barcode: "8801234567891",

    price: {
      regular: 32000,
      sale: 32000,
      discount: 0,
      discountRate: 0,
      currency: "KRW",
      type: PRICE_TYPE.FIXED,
    },

    images: {
      main: DAHS,
      gallery: [DACT, DAHS, DANV, DAOat],
      thumbnail: DAHS,
      hover: DAHS,
    },
    /* images: {
      main: DPSBHO,
      gallery: [DPSBHO, DPSBLN, DPSBCC],
      thumbnail: DPSBHO,
      hover: DPSBLN,
    }, */

    category: {
      main: "fashion",
      sub: "bags",
      detail: "",
      tags: ["숄더백", "가방", "PZNGR", "액세서리", "실용적"],
    },

    specifications: {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: "cm",
      },
      weight: {
        value: 180,
        unit: "g",
      },
      material: "캔버스 소재",
      color: "다양한 색상",
      origin: "한국",
      manufacturer: "PZNGR",
    },

    options: [createBagColorOption()],

    inventory: {
      total: 45,
      available: 40,
      reserved: 5,
      damaged: 0,
      safetyStock: 8,
      reorderPoint: 15,
      maxStock: 80,
      trackStock: true,
      allowBackorder: false,
    },

    seo: {
      title: "Doodle Plane SB 숄더백 - PZNGR 액세서리 컬렉션",
      description:
        "PZNGR의 Doodle Plane 숄더백. 실용적인 디자인, 편리한 사용감",
      keywords: ["PZNGR", "숄더백", "Doodle Plane", "가방", "액세서리"],
      slug: "003",
    },

    shipping: {
      freeShipping: false,
      weight: 200,
      dimensions: {
        width: 30,
        height: 2,
        depth: 25,
        unit: "cm",
      },
      fee: 3000,
      restrictions: [],
    },

    display: {
      featured: true,
      newProduct: true,
      bestSeller: false,
      sortOrder: 3,
      startDate: new Date("2024-03-01"),
      endDate: null,
    },

    stats: {
      viewCount: 892,
      purchaseCount: 45,
      wishlistCount: 89,
      rating: 4.4,
      reviewCount: 18,
    },

    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-15"),
    createdBy: "admin_001",
    updatedBy: "admin_001",
  },
  {
    id: "prod_004",
    name: "Doodle Arch T-Shirt - Old Forest",
    description: "편안하고 스타일리시한 PZNGR 시그니처 티셔츠입니다.",
    shortDescription: "편안하고 스타일리시한 시그니처 티셔츠",
    brand: "PZNGR",
    model: "DPSB-2024",
    sku: "PZNGR-DPSB-001",
    barcode: "8801234567891",

    price: {
      regular: 32000,
      sale: 32000,
      discount: 0,
      discountRate: 0,
      currency: "KRW",
      type: PRICE_TYPE.FIXED,
    },

    images: {
      main: DANV,
      gallery: [DACT, DAHS, DANV, DAOat],
      thumbnail: DANV,
      hover: DANV,
    },
    /* images: {
      main: DPSBHO,
      gallery: [DPSBHO, DPSBLN, DPSBCC],
      thumbnail: DPSBHO,
      hover: DPSBLN,
    }, */

    category: {
      main: "fashion",
      sub: "bags",
      detail: "",
      tags: ["숄더백", "가방", "PZNGR", "액세서리", "실용적"],
    },

    specifications: {
      dimensions: {
        width: 0,
        height: 0,
        depth: 0,
        unit: "cm",
      },
      weight: {
        value: 180,
        unit: "g",
      },
      material: "캔버스 소재",
      color: "다양한 색상",
      origin: "한국",
      manufacturer: "PZNGR",
    },

    options: [createBagColorOption()],

    inventory: {
      total: 45,
      available: 40,
      reserved: 5,
      damaged: 0,
      safetyStock: 8,
      reorderPoint: 15,
      maxStock: 80,
      trackStock: true,
      allowBackorder: false,
    },

    seo: {
      title: "Doodle Plane SB 숄더백 - PZNGR 액세서리 컬렉션",
      description:
        "PZNGR의 Doodle Plane 숄더백. 실용적인 디자인, 편리한 사용감",
      keywords: ["PZNGR", "숄더백", "Doodle Plane", "가방", "액세서리"],
      slug: "004",
    },

    shipping: {
      freeShipping: false,
      weight: 200,
      dimensions: {
        width: 30,
        height: 2,
        depth: 25,
        unit: "cm",
      },
      fee: 3000,
      restrictions: [],
    },

    display: {
      featured: true,
      newProduct: true,
      bestSeller: false,
      sortOrder: 3,
      startDate: new Date("2024-03-01"),
      endDate: null,
    },

    stats: {
      viewCount: 892,
      purchaseCount: 45,
      wishlistCount: 89,
      rating: 4.4,
      reviewCount: 18,
    },

    status: PRODUCT_STATUS.ACTIVE,
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-03-15"),
    createdBy: "admin_001",
    updatedBy: "admin_001",
  },
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
  return mockProducts.find((product) => product.id === productId) || null;
};

/**
 * SKU로 상품 조회
 * @param {string} sku - SKU 코드
 * @returns {Object|null} 상품 객체
 */
export const getProductBySKU = (sku) => {
  return mockProducts.find((product) => product.sku === sku) || null;
};

/**
 * 카테고리별 상품 조회
 * @param {string} categoryId - 카테고리 ID
 * @param {string} level - 카테고리 레벨 ('main', 'sub', 'detail')
 * @returns {Object[]} 상품 배열
 */
export const getProductsByCategory = (categoryId, level = "main") => {
  return mockProducts.filter(
    (product) => product.category[level] === categoryId
  );
};

/**
 * 브랜드별 상품 조회
 * @param {string} brand - 브랜드명
 * @returns {Object[]} 상품 배열
 */
export const getProductsByBrand = (brand) => {
  return mockProducts.filter((product) =>
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

  return mockProducts.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.shortDescription.toLowerCase().includes(searchTerm) ||
      product.brand.toLowerCase().includes(searchTerm) ||
      product.category.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm)
      )
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
  return mockProducts.filter((product) => {
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
    .filter((product) => product.display.featured)
    .sort((a, b) => a.display.sortOrder - b.display.sortOrder);
};

/**
 * 신상품 조회
 * @returns {Object[]} 신상품 배열
 */
export const getNewProducts = () => {
  return mockProducts
    .filter((product) => product.display.newProduct)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

/**
 * 베스트셀러 조회
 * @returns {Object[]} 베스트셀러 배열
 */
export const getBestSellers = () => {
  return mockProducts
    .filter((product) => product.display.bestSeller)
    .sort((a, b) => b.stats.purchaseCount - a.stats.purchaseCount);
};

/**
 * 상품 통계 계산
 * @returns {Object} 상품 통계
 */
export const getProductStats = () => {
  return {
    totalProducts: mockProducts.length,
    activeProducts: mockProducts.filter(
      (p) => p.status === PRODUCT_STATUS.ACTIVE
    ).length,
    outOfStockProducts: mockProducts.filter(
      (p) => p.status === PRODUCT_STATUS.OUT_OF_STOCK
    ).length,
    inactiveProducts: mockProducts.filter(
      (p) => p.status === PRODUCT_STATUS.INACTIVE
    ).length,
    totalValue: mockProducts.reduce(
      (sum, product) => sum + (product.price.sale || product.price.regular),
      0
    ),
    totalInventory: mockProducts.reduce(
      (sum, product) => sum + product.inventory.total,
      0
    ),
    averageRating:
      mockProducts.reduce((sum, product) => sum + product.stats.rating, 0) /
      mockProducts.length,
    totalReviews: mockProducts.reduce(
      (sum, product) => sum + product.stats.reviewCount,
      0
    ),
    brandDistribution: mockProducts.reduce((acc, product) => {
      acc[product.brand] = (acc[product.brand] || 0) + 1;
      return acc;
    }, {}),
    categoryDistribution: mockProducts.reduce((acc, product) => {
      acc[product.category.main] = (acc[product.category.main] || 0) + 1;
      return acc;
    }, {}),
  };
};
