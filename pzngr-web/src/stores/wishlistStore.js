import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';
import { updateSessionData, getSessionData } from '../utils/sessionManager';

// 초기 상태
const initialState = {
  items: [], // 찜한 상품 목록
  totalCount: 0, // 찜한 상품 총 개수
  sessionId: null, // 현재 세션 ID (게스트/사용자)
  sessionType: 'none', // 'guest', 'user', 'none'
};

// 찜하기 상태 관리 store
export const useWishlistStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 세션 초기화 (게스트/사용자)
      initializeWishlistSession: (sessionId, sessionType) => {
        console.log(`❤️ Initializing wishlist for ${sessionType} session:`, sessionId);
        
        set({ 
          sessionId, 
          sessionType 
        });
        
        // 게스트 세션인 경우 세션 스토리지에서 찜하기 로드
        if (sessionType === 'guest') {
          get().loadGuestWishlist();
        }
      },

      // 게스트 찜하기 로드
      loadGuestWishlist: () => {
        const guestWishlistData = getSessionData('wishlist');
        if (guestWishlistData && Array.isArray(guestWishlistData)) {
          console.log('💝 Loading guest wishlist from session:', guestWishlistData.length, 'items');
          set({ 
            items: guestWishlistData,
            totalCount: guestWishlistData.length
          });
        }
      },

      // 게스트 찜하기 저장
      saveGuestWishlist: () => {
        const { items, sessionType } = get();
        if (sessionType === 'guest') {
          updateSessionData('wishlist', items);
        }
      },

      // 사용자 찜하기로 마이그레이션
      migrateGuestWishlistToUser: (userId) => {
        const { items, sessionType } = get();
        
        if (sessionType === 'guest' && items.length > 0) {
          console.log(`🔄 Migrating ${items.length} items from guest wishlist to user:`, userId);
          
          // 사용자 세션으로 전환
          set({
            sessionId: userId,
            sessionType: 'user'
          });
          
          return {
            success: true,
            migratedItemCount: items.length,
            items: items
          };
        }
        
        return {
          success: false,
          migratedItemCount: 0,
          items: []
        };
      },

      // 찜하기 추가
      addToWishlist: (product) => {
        const { items } = get();
        
        // 이미 존재하는지 확인
        const existingItem = items.find(item => item.productId === product.id);
        if (existingItem) {
          console.log('⚠️ Product already in wishlist:', product.name);
          return false;
        }
        
        // 새 찜하기 아이템 생성
        const newWishlistItem = {
          id: `wishlist_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          productId: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          addedAt: new Date().toISOString(),
          // 상품의 기본 정보만 저장
          brand: product.brand || '',
          category: product.category || {},
          status: product.status || 'active'
        };
        
        const updatedItems = [...items, newWishlistItem];
        set({ 
          items: updatedItems,
          totalCount: updatedItems.length
        });
        
        get().saveGuestWishlist(); // 게스트 세션에 저장
        console.log('💖 Added to wishlist:', product.name);
        return true;
      },

      // 찜하기 제거
      removeFromWishlist: (productId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.productId !== productId);
        
        set({ 
          items: updatedItems,
          totalCount: updatedItems.length
        });
        
        get().saveGuestWishlist(); // 게스트 세션에 저장
        console.log('💔 Removed from wishlist:', productId);
        return true;
      },

      // 찜하기 토글 (있으면 제거, 없으면 추가)
      toggleWishlist: (product) => {
        const { items } = get();
        const existingItem = items.find(item => item.productId === product.id);
        
        if (existingItem) {
          return get().removeFromWishlist(product.id);
        } else {
          return get().addToWishlist(product);
        }
      },

      // 찜하기 전체 삭제
      clearWishlist: () => {
        const { sessionId, sessionType } = get();
        set({
          ...initialState,
          sessionId,
          sessionType
        });
        get().saveGuestWishlist(); // 게스트 세션에 저장
        console.log('🗑️ Wishlist cleared');
      },

      // 여러 아이템 한 번에 삭제
      removeMultipleFromWishlist: (productIds) => {
        const { items } = get();
        const updatedItems = items.filter(item => !productIds.includes(item.productId));
        
        set({ 
          items: updatedItems,
          totalCount: updatedItems.length
        });
        
        get().saveGuestWishlist(); // 게스트 세션에 저장
        console.log('🗑️ Removed multiple items from wishlist:', productIds.length);
        return productIds.length;
      },

      // 찜하기 → 장바구니 이동
      moveToCart: (productId, quantity = 1) => {
        const { items } = get();
        const wishlistItem = items.find(item => item.productId === productId);
        
        if (!wishlistItem) {
          console.log('⚠️ Item not found in wishlist:', productId);
          return false;
        }
        
        // cartStore와 연동하여 장바구니에 추가
        try {
          const { useCartStore } = require('./cartStore');
          const cartStore = useCartStore.getState();
          
          // 찜하기 아이템을 기반으로 상품 객체 재구성
          const productForCart = {
            id: wishlistItem.productId,
            name: wishlistItem.name,
            price: wishlistItem.price,
            image: wishlistItem.image,
            brand: wishlistItem.brand,
            category: wishlistItem.category,
            status: wishlistItem.status
          };
          
          cartStore.addToCart(productForCart, quantity);
          
          // 찜하기에서 제거
          get().removeFromWishlist(productId);
          
          console.log('🛒 Moved to cart from wishlist:', wishlistItem.name);
          return true;
        } catch (error) {
          console.warn('⚠️ Failed to move to cart:', error.message);
          return false;
        }
      },

      // 헬퍼 함수들
      isInWishlist: (productId) => {
        const { items } = get();
        return items.some(item => item.productId === productId);
      },

      getWishlistItem: (productId) => {
        const { items } = get();
        return items.find(item => item.productId === productId);
      },

      getWishlistCount: () => {
        return get().totalCount;
      },

      isEmpty: () => {
        return get().totalCount === 0;
      },

      // 찜하기 정렬
      sortWishlist: (sortBy = 'addedAt', sortOrder = 'desc') => {
        const { items } = get();
        const sortedItems = [...items];
        
        sortedItems.sort((a, b) => {
          let valueA, valueB;
          
          switch (sortBy) {
            case 'name':
              valueA = a.name.toLowerCase();
              valueB = b.name.toLowerCase();
              break;
            case 'price':
              valueA = typeof a.price === 'object' ? (a.price.sale || a.price.regular) : a.price;
              valueB = typeof b.price === 'object' ? (b.price.sale || b.price.regular) : b.price;
              break;
            case 'addedAt':
              valueA = new Date(a.addedAt);
              valueB = new Date(b.addedAt);
              break;
            case 'brand':
              valueA = a.brand.toLowerCase();
              valueB = b.brand.toLowerCase();
              break;
            default:
              valueA = new Date(a.addedAt);
              valueB = new Date(b.addedAt);
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
        
        set({ items: sortedItems });
        get().saveGuestWishlist(); // 게스트 세션에 저장
        return sortedItems;
      },

      // 찜하기 필터링
      filterWishlist: (filters = {}) => {
        const { items } = get();
        
        return items.filter(item => {
          // 브랜드 필터
          if (filters.brand && item.brand !== filters.brand) {
            return false;
          }
          
          // 가격 범위 필터
          if (filters.minPrice || filters.maxPrice) {
            const price = typeof item.price === 'object' ? (item.price.sale || item.price.regular) : item.price;
            if (filters.minPrice && price < filters.minPrice) {
              return false;
            }
            if (filters.maxPrice && price > filters.maxPrice) {
              return false;
            }
          }
          
          // 날짜 범위 필터 (최근 N일)
          if (filters.recentDays) {
            const addedDate = new Date(item.addedAt);
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - filters.recentDays);
            if (addedDate < cutoffDate) {
              return false;
            }
          }
          
          // 검색어 필터
          if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            const searchableText = `${item.name} ${item.brand}`.toLowerCase();
            if (!searchableText.includes(searchTerm)) {
              return false;
            }
          }
          
          return true;
        });
      },

      // 세션 관련 헬퍼 함수들
      getSessionInfo: () => {
        const { sessionId, sessionType } = get();
        return {
          sessionId,
          sessionType,
          isGuest: sessionType === 'guest',
          isUser: sessionType === 'user'
        };
      },

      // 현재 세션의 찜하기 상태
      getWishlistSessionState: () => {
        const { items, totalCount, sessionId, sessionType } = get();
        return {
          sessionId,
          sessionType,
          itemCount: items.length,
          totalCount,
          isEmpty: items.length === 0,
          isGuest: sessionType === 'guest',
          recentItems: items.slice(0, 5) // 최근 5개 아이템
        };
      },

      // 찜하기 통계
      getWishlistStats: () => {
        const { items } = get();
        
        if (items.length === 0) {
          return {
            totalItems: 0,
            totalValue: 0,
            brands: [],
            categories: [],
            oldestItem: null,
            newestItem: null
          };
        }
        
        const brands = [...new Set(items.map(item => item.brand).filter(Boolean))];
        const categories = [...new Set(items.map(item => item.category?.main).filter(Boolean))];
        
        const totalValue = items.reduce((sum, item) => {
          const price = typeof item.price === 'object' ? (item.price.sale || item.price.regular) : item.price;
          return sum + price;
        }, 0);
        
        const sortedByDate = [...items].sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        
        return {
          totalItems: items.length,
          totalValue,
          brands,
          categories,
          oldestItem: sortedByDate[0],
          newestItem: sortedByDate[sortedByDate.length - 1]
        };
      }
    }),
    {
      name: 'wishlist-storage',
      storage: createJSONStorage(),
      // persist 후 콜백으로 totalCount 재계산
      onRehydrateStorage: () => (state) => {
        if (state && state.items) {
          state.totalCount = state.items.length;
        }
      }
    }
  )
);