// ========================================
// 재고(Inventory) 데이터 모델 정의
// ========================================

/**
 * 재고 이동 타입 열거형
 * @readonly
 * @enum {string}
 */
export const INVENTORY_MOVEMENT_TYPE = {
  /** 입고 */
  IN: 'in',
  /** 출고 */
  OUT: 'out',
  /** 조정 (수정) */
  ADJUSTMENT: 'adjustment',
  /** 손실 */
  LOSS: 'loss',
  /** 반품 */
  RETURN: 'return',
  /** 예약 */
  RESERVED: 'reserved',
  /** 예약 해제 */
  UNRESERVED: 'unreserved'
};

/**
 * 재고 상태 열거형
 * @readonly
 * @enum {string}
 */
export const INVENTORY_STATUS = {
  /** 정상 */
  NORMAL: 'normal',
  /** 부족 */
  LOW: 'low',
  /** 품절 */
  OUT_OF_STOCK: 'out_of_stock',
  /** 과재고 */
  OVERSTOCK: 'overstock'
};

/**
 * 재고 정보 데이터 구조
 * @typedef {Object} InventoryItem
 * @property {string} id - 재고 항목 고유 식별자
 * @property {string} productId - 상품 ID
 * @property {string} sku - SKU 코드
 * @property {string} optionCombination - 옵션 조합 (예: "색상:빨강,사이즈:L")
 * @property {Object} optionValues - 옵션 값들의 객체
 * @property {string} location - 창고/매장 위치
 * @property {string} zone - 구역 (예: A-1-01)
 * 
 * @property {Object} stock - 재고 수량 정보
 * @property {number} stock.total - 전체 재고
 * @property {number} stock.available - 판매 가능 재고
 * @property {number} stock.reserved - 예약된 재고 (주문대기 등)
 * @property {number} stock.damaged - 손상된 재고
 * @property {number} stock.safetyStock - 안전 재고
 * @property {number} stock.reorderPoint - 재주문 시점
 * @property {number} stock.maxStock - 최대 재고
 * 
 * @property {Object} costs - 비용 정보
 * @property {number} costs.purchasePrice - 매입가
 * @property {number} costs.averageCost - 평균 단가
 * @property {number} costs.lastCost - 최근 매입가
 * 
 * @property {Object} tracking - 추적 정보
 * @property {string} tracking.batchNumber - 배치/로트 번호
 * @property {Date} tracking.expiryDate - 유통기한
 * @property {Date} tracking.receivedDate - 입고일
 * @property {string} tracking.supplier - 공급업체
 * 
 * @property {string} status - 재고 상태 (INVENTORY_STATUS)
 * @property {boolean} trackSerialNumbers - 시리얼 번호 추적 여부
 * @property {string[]} serialNumbers - 시리얼 번호 배열
 * @property {Date} createdAt - 생성일
 * @property {Date} updatedAt - 수정일
 */

/**
 * 재고 이동 이력 데이터 구조
 * @typedef {Object} InventoryMovement
 * @property {string} id - 이동 이력 고유 식별자
 * @property {string} inventoryItemId - 재고 항목 ID
 * @property {string} productId - 상품 ID
 * @property {string} type - 이동 타입 (INVENTORY_MOVEMENT_TYPE)
 * @property {number} quantity - 수량 (양수: 입고, 음수: 출고)
 * @property {number} beforeQuantity - 이동 전 수량
 * @property {number} afterQuantity - 이동 후 수량
 * @property {string} reason - 이동 사유
 * @property {string} reference - 참조 번호 (주문번호, 입고번호 등)
 * @property {Object} metadata - 추가 정보
 * @property {string} createdBy - 처리자 ID
 * @property {Date} createdAt - 이동일시
 */

/**
 * 재고 알림 설정
 * @typedef {Object} InventoryAlert
 * @property {string} id - 알림 고유 식별자
 * @property {string} productId - 상품 ID
 * @property {string} type - 알림 타입 ('low_stock', 'out_of_stock', 'overstock')
 * @property {number} threshold - 알림 임계값
 * @property {boolean} isActive - 활성 상태
 * @property {string[]} recipients - 알림 받을 사용자 ID 목록
 * @property {Object} lastTriggered - 마지막 알림 정보
 * @property {Date} lastTriggered.date - 마지막 알림 날짜
 * @property {number} lastTriggered.quantity - 알림 당시 재고량
 * @property {Date} createdAt - 생성일
 */

/**
 * 빈 재고 항목 생성
 * @returns {InventoryItem} 기본값이 설정된 빈 재고 항목
 */
export const createEmptyInventoryItem = () => ({
  id: '',
  productId: '',
  sku: '',
  optionCombination: '',
  optionValues: {},
  location: '',
  zone: '',
  
  stock: {
    total: 0,
    available: 0,
    reserved: 0,
    damaged: 0,
    safetyStock: 0,
    reorderPoint: 0,
    maxStock: 0
  },
  
  costs: {
    purchasePrice: 0,
    averageCost: 0,
    lastCost: 0
  },
  
  tracking: {
    batchNumber: '',
    expiryDate: null,
    receivedDate: new Date(),
    supplier: ''
  },
  
  status: INVENTORY_STATUS.NORMAL,
  trackSerialNumbers: false,
  serialNumbers: [],
  createdAt: new Date(),
  updatedAt: new Date()
});

/**
 * 재고 이동 이력 생성
 * @param {string} inventoryItemId - 재고 항목 ID
 * @param {string} productId - 상품 ID
 * @param {string} type - 이동 타입
 * @param {number} quantity - 수량
 * @param {number} beforeQuantity - 이동 전 수량
 * @param {string} reason - 이동 사유
 * @param {string} createdBy - 처리자 ID
 * @param {string} reference - 참조 번호
 * @returns {InventoryMovement} 재고 이동 이력 객체
 */
export const createInventoryMovement = (
  inventoryItemId, 
  productId, 
  type, 
  quantity, 
  beforeQuantity, 
  reason, 
  createdBy, 
  reference = ''
) => ({
  id: `movement_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  inventoryItemId,
  productId,
  type,
  quantity,
  beforeQuantity,
  afterQuantity: beforeQuantity + quantity,
  reason,
  reference,
  metadata: {},
  createdBy,
  createdAt: new Date()
});

/**
 * 재고 상태 계산
 * @param {InventoryItem} inventoryItem - 재고 항목
 * @returns {string} 재고 상태
 */
export const calculateInventoryStatus = (inventoryItem) => {
  const { available, safetyStock, maxStock } = inventoryItem.stock;
  
  if (available <= 0) {
    return INVENTORY_STATUS.OUT_OF_STOCK;
  } else if (available <= safetyStock) {
    return INVENTORY_STATUS.LOW;
  } else if (maxStock > 0 && available >= maxStock) {
    return INVENTORY_STATUS.OVERSTOCK;
  } else {
    return INVENTORY_STATUS.NORMAL;
  }
};

/**
 * 재고 예약
 * @param {InventoryItem} inventoryItem - 재고 항목
 * @param {number} quantity - 예약할 수량
 * @returns {Object} 예약 결과 { success: boolean, message: string, updatedItem: InventoryItem }
 */
export const reserveInventory = (inventoryItem, quantity) => {
  if (inventoryItem.stock.available < quantity) {
    return {
      success: false,
      message: '재고가 부족합니다.',
      updatedItem: inventoryItem
    };
  }
  
  const updatedItem = {
    ...inventoryItem,
    stock: {
      ...inventoryItem.stock,
      available: inventoryItem.stock.available - quantity,
      reserved: inventoryItem.stock.reserved + quantity
    },
    updatedAt: new Date()
  };
  
  updatedItem.status = calculateInventoryStatus(updatedItem);
  
  return {
    success: true,
    message: '재고가 예약되었습니다.',
    updatedItem
  };
};

/**
 * 재고 예약 해제
 * @param {InventoryItem} inventoryItem - 재고 항목
 * @param {number} quantity - 해제할 수량
 * @returns {Object} 해제 결과 { success: boolean, message: string, updatedItem: InventoryItem }
 */
export const unreserveInventory = (inventoryItem, quantity) => {
  if (inventoryItem.stock.reserved < quantity) {
    return {
      success: false,
      message: '예약된 재고보다 많은 수량을 해제할 수 없습니다.',
      updatedItem: inventoryItem
    };
  }
  
  const updatedItem = {
    ...inventoryItem,
    stock: {
      ...inventoryItem.stock,
      available: inventoryItem.stock.available + quantity,
      reserved: inventoryItem.stock.reserved - quantity
    },
    updatedAt: new Date()
  };
  
  updatedItem.status = calculateInventoryStatus(updatedItem);
  
  return {
    success: true,
    message: '재고 예약이 해제되었습니다.',
    updatedItem
  };
};

/**
 * 재고 조정
 * @param {InventoryItem} inventoryItem - 재고 항목
 * @param {number} newQuantity - 새로운 재고 수량
 * @param {string} reason - 조정 사유
 * @returns {Object} 조정 결과 { success: boolean, movement: InventoryMovement, updatedItem: InventoryItem }
 */
export const adjustInventory = (inventoryItem, newQuantity, reason) => {
  const difference = newQuantity - inventoryItem.stock.total;
  
  const updatedItem = {
    ...inventoryItem,
    stock: {
      ...inventoryItem.stock,
      total: newQuantity,
      available: inventoryItem.stock.available + difference
    },
    updatedAt: new Date()
  };
  
  updatedItem.status = calculateInventoryStatus(updatedItem);
  
  const movement = createInventoryMovement(
    inventoryItem.id,
    inventoryItem.productId,
    INVENTORY_MOVEMENT_TYPE.ADJUSTMENT,
    difference,
    inventoryItem.stock.total,
    reason,
    'system' // 실제로는 현재 사용자 ID
  );
  
  return {
    success: true,
    movement,
    updatedItem
  };
};

/**
 * 재고 알림 확인
 * @param {InventoryItem} inventoryItem - 재고 항목
 * @param {InventoryAlert[]} alerts - 알림 설정 배열
 * @returns {InventoryAlert[]} 트리거된 알림들
 */
export const checkInventoryAlerts = (inventoryItem, alerts) => {
  const triggeredAlerts = [];
  
  alerts
    .filter(alert => alert.productId === inventoryItem.productId && alert.isActive)
    .forEach(alert => {
      let shouldTrigger = false;
      
      switch (alert.type) {
        case 'low_stock':
          shouldTrigger = inventoryItem.stock.available <= alert.threshold;
          break;
        case 'out_of_stock':
          shouldTrigger = inventoryItem.stock.available <= 0;
          break;
        case 'overstock':
          shouldTrigger = inventoryItem.stock.available >= alert.threshold;
          break;
        default:
          shouldTrigger = false;
          break;
      }
      
      if (shouldTrigger) {
        triggeredAlerts.push({
          ...alert,
          lastTriggered: {
            date: new Date(),
            quantity: inventoryItem.stock.available
          }
        });
      }
    });
  
  return triggeredAlerts;
};

/**
 * 재고 요약 통계 계산
 * @param {InventoryItem[]} inventoryItems - 재고 항목 배열
 * @returns {Object} 재고 요약 통계
 */
export const calculateInventorySummary = (inventoryItems) => {
  const summary = {
    totalItems: inventoryItems.length,
    totalValue: 0,
    statusCounts: {
      [INVENTORY_STATUS.NORMAL]: 0,
      [INVENTORY_STATUS.LOW]: 0,
      [INVENTORY_STATUS.OUT_OF_STOCK]: 0,
      [INVENTORY_STATUS.OVERSTOCK]: 0
    },
    totalStock: 0,
    totalReserved: 0,
    totalAvailable: 0
  };
  
  inventoryItems.forEach(item => {
    summary.totalValue += item.stock.total * item.costs.averageCost;
    summary.statusCounts[item.status]++;
    summary.totalStock += item.stock.total;
    summary.totalReserved += item.stock.reserved;
    summary.totalAvailable += item.stock.available;
  });
  
  return summary;
};