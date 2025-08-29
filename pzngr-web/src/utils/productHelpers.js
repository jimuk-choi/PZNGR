// ========================================
// 상품 CRUD 헬퍼 함수들
// ========================================

import { 
  createEmptyProduct, 
  PRODUCT_STATUS,
  createProductOption,
  createOptionValue 
} from '../models/Product';
import { validateProduct, validateUniqueSKU } from './productValidation';

/**
 * 새 상품 생성
 * @param {Object} productData - 상품 데이터
 * @param {Object[]} existingProducts - 기존 상품 목록 (SKU 중복 검사용)
 * @returns {Object} 결과 { success: boolean, product?: Object, errors?: Object }
 */
export const createProduct = (productData, existingProducts = []) => {
  // 기본값과 병합
  const product = { ...createEmptyProduct(), ...productData };
  
  // ID가 없으면 생성
  if (!product.id) {
    product.id = `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // 현재 시간으로 생성/수정일 설정
  const now = new Date();
  product.createdAt = now;
  product.updatedAt = now;
  
  // 데이터 검증
  const validation = validateProduct(product);
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  // SKU 중복 검사
  const skuValidation = validateUniqueSKU(product.sku, existingProducts);
  if (!skuValidation.isValid) {
    return {
      success: false,
      errors: { sku: skuValidation.message }
    };
  }
  
  // 슬러그 자동 생성 (SEO용)
  if (!product.seo.slug) {
    product.seo.slug = generateSlug(product.name);
  }
  
  // SEO 제목이 없으면 상품명으로 설정
  if (!product.seo.title) {
    product.seo.title = product.name;
  }
  
  return {
    success: true,
    product
  };
};

/**
 * 상품 정보 수정
 * @param {string} productId - 상품 ID
 * @param {Object} updateData - 수정할 데이터
 * @param {Object[]} existingProducts - 기존 상품 목록
 * @returns {Object} 결과 { success: boolean, product?: Object, errors?: Object }
 */
export const updateProduct = (productId, updateData, existingProducts = []) => {
  // 기존 상품 찾기
  const existingProduct = existingProducts.find(p => p.id === productId);
  if (!existingProduct) {
    return {
      success: false,
      errors: { general: '상품을 찾을 수 없습니다.' }
    };
  }
  
  // 데이터 병합
  const updatedProduct = {
    ...existingProduct,
    ...updateData,
    id: productId, // ID는 변경 불가
    createdAt: existingProduct.createdAt, // 생성일은 변경 불가
    updatedAt: new Date() // 수정일은 현재 시간으로
  };
  
  // 데이터 검증
  const validation = validateProduct(updatedProduct);
  if (!validation.isValid) {
    return {
      success: false,
      errors: validation.errors
    };
  }
  
  // SKU 중복 검사 (자기 자신 제외)
  if (updateData.sku && updateData.sku !== existingProduct.sku) {
    const skuValidation = validateUniqueSKU(updateData.sku, existingProducts, productId);
    if (!skuValidation.isValid) {
      return {
        success: false,
        errors: { sku: skuValidation.message }
      };
    }
  }
  
  return {
    success: true,
    product: updatedProduct
  };
};

/**
 * 상품 삭제 (실제로는 상태만 변경)
 * @param {string} productId - 상품 ID
 * @param {Object[]} existingProducts - 기존 상품 목록
 * @param {boolean} softDelete - 소프트 삭제 여부 (기본값: true)
 * @returns {Object} 결과 { success: boolean, message: string }
 */
export const deleteProduct = (productId, existingProducts = [], softDelete = true) => {
  const product = existingProducts.find(p => p.id === productId);
  if (!product) {
    return {
      success: false,
      message: '상품을 찾을 수 없습니다.'
    };
  }
  
  if (softDelete) {
    // 소프트 삭제: 상태만 변경
    product.status = PRODUCT_STATUS.DISCONTINUED;
    product.updatedAt = new Date();
    
    return {
      success: true,
      message: '상품이 단종 처리되었습니다.'
    };
  } else {
    // 실제 삭제는 배열에서 제거하는 것으로 구현
    return {
      success: true,
      message: '상품이 영구 삭제되었습니다.'
    };
  }
};

/**
 * 재고 업데이트
 * @param {string} productId - 상품 ID
 * @param {Object} inventoryUpdate - 재고 업데이트 정보
 * @param {Object[]} existingProducts - 기존 상품 목록
 * @returns {Object} 결과 { success: boolean, product?: Object, message: string }
 */
export const updateProductInventory = (productId, inventoryUpdate, existingProducts = []) => {
  const productIndex = existingProducts.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return {
      success: false,
      message: '상품을 찾을 수 없습니다.'
    };
  }
  
  const product = { ...existingProducts[productIndex] };
  
  // 재고 정보 업데이트
  product.inventory = {
    ...product.inventory,
    ...inventoryUpdate,
    updatedAt: new Date()
  };
  
  // 재고 상태에 따라 상품 상태 자동 변경
  if (product.inventory.available <= 0) {
    product.status = PRODUCT_STATUS.OUT_OF_STOCK;
  } else if (product.status === PRODUCT_STATUS.OUT_OF_STOCK) {
    product.status = PRODUCT_STATUS.ACTIVE;
  }
  
  product.updatedAt = new Date();
  
  return {
    success: true,
    product,
    message: '재고 정보가 업데이트되었습니다.'
  };
};

/**
 * 상품 정렬
 * @param {Object[]} products - 상품 배열
 * @param {string} sortBy - 정렬 기준 ('name', 'price', 'created', 'updated', 'rating', 'sales')
 * @param {string} sortOrder - 정렬 순서 ('asc', 'desc')
 * @returns {Object[]} 정렬된 상품 배열
 */
export const sortProducts = (products, sortBy = 'created', sortOrder = 'desc') => {
  const sortedProducts = [...products];
  
  sortedProducts.sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'name':
        valueA = a.name.toLowerCase();
        valueB = b.name.toLowerCase();
        break;
      case 'price':
        valueA = a.price.sale || a.price.regular;
        valueB = b.price.sale || b.price.regular;
        break;
      case 'created':
        valueA = new Date(a.createdAt);
        valueB = new Date(b.createdAt);
        break;
      case 'updated':
        valueA = new Date(a.updatedAt);
        valueB = new Date(b.updatedAt);
        break;
      case 'rating':
        valueA = a.stats.rating;
        valueB = b.stats.rating;
        break;
      case 'sales':
        valueA = a.stats.purchaseCount;
        valueB = b.stats.purchaseCount;
        break;
      case 'views':
        valueA = a.stats.viewCount;
        valueB = b.stats.viewCount;
        break;
      default:
        valueA = a.display.sortOrder || 0;
        valueB = b.display.sortOrder || 0;
    }
    
    if (sortOrder === 'asc') {
      if (valueA < valueB) return -1;
      if (valueA > valueB) return 1;
      return 0;
    } else {
      if (valueA > valueB) return -1;
      if (valueA < valueB) return 1;
      return 0;
    }
  });
  
  return sortedProducts;
};

/**
 * 상품 필터링
 * @param {Object[]} products - 상품 배열
 * @param {Object} filters - 필터 조건
 * @returns {Object[]} 필터된 상품 배열
 */
export const filterProducts = (products, filters = {}) => {
  return products.filter(product => {
    // 카테고리 필터
    if (filters.category && product.category.main !== filters.category) {
      return false;
    }
    
    // 하위 카테고리 필터
    if (filters.subCategory && product.category.sub !== filters.subCategory) {
      return false;
    }
    
    // 브랜드 필터
    if (filters.brand && product.brand !== filters.brand) {
      return false;
    }
    
    // 가격 범위 필터
    if (filters.minPrice || filters.maxPrice) {
      const price = product.price.sale || product.price.regular;
      if (filters.minPrice && price < filters.minPrice) {
        return false;
      }
      if (filters.maxPrice && price > filters.maxPrice) {
        return false;
      }
    }
    
    // 상품 상태 필터
    if (filters.status && product.status !== filters.status) {
      return false;
    }
    
    // 재고 여부 필터
    if (filters.inStock !== undefined) {
      const hasStock = product.inventory.available > 0;
      if (filters.inStock && !hasStock) {
        return false;
      }
      if (!filters.inStock && hasStock) {
        return false;
      }
    }
    
    // 추천 상품 필터
    if (filters.featured !== undefined && product.display.featured !== filters.featured) {
      return false;
    }
    
    // 신상품 필터
    if (filters.newProduct !== undefined && product.display.newProduct !== filters.newProduct) {
      return false;
    }
    
    // 베스트셀러 필터
    if (filters.bestSeller !== undefined && product.display.bestSeller !== filters.bestSeller) {
      return false;
    }
    
    // 평점 필터
    if (filters.minRating && product.stats.rating < filters.minRating) {
      return false;
    }
    
    // 검색어 필터
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const searchableText = `
        ${product.name} 
        ${product.description} 
        ${product.brand} 
        ${product.category.tags.join(' ')}
      `.toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    return true;
  });
};

/**
 * 상품 페이지네이션
 * @param {Object[]} products - 상품 배열
 * @param {number} page - 페이지 번호 (1부터 시작)
 * @param {number} limit - 페이지당 상품 수
 * @returns {Object} 페이지네이션 결과
 */
export const paginateProducts = (products, page = 1, limit = 12) => {
  const offset = (page - 1) * limit;
  const totalProducts = products.length;
  const totalPages = Math.ceil(totalProducts / limit);
  const paginatedProducts = products.slice(offset, offset + limit);
  
  return {
    products: paginatedProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalProducts,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      limit
    }
  };
};

/**
 * 상품 옵션 조합 생성
 * @param {Object[]} options - 상품 옵션 배열
 * @returns {Object[]} 모든 옵션 조합 배열
 */
export const generateOptionCombinations = (options) => {
  if (!options || options.length === 0) {
    return [{}];
  }
  
  const combinations = [];
  
  const generateCombinations = (optionIndex, currentCombination) => {
    if (optionIndex === options.length) {
      combinations.push({ ...currentCombination });
      return;
    }
    
    const currentOption = options[optionIndex];
    currentOption.values.forEach(value => {
      currentCombination[currentOption.id] = value.id;
      generateCombinations(optionIndex + 1, currentCombination);
    });
  };
  
  generateCombinations(0, {});
  return combinations;
};

/**
 * 상품 옵션 조합으로 SKU 생성
 * @param {string} baseSKU - 기본 SKU
 * @param {Object} optionCombination - 옵션 조합
 * @param {Object[]} options - 상품 옵션 배열
 * @returns {string} 생성된 SKU
 */
export const generateVariantSKU = (baseSKU, optionCombination, options) => {
  const suffixes = [];
  
  options.forEach(option => {
    const selectedValueId = optionCombination[option.id];
    if (selectedValueId) {
      const value = option.values.find(v => v.id === selectedValueId);
      if (value) {
        // 옵션 값의 첫 글자들로 약어 생성
        const abbreviation = value.name
          .split(' ')
          .map(word => word.charAt(0).toUpperCase())
          .join('');
        suffixes.push(abbreviation);
      }
    }
  });
  
  return `${baseSKU}-${suffixes.join('-')}`;
};

/**
 * 문자열을 URL 슬러그로 변환
 * @param {string} text - 변환할 텍스트
 * @returns {string} 슬러그
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // 특수문자 제거
    .replace(/[\s_-]+/g, '-') // 공백, 언더스코어, 하이픈을 하이픈으로 통일
    .replace(/^-+|-+$/g, ''); // 앞뒤 하이픈 제거
};

/**
 * 할인율 계산
 * @param {number} regularPrice - 정가
 * @param {number} salePrice - 판매가
 * @returns {number} 할인율 (%)
 */
export const calculateDiscountRate = (regularPrice, salePrice) => {
  if (regularPrice <= 0 || salePrice >= regularPrice) {
    return 0;
  }
  
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100 * 100) / 100;
};

/**
 * 총 재고량 계산 (옵션별 재고 합계)
 * @param {Object[]} options - 상품 옵션 배열
 * @returns {number} 총 재고량
 */
export const calculateTotalStock = (options) => {
  return options.reduce((total, option) => {
    return total + option.values.reduce((optionTotal, value) => {
      return optionTotal + (value.stock || 0);
    }, 0);
  }, 0);
};

/**
 * 상품 평균 평점 계산 (리뷰 데이터가 있다면)
 * @param {Object[]} reviews - 리뷰 배열
 * @returns {number} 평균 평점
 */
export const calculateAverageRating = (reviews = []) => {
  if (!reviews || reviews.length === 0) {
    return 0;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return Math.round((totalRating / reviews.length) * 10) / 10;
};

/**
 * 상품 상태 텍스트 반환
 * @param {string} status - 상품 상태
 * @returns {string} 상태 텍스트
 */
export const getProductStatusText = (status) => {
  const statusTexts = {
    [PRODUCT_STATUS.ACTIVE]: '판매중',
    [PRODUCT_STATUS.OUT_OF_STOCK]: '품절',
    [PRODUCT_STATUS.INACTIVE]: '판매중단',
    [PRODUCT_STATUS.DISCONTINUED]: '단종'
  };
  
  return statusTexts[status] || '알 수 없음';
};

/**
 * 상품 상태 색상 반환 (UI용)
 * @param {string} status - 상품 상태
 * @returns {string} 색상 코드
 */
export const getProductStatusColor = (status) => {
  const statusColors = {
    [PRODUCT_STATUS.ACTIVE]: '#28a745',
    [PRODUCT_STATUS.OUT_OF_STOCK]: '#ffc107',
    [PRODUCT_STATUS.INACTIVE]: '#6c757d',
    [PRODUCT_STATUS.DISCONTINUED]: '#dc3545'
  };
  
  return statusColors[status] || '#6c757d';
};