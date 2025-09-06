import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';
import { updateSessionData, getSessionData } from '../utils/sessionManager';

// 초기 상태
const initialState = {
  items: [],
  totalCount: 0,
  totalPrice: 0,
  sessionId: null, // 현재 세션 ID (게스트/사용자)
  sessionType: 'none', // 'guest', 'user', 'none'
};

// 장바구니 상태 관리 store
export const useCartStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 세션 초기화 (게스트/사용자)
      initializeCartSession: (sessionId, sessionType) => {
        console.log(`🛒 Initializing cart for ${sessionType} session:`, sessionId);
        
        set({ 
          sessionId, 
          sessionType 
        });
        
        // 게스트 세션인 경우 세션 스토리지에서 장바구니 로드
        if (sessionType === 'guest') {
          get().loadGuestCart();
        }
      },

      // 게스트 장바구니 로드
      loadGuestCart: () => {
        const guestCartData = getSessionData('cart');
        if (guestCartData && Array.isArray(guestCartData)) {
          console.log('📦 Loading guest cart from session:', guestCartData.length, 'items');
          set({ items: guestCartData });
          get().calculateTotals();
        }
      },

      // 게스트 장바구니 저장
      saveGuestCart: () => {
        const { items, sessionType } = get();
        if (sessionType === 'guest') {
          updateSessionData('cart', items);
        }
      },

      // 사용자 장바구니로 마이그레이션
      migrateGuestCartToUser: (userId) => {
        const { items, sessionType } = get();
        
        if (sessionType === 'guest' && items.length > 0) {
          console.log(`🔄 Migrating ${items.length} items from guest cart to user:`, userId);
          
          // 사용자 세션으로 전환
          set({
            sessionId: userId,
            sessionType: 'user'
          });
          
          // 기존 아이템들을 유지하고 totals 재계산
          get().calculateTotals();
          
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

      // 액션들
      addToCart: (product, quantity = 1, selectedOptions = []) => {
        const { items } = get();
        
        // 옵션까지 고려한 고유 식별자 생성 (최적화됨)
        const optionKey = selectedOptions
          .map(opt => `${opt.optionType || opt.type}:${opt.optionValue || opt.value}`)
          .sort()
          .join('|');
        
        // 성능 최적화: 미리 계산된 키로 기존 아이템 찾기
        const existingItem = items.find(item => {
          if (item.productId !== product.id) return false;
          
          // 옵션이 없는 경우 처리
          if (!selectedOptions.length && !item.selectedOptions?.length) return true;
          if (!selectedOptions.length || !item.selectedOptions?.length) return false;
          
          // 옵션 개수가 다르면 바로 false
          if (selectedOptions.length !== item.selectedOptions.length) return false;
          
          // 캐시된 키로 빠른 비교 (없으면 생성)
          if (!item._optionKey) {
            item._optionKey = item.selectedOptions
              .map(opt => `${opt.optionType || opt.type}:${opt.optionValue || opt.value}`)
              .sort()
              .join('|');
          }
          
          return item._optionKey === optionKey;
        });

        // 옵션 추가 가격 계산
        const additionalPrice = selectedOptions.reduce((sum, opt) => sum + (opt.additionalPrice || 0), 0);
        const finalPrice = product.price + additionalPrice;

        let updatedItems;
        if (existingItem) {
          // 기존 아이템이 있으면 수량 증가
          updatedItems = items.map(item =>
            item.id === existingItem.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // 새 아이템 추가
          const newItem = {
            id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            productId: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            image: product.image,
            selectedOptions: selectedOptions,
            finalPrice: finalPrice,
            _optionKey: optionKey // 성능을 위한 캐시된 키 저장
          };
          updatedItems = [...items, newItem];
        }

        set({ items: updatedItems });
        get().calculateTotals();
        get().saveGuestCart(); // 게스트 세션에 저장
      },

      removeFromCart: (itemId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== itemId);
        set({ items: updatedItems });
        get().calculateTotals();
        get().saveGuestCart(); // 게스트 세션에 저장
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(itemId);
          return;
        }

        const { items } = get();
        const updatedItems = items.map(item =>
          item.id === itemId ? { ...item, quantity } : item
        );
        set({ items: updatedItems });
        get().calculateTotals();
        get().saveGuestCart(); // 게스트 세션에 저장
      },

      increaseQuantity: (itemId) => {
        const { items } = get();
        const item = items.find(item => item.id === itemId);
        if (item) {
          get().updateQuantity(itemId, item.quantity + 1);
        }
      },

      decreaseQuantity: (itemId) => {
        const { items } = get();
        const item = items.find(item => item.id === itemId);
        if (item && item.quantity > 1) {
          get().updateQuantity(itemId, item.quantity - 1);
        } else if (item && item.quantity === 1) {
          get().removeFromCart(itemId);
        }
      },

      clearCart: () => {
        const { sessionId, sessionType } = get();
        set({
          ...initialState,
          sessionId,
          sessionType
        });
        get().saveGuestCart(); // 게스트 세션에 저장
      },

      calculateTotals: () => {
        const { items } = get();
        const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = items.reduce((sum, item) => {
          const itemPrice = item.finalPrice || item.price;
          return sum + (itemPrice * item.quantity);
        }, 0);
        
        set({ totalCount, totalPrice });
      },

      // 헬퍼 함수들
      getCartItem: (itemId) => {
        const { items } = get();
        return items.find(item => item.id === itemId);
      },

      getCartItemByProductId: (productId) => {
        const { items } = get();
        return items.find(item => item.productId === productId);
      },

      isInCart: (productId) => {
        return !!get().getCartItemByProductId(productId);
      },

      getProductQuantityInCart: (productId) => {
        const item = get().getCartItemByProductId(productId);
        return item ? item.quantity : 0;
      },

      isEmpty: () => {
        return get().items.length === 0;
      },

      getFormattedTotalPrice: () => {
        const { totalPrice } = get();
        return totalPrice.toLocaleString('ko-KR') + ' 원';
      },

      // 옵션 관련 헬퍼 함수들 (최적화됨)
      getCartItemWithOptions: (productId, selectedOptions = []) => {
        const { items } = get();
        
        // 빠른 옵션 키 생성
        const targetOptionKey = selectedOptions
          .map(opt => `${opt.optionType || opt.type}:${opt.optionValue || opt.value}`)
          .sort()
          .join('|');
        
        return items.find(item => {
          if (item.productId !== productId) return false;
          
          // 옵션이 없는 경우 처리
          if (!selectedOptions.length && !item.selectedOptions?.length) return true;
          if (!selectedOptions.length || !item.selectedOptions?.length) return false;
          
          // 캐시된 키가 있으면 사용, 없으면 생성
          if (!item._optionKey) {
            item._optionKey = item.selectedOptions
              .map(opt => `${opt.optionType || opt.type}:${opt.optionValue || opt.value}`)
              .sort()
              .join('|');
          }
          
          return item._optionKey === targetOptionKey;
        });
      },

      isInCartWithOptions: (productId, selectedOptions = []) => {
        return !!get().getCartItemWithOptions(productId, selectedOptions);
      },

      getProductQuantityInCartWithOptions: (productId, selectedOptions = []) => {
        const item = get().getCartItemWithOptions(productId, selectedOptions);
        return item ? item.quantity : 0;
      },

      getItemDisplayName: (item) => {
        if (!item.selectedOptions || item.selectedOptions.length === 0) {
          return item.name;
        }
        
        const optionText = item.selectedOptions
          .map(opt => opt.optionName || opt.optionValue)
          .join(', ');
        
        return `${item.name} (${optionText})`;
      },

      getItemFinalPrice: (item) => {
        return item.finalPrice || item.price;
      },

      getFormattedItemPrice: (item) => {
        const price = get().getItemFinalPrice(item);
        return price.toLocaleString('ko-KR') + ' 원';
      },

      // 선택된 옵션들의 추가 가격 총합
      getOptionsAdditionalPrice: (selectedOptions) => {
        return selectedOptions.reduce((sum, opt) => sum + (opt.additionalPrice || 0), 0);
      },

      // 장바구니에 담긴 같은 상품의 다른 옵션들 개수
      getProductVariantCount: (productId) => {
        const { items } = get();
        return items.filter(item => item.productId === productId).length;
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

      // 현재 세션의 장바구니 상태
      getCartSessionState: () => {
        const { items, totalCount, totalPrice, sessionId, sessionType } = get();
        return {
          sessionId,
          sessionType,
          itemCount: items.length,
          totalCount,
          totalPrice,
          isEmpty: items.length === 0,
          isGuest: sessionType === 'guest'
        };
      }
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(),
      // persist 후 콜백으로 totals 재계산
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.calculateTotals();
        }
      }
    }
  )
);