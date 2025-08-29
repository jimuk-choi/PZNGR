// ========================================
// 상품 데이터 유효성 검증 함수들
// ========================================

import { PRODUCT_STATUS, PRICE_TYPE, OPTION_TYPE } from '../models/Product';

/**
 * 상품명 검증
 * @param {string} name - 상품명
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateProductName = (name) => {
  const result = { isValid: false, message: '' };
  
  if (!name || typeof name !== 'string') {
    result.message = '상품명을 입력해주세요.';
    return result;
  }
  
  const trimmedName = name.trim();
  if (trimmedName.length < 2) {
    result.message = '상품명은 2자 이상 입력해주세요.';
    return result;
  }
  
  if (trimmedName.length > 100) {
    result.message = '상품명은 100자 이하로 입력해주세요.';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * 상품 설명 검증
 * @param {string} description - 상품 설명
 * @param {boolean} required - 필수 여부
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateProductDescription = (description, required = false) => {
  const result = { isValid: false, message: '' };
  
  if (!description || typeof description !== 'string') {
    if (required) {
      result.message = '상품 설명을 입력해주세요.';
      return result;
    } else {
      result.isValid = true;
      return result;
    }
  }
  
  const trimmedDescription = description.trim();
  if (required && trimmedDescription.length < 10) {
    result.message = '상품 설명은 10자 이상 입력해주세요.';
    return result;
  }
  
  if (trimmedDescription.length > 2000) {
    result.message = '상품 설명은 2000자 이하로 입력해주세요.';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * 가격 검증
 * @param {number} price - 가격
 * @param {string} fieldName - 필드명 (에러 메시지용)
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validatePrice = (price, fieldName = '가격') => {
  const result = { isValid: false, message: '' };
  
  if (typeof price !== 'number') {
    result.message = `${fieldName}을 올바르게 입력해주세요.`;
    return result;
  }
  
  if (price < 0) {
    result.message = `${fieldName}은 0 이상이어야 합니다.`;
    return result;
  }
  
  if (price > 999999999) {
    result.message = `${fieldName}이 너무 큽니다.`;
    return result;
  }
  
  // 소수점 둘째 자리까지만 허용
  if (!Number.isInteger(price * 100)) {
    result.message = `${fieldName}은 소수점 둘째 자리까지만 입력 가능합니다.`;
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * SKU 검증
 * @param {string} sku - SKU 코드
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateSKU = (sku) => {
  const result = { isValid: false, message: '' };
  
  if (!sku || typeof sku !== 'string') {
    result.message = 'SKU를 입력해주세요.';
    return result;
  }
  
  const trimmedSKU = sku.trim();
  if (trimmedSKU.length < 3) {
    result.message = 'SKU는 3자 이상 입력해주세요.';
    return result;
  }
  
  if (trimmedSKU.length > 50) {
    result.message = 'SKU는 50자 이하로 입력해주세요.';
    return result;
  }
  
  // 영문, 숫자, 하이픈, 언더스코어만 허용
  if (!/^[A-Za-z0-9\-_]+$/.test(trimmedSKU)) {
    result.message = 'SKU는 영문, 숫자, 하이픈, 언더스코어만 사용 가능합니다.';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * 브랜드명 검증
 * @param {string} brand - 브랜드명
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateBrand = (brand) => {
  const result = { isValid: false, message: '' };
  
  if (!brand || typeof brand !== 'string') {
    result.message = '브랜드를 입력해주세요.';
    return result;
  }
  
  const trimmedBrand = brand.trim();
  if (trimmedBrand.length < 1) {
    result.message = '브랜드를 입력해주세요.';
    return result;
  }
  
  if (trimmedBrand.length > 50) {
    result.message = '브랜드명은 50자 이하로 입력해주세요.';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * 상품 상태 검증
 * @param {string} status - 상품 상태
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateProductStatus = (status) => {
  const result = { isValid: false, message: '' };
  
  const validStatuses = Object.values(PRODUCT_STATUS);
  if (!validStatuses.includes(status)) {
    result.message = '올바른 상품 상태를 선택해주세요.';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * 이미지 URL 검증
 * @param {string} url - 이미지 URL
 * @param {boolean} required - 필수 여부
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateImageUrl = (url, required = false) => {
  const result = { isValid: false, message: '' };
  
  if (!url || typeof url !== 'string') {
    if (required) {
      result.message = '이미지를 업로드해주세요.';
      return result;
    } else {
      result.isValid = true;
      return result;
    }
  }
  
  const trimmedUrl = url.trim();
  if (required && trimmedUrl.length === 0) {
    result.message = '이미지를 업로드해주세요.';
    return result;
  }
  
  // 기본적인 URL 형식 검증
  try {
    new URL(trimmedUrl);
  } catch {
    result.message = '올바른 이미지 URL을 입력해주세요.';
    return result;
  }
  
  // 이미지 확장자 검증
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasValidExtension = imageExtensions.some(ext => 
    trimmedUrl.toLowerCase().includes(ext)
  );
  
  if (!hasValidExtension) {
    result.message = '지원하는 이미지 형식(.jpg, .png, .gif, .webp, .svg)을 업로드해주세요.';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * 재고 수량 검증
 * @param {number} quantity - 재고 수량
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateStockQuantity = (quantity) => {
  const result = { isValid: false, message: '' };
  
  if (typeof quantity !== 'number') {
    result.message = '재고 수량을 올바르게 입력해주세요.';
    return result;
  }
  
  if (!Number.isInteger(quantity)) {
    result.message = '재고 수량은 정수로 입력해주세요.';
    return result;
  }
  
  if (quantity < 0) {
    result.message = '재고 수량은 0 이상이어야 합니다.';
    return result;
  }
  
  if (quantity > 999999) {
    result.message = '재고 수량이 너무 큽니다.';
    return result;
  }
  
  result.isValid = true;
  return result;
};

/**
 * 상품 옵션 검증
 * @param {Object} option - 상품 옵션
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateProductOption = (option) => {
  const result = { isValid: false, message: '', errors: {} };
  
  // 옵션명 검증
  if (!option.name || typeof option.name !== 'string' || option.name.trim().length === 0) {
    result.errors.name = '옵션명을 입력해주세요.';
  } else if (option.name.trim().length > 50) {
    result.errors.name = '옵션명은 50자 이하로 입력해주세요.';
  }
  
  // 옵션 타입 검증
  const validTypes = Object.values(OPTION_TYPE);
  if (!validTypes.includes(option.type)) {
    result.errors.type = '올바른 옵션 타입을 선택해주세요.';
  }
  
  // 옵션 값들 검증
  if (!Array.isArray(option.values) || option.values.length === 0) {
    result.errors.values = '최소 1개 이상의 옵션 값을 입력해주세요.';
  } else {
    const valueErrors = [];
    option.values.forEach((value, index) => {
      const valueError = {};
      
      if (!value.name || typeof value.name !== 'string' || value.name.trim().length === 0) {
        valueError.name = '옵션 값 이름을 입력해주세요.';
      }
      
      if (typeof value.additionalPrice !== 'number' || value.additionalPrice < 0) {
        valueError.additionalPrice = '추가 가격은 0 이상의 숫자여야 합니다.';
      }
      
      if (typeof value.stock !== 'number' || value.stock < 0 || !Number.isInteger(value.stock)) {
        valueError.stock = '재고는 0 이상의 정수여야 합니다.';
      }
      
      if (Object.keys(valueError).length > 0) {
        valueErrors[index] = valueError;
      }
    });
    
    if (valueErrors.length > 0) {
      result.errors.values = valueErrors;
    }
  }
  
  result.isValid = Object.keys(result.errors).length === 0;
  result.message = result.isValid ? '' : '옵션 정보를 올바르게 입력해주세요.';
  
  return result;
};

/**
 * 상품 전체 데이터 검증
 * @param {Object} product - 상품 데이터
 * @returns {Object} 검증 결과 { isValid: boolean, errors: Object }
 */
export const validateProduct = (product) => {
  const errors = {};
  
  // 기본 정보 검증
  const nameValidation = validateProductName(product.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.message;
  }
  
  const descriptionValidation = validateProductDescription(product.description, false);
  if (!descriptionValidation.isValid) {
    errors.description = descriptionValidation.message;
  }
  
  const brandValidation = validateBrand(product.brand);
  if (!brandValidation.isValid) {
    errors.brand = brandValidation.message;
  }
  
  const skuValidation = validateSKU(product.sku);
  if (!skuValidation.isValid) {
    errors.sku = skuValidation.message;
  }
  
  // 가격 정보 검증
  if (product.price) {
    const regularPriceValidation = validatePrice(product.price.regular, '정가');
    if (!regularPriceValidation.isValid) {
      errors.regularPrice = regularPriceValidation.message;
    }
    
    const salePriceValidation = validatePrice(product.price.sale, '판매가');
    if (!salePriceValidation.isValid) {
      errors.salePrice = salePriceValidation.message;
    }
    
    // 판매가가 정가보다 높으면 안됨
    if (product.price.sale > product.price.regular) {
      errors.salePrice = '판매가는 정가보다 높을 수 없습니다.';
    }
  }
  
  // 상품 상태 검증
  const statusValidation = validateProductStatus(product.status);
  if (!statusValidation.isValid) {
    errors.status = statusValidation.message;
  }
  
  // 메인 이미지 검증
  if (product.images && product.images.main) {
    const mainImageValidation = validateImageUrl(product.images.main, true);
    if (!mainImageValidation.isValid) {
      errors.mainImage = mainImageValidation.message;
    }
  } else {
    errors.mainImage = '메인 이미지를 업로드해주세요.';
  }
  
  // 갤러리 이미지들 검증
  if (product.images && Array.isArray(product.images.gallery)) {
    const galleryErrors = [];
    product.images.gallery.forEach((url, index) => {
      const imageValidation = validateImageUrl(url, false);
      if (!imageValidation.isValid) {
        galleryErrors[index] = imageValidation.message;
      }
    });
    
    if (galleryErrors.filter(error => error).length > 0) {
      errors.galleryImages = galleryErrors;
    }
  }
  
  // 재고 정보 검증
  if (product.inventory) {
    if (product.inventory.trackStock) {
      const totalStockValidation = validateStockQuantity(product.inventory.total);
      if (!totalStockValidation.isValid) {
        errors.totalStock = totalStockValidation.message;
      }
      
      const availableStockValidation = validateStockQuantity(product.inventory.available);
      if (!availableStockValidation.isValid) {
        errors.availableStock = availableStockValidation.message;
      }
      
      const safetyStockValidation = validateStockQuantity(product.inventory.safetyStock);
      if (!safetyStockValidation.isValid) {
        errors.safetyStock = safetyStockValidation.message;
      }
    }
  }
  
  // 옵션들 검증
  if (Array.isArray(product.options)) {
    const optionErrors = [];
    product.options.forEach((option, index) => {
      const optionValidation = validateProductOption(option);
      if (!optionValidation.isValid) {
        optionErrors[index] = optionValidation.errors;
      }
    });
    
    if (optionErrors.filter(error => error && Object.keys(error).length > 0).length > 0) {
      errors.options = optionErrors;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * 중복 SKU 검증
 * @param {string} sku - 검증할 SKU
 * @param {Object[]} existingProducts - 기존 상품 목록
 * @param {string} currentProductId - 현재 편집 중인 상품 ID (편집 시)
 * @returns {Object} 검증 결과 { isValid: boolean, message: string }
 */
export const validateUniqueSKU = (sku, existingProducts, currentProductId = null) => {
  const result = { isValid: false, message: '' };
  
  const duplicateProduct = existingProducts.find(product => 
    product.sku === sku && product.id !== currentProductId
  );
  
  if (duplicateProduct) {
    result.message = '이미 사용 중인 SKU입니다.';
    return result;
  }
  
  result.isValid = true;
  return result;
};