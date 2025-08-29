// ========================================
// 카테고리(Category) 데이터 모델 정의
// ========================================

/**
 * 카테고리 기본 데이터 구조
 * @typedef {Object} Category
 * @property {string} id - 카테고리 고유 식별자
 * @property {string} name - 카테고리명
 * @property {string} description - 카테고리 설명
 * @property {string} slug - URL 슬러그
 * @property {string|null} parentId - 상위 카테고리 ID (null이면 최상위)
 * @property {number} level - 카테고리 레벨 (0: 대분류, 1: 중분류, 2: 소분류)
 * @property {number} sortOrder - 정렬 순서
 * @property {string} image - 카테고리 대표 이미지 URL
 * @property {string} icon - 카테고리 아이콘 URL 또는 클래스명
 * @property {boolean} isActive - 활성화 상태
 * @property {boolean} showInMenu - 메뉴에 표시 여부
 * @property {Object} seo - SEO 정보
 * @property {string} seo.title - SEO 제목
 * @property {string} seo.description - SEO 설명
 * @property {string[]} seo.keywords - SEO 키워드
 * @property {Object[]} filters - 카테고리별 필터 옵션
 * @property {string} filters[].id - 필터 ID
 * @property {string} filters[].name - 필터명
 * @property {string} filters[].type - 필터 타입 ('range', 'select', 'checkbox')
 * @property {Object[]} filters[].options - 필터 옵션들
 * @property {Object} stats - 통계 정보
 * @property {number} stats.productCount - 소속 상품 수
 * @property {number} stats.viewCount - 조회수
 * @property {Date} createdAt - 생성일
 * @property {Date} updatedAt - 수정일
 */

/**
 * 필터 타입 열거형
 * @readonly
 * @enum {string}
 */
export const FILTER_TYPE = {
  /** 범위 필터 (가격대 등) */
  RANGE: 'range',
  /** 단일 선택 필터 */
  SELECT: 'select',
  /** 다중 선택 필터 */
  CHECKBOX: 'checkbox',
  /** 텍스트 검색 필터 */
  SEARCH: 'search',
  /** 별점 필터 */
  RATING: 'rating'
};

/**
 * 빈 카테고리 객체 생성
 * @returns {Category} 기본값이 설정된 빈 카테고리 객체
 */
export const createEmptyCategory = () => ({
  id: '',
  name: '',
  description: '',
  slug: '',
  parentId: null,
  level: 0,
  sortOrder: 0,
  image: '',
  icon: '',
  isActive: true,
  showInMenu: true,
  seo: {
    title: '',
    description: '',
    keywords: []
  },
  filters: [],
  stats: {
    productCount: 0,
    viewCount: 0
  },
  createdAt: new Date(),
  updatedAt: new Date()
});

/**
 * 카테고리 필터 생성
 * @param {string} name - 필터명
 * @param {string} type - 필터 타입
 * @param {Object[]} options - 필터 옵션들
 * @returns {Object} 카테고리 필터 객체
 */
export const createCategoryFilter = (name, type, options = []) => ({
  id: `filter_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
  name,
  type,
  options
});

/**
 * 기본 카테고리 트리 구조
 */
export const DEFAULT_CATEGORIES = [
  // 의류 카테고리
  {
    id: 'fashion',
    name: '패션',
    description: '의류 및 패션 아이템',
    slug: 'fashion',
    parentId: null,
    level: 0,
    sortOrder: 1,
    image: '/images/categories/fashion.jpg',
    icon: 'fas fa-tshirt',
    isActive: true,
    showInMenu: true,
    seo: {
      title: '패션 - PZNGR',
      description: 'PZNGR의 다양한 패션 아이템을 만나보세요',
      keywords: ['패션', '의류', '티셔츠', '반바지']
    },
    filters: [
      {
        id: 'size',
        name: '사이즈',
        type: FILTER_TYPE.CHECKBOX,
        options: [
          { id: 'xs', name: 'XS', count: 0 },
          { id: 's', name: 'S', count: 0 },
          { id: 'm', name: 'M', count: 0 },
          { id: 'l', name: 'L', count: 0 },
          { id: 'xl', name: 'XL', count: 0 },
          { id: 'xxl', name: 'XXL', count: 0 }
        ]
      },
      {
        id: 'color',
        name: '색상',
        type: FILTER_TYPE.CHECKBOX,
        options: [
          { id: 'black', name: '블랙', color: '#000000', count: 0 },
          { id: 'white', name: '화이트', color: '#ffffff', count: 0 },
          { id: 'red', name: '레드', color: '#ff0000', count: 0 },
          { id: 'blue', name: '블루', color: '#0000ff', count: 0 },
          { id: 'green', name: '그린', color: '#00ff00', count: 0 }
        ]
      },
      {
        id: 'price',
        name: '가격대',
        type: FILTER_TYPE.RANGE,
        options: [
          { id: 'under-30000', name: '3만원 이하', min: 0, max: 30000, count: 0 },
          { id: '30000-50000', name: '3만원 - 5만원', min: 30000, max: 50000, count: 0 },
          { id: '50000-100000', name: '5만원 - 10만원', min: 50000, max: 100000, count: 0 },
          { id: 'over-100000', name: '10만원 이상', min: 100000, max: null, count: 0 }
        ]
      }
    ],
    stats: {
      productCount: 0,
      viewCount: 0
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  
  // 티셔츠 하위 카테고리
  {
    id: 'tshirts',
    name: '티셔츠',
    description: '다양한 스타일의 티셔츠',
    slug: 'tshirts',
    parentId: 'fashion',
    level: 1,
    sortOrder: 1,
    image: '/images/categories/tshirts.jpg',
    icon: 'fas fa-tshirt',
    isActive: true,
    showInMenu: true,
    seo: {
      title: '티셔츠 - PZNGR',
      description: '편안하고 스타일리시한 티셔츠 컬렉션',
      keywords: ['티셔츠', '반팔', '라운드넥', '브이넥']
    },
    filters: [
      {
        id: 'neckline',
        name: '넥라인',
        type: FILTER_TYPE.CHECKBOX,
        options: [
          { id: 'round', name: '라운드넥', count: 0 },
          { id: 'v-neck', name: '브이넥', count: 0 },
          { id: 'crew', name: '크루넥', count: 0 }
        ]
      },
      {
        id: 'sleeve',
        name: '소매',
        type: FILTER_TYPE.SELECT,
        options: [
          { id: 'short', name: '반팔', count: 0 },
          { id: 'long', name: '긴팔', count: 0 },
          { id: 'sleeveless', name: '민소매', count: 0 }
        ]
      }
    ],
    stats: {
      productCount: 0,
      viewCount: 0
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // 반바지 하위 카테고리
  {
    id: 'shorts',
    name: '반바지',
    description: '시원한 반바지 컬렉션',
    slug: 'shorts',
    parentId: 'fashion',
    level: 1,
    sortOrder: 2,
    image: '/images/categories/shorts.jpg',
    icon: 'fas fa-cut',
    isActive: true,
    showInMenu: true,
    seo: {
      title: '반바지 - PZNGR',
      description: '편안하고 활동적인 반바지 컬렉션',
      keywords: ['반바지', '쇼츠', '하프팬츠']
    },
    filters: [
      {
        id: 'length',
        name: '기장',
        type: FILTER_TYPE.SELECT,
        options: [
          { id: 'short', name: '짧은 기장', count: 0 },
          { id: 'medium', name: '보통 기장', count: 0 },
          { id: 'long', name: '긴 기장', count: 0 }
        ]
      }
    ],
    stats: {
      productCount: 0,
      viewCount: 0
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // 전자제품 카테고리
  {
    id: 'electronics',
    name: '전자제품',
    description: '다양한 전자제품 및 가전제품',
    slug: 'electronics',
    parentId: null,
    level: 0,
    sortOrder: 2,
    image: '/images/categories/electronics.jpg',
    icon: 'fas fa-laptop',
    isActive: true,
    showInMenu: true,
    seo: {
      title: '전자제품 - PZNGR',
      description: '최신 전자제품과 가전제품을 만나보세요',
      keywords: ['전자제품', '가전', '컴퓨터', '스마트폰']
    },
    filters: [
      {
        id: 'brand',
        name: '브랜드',
        type: FILTER_TYPE.CHECKBOX,
        options: [
          { id: 'apple', name: 'Apple', count: 0 },
          { id: 'samsung', name: 'Samsung', count: 0 },
          { id: 'lg', name: 'LG', count: 0 },
          { id: 'sony', name: 'Sony', count: 0 }
        ]
      },
      {
        id: 'price',
        name: '가격대',
        type: FILTER_TYPE.RANGE,
        options: [
          { id: 'under-100000', name: '10만원 이하', min: 0, max: 100000, count: 0 },
          { id: '100000-500000', name: '10만원 - 50만원', min: 100000, max: 500000, count: 0 },
          { id: '500000-1000000', name: '50만원 - 100만원', min: 500000, max: 1000000, count: 0 },
          { id: 'over-1000000', name: '100만원 이상', min: 1000000, max: null, count: 0 }
        ]
      }
    ],
    stats: {
      productCount: 0,
      viewCount: 0
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },

  // 식품 카테고리
  {
    id: 'food',
    name: '식품',
    description: '신선한 식품 및 가공식품',
    slug: 'food',
    parentId: null,
    level: 0,
    sortOrder: 3,
    image: '/images/categories/food.jpg',
    icon: 'fas fa-utensils',
    isActive: true,
    showInMenu: true,
    seo: {
      title: '식품 - PZNGR',
      description: '신선하고 맛있는 식품을 만나보세요',
      keywords: ['식품', '음식', '신선식품', '가공식품']
    },
    filters: [
      {
        id: 'category',
        name: '분류',
        type: FILTER_TYPE.CHECKBOX,
        options: [
          { id: 'fresh', name: '신선식품', count: 0 },
          { id: 'processed', name: '가공식품', count: 0 },
          { id: 'organic', name: '유기농', count: 0 },
          { id: 'frozen', name: '냉동식품', count: 0 }
        ]
      },
      {
        id: 'dietary',
        name: '식단 특성',
        type: FILTER_TYPE.CHECKBOX,
        options: [
          { id: 'vegetarian', name: '채식주의', count: 0 },
          { id: 'vegan', name: '비건', count: 0 },
          { id: 'gluten-free', name: '글루텐 프리', count: 0 },
          { id: 'sugar-free', name: '무설탕', count: 0 }
        ]
      }
    ],
    stats: {
      productCount: 0,
      viewCount: 0
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

/**
 * 카테고리 트리 구조에서 하위 카테고리 조회
 * @param {Category[]} categories - 전체 카테고리 배열
 * @param {string|null} parentId - 상위 카테고리 ID
 * @returns {Category[]} 하위 카테고리 배열
 */
export const getChildCategories = (categories, parentId) => {
  return categories
    .filter(category => category.parentId === parentId)
    .sort((a, b) => a.sortOrder - b.sortOrder);
};

/**
 * 카테고리 트리 구조 생성
 * @param {Category[]} categories - 전체 카테고리 배열
 * @param {string|null} parentId - 시작할 상위 카테고리 ID
 * @returns {Category[]} 트리 구조의 카테고리 배열
 */
export const buildCategoryTree = (categories, parentId = null) => {
  const children = getChildCategories(categories, parentId);
  
  return children.map(category => ({
    ...category,
    children: buildCategoryTree(categories, category.id)
  }));
};

/**
 * 카테고리 경로 조회 (breadcrumb용)
 * @param {Category[]} categories - 전체 카테고리 배열
 * @param {string} categoryId - 카테고리 ID
 * @returns {Category[]} 루트부터 해당 카테고리까지의 경로
 */
export const getCategoryPath = (categories, categoryId) => {
  const path = [];
  let currentId = categoryId;
  
  const findCategory = (id) => categories.find(cat => cat.id === id);
  
  while (currentId) {
    const category = findCategory(currentId);
    if (!category) break;
    
    path.unshift(category);
    currentId = category.parentId;
  }
  
  return path;
};

/**
 * 카테고리 URL 생성
 * @param {Category[]} path - 카테고리 경로
 * @returns {string} 카테고리 URL
 */
export const generateCategoryUrl = (path) => {
  return '/category/' + path.map(cat => cat.slug).join('/');
};