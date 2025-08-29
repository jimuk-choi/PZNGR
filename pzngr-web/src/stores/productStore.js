import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';
import { mockProducts } from '../data/mockProducts';

// 카테고리 데이터
const categories = [
  { id: 'tshirt', name: 'T-Shirt', description: '티셔츠' },
  { id: 'shorts', name: 'Shorts', description: '반바지' },
  { id: 'all', name: 'All', description: '전체' }
];

// 상품 데이터를 store 형식에 맞게 변환
const formatProducts = (products) => {
  return products.map(product => ({
    id: product.id.toString(),
    name: product.name,
    price: typeof product.price === 'string' 
      ? parseInt(product.price.replace(/[^0-9]/g, ''))
      : product.price.sale || product.price.regular,
    image: product.images?.main || product.image,
    description: product.description || product.shortDescription || product.imageAlt || '',
    category: product.category?.main || 
              (product.name.toLowerCase().includes('t-shirt') ? 'tshirt' : 'shorts'),
    stock: product.inventory?.total || 10,
    slug: product.seo?.slug || product.slug || product.id
  }));
};

// 초기 상태
const initialState = {
  products: formatProducts(mockProducts),
  currentProduct: null,
  categories: categories,
  selectedCategory: 'all',
  loading: false,
  error: null,
};

// 상품 상태 관리 store
export const useProductStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 액션들
      setProducts: (products) => {
        set({ products: formatProducts(products) });
      },

      addProduct: (product) => {
        const { products } = get();
        const newProduct = {
          id: (products.length + 1).toString(),
          ...product,
          stock: product.stock || 10
        };
        set({ products: [...products, newProduct] });
      },

      updateProduct: (productId, updates) => {
        const { products } = get();
        const updatedProducts = products.map(product =>
          product.id === productId ? { ...product, ...updates } : product
        );
        set({ products: updatedProducts });
      },

      removeProduct: (productId) => {
        const { products } = get();
        const filteredProducts = products.filter(product => product.id !== productId);
        set({ products: filteredProducts });
      },

      setCurrentProduct: (product) => {
        set({ currentProduct: product });
      },

      setSelectedCategory: (category) => {
        set({ selectedCategory: category });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      // 헬퍼 함수들
      getProductById: (productId) => {
        const { products } = get();
        return products.find(product => product.id === productId);
      },

      getProductsByCategory: (category) => {
        const { products } = get();
        if (category === 'all') return products;
        return products.filter(product => product.category === category);
      },

      getFilteredProducts: () => {
        const { selectedCategory } = get();
        return get().getProductsByCategory(selectedCategory);
      },

      searchProducts: (query) => {
        const { products } = get();
        if (!query) return products;
        return products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase())
        );
      },

      updateStock: (productId, quantity) => {
        const { products } = get();
        const updatedProducts = products.map(product => {
          if (product.id === productId) {
            return {
              ...product,
              stock: Math.max(0, product.stock - quantity)
            };
          }
          return product;
        });
        set({ products: updatedProducts });
      },

      resetProducts: () => {
        set({ products: formatProducts(mockProducts) });
      }
    }),
    {
      name: 'product-storage',
      storage: createJSONStorage(),
    }
  )
);