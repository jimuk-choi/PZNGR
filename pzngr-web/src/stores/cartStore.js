import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';

// 초기 상태
const initialState = {
  items: [],
  totalCount: 0,
  totalPrice: 0,
};

// 장바구니 상태 관리 store
export const useCartStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 액션들
      addToCart: (product, quantity = 1, selectedOptions = []) => {
        const { items } = get();
        
        // 옵션까지 고려한 고유 식별자 생성 (향후 사용 예정)
        // const optionKey = selectedOptions
        //   .map(opt => `${opt.optionType}:${opt.optionValue}`)
        //   .sort()
        //   .join('|');
        // const itemKey = `${product.id}_${optionKey}`;  // 향후 사용 예정
        
        // 같은 상품, 같은 옵션 조합인지 확인
        const existingItem = items.find(item => 
          item.productId === product.id && 
          JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(selectedOptions.sort())
        );

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
            finalPrice: finalPrice
          };
          updatedItems = [...items, newItem];
        }

        set({ items: updatedItems });
        get().calculateTotals();
      },

      removeFromCart: (itemId) => {
        const { items } = get();
        const updatedItems = items.filter(item => item.id !== itemId);
        set({ items: updatedItems });
        get().calculateTotals();
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
        set(initialState);
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

      // 옵션 관련 헬퍼 함수들
      getCartItemWithOptions: (productId, selectedOptions = []) => {
        const { items } = get();
        return items.find(item => 
          item.productId === productId && 
          JSON.stringify(item.selectedOptions.sort()) === JSON.stringify(selectedOptions.sort())
        );
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