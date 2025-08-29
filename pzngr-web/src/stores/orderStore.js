import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';

// 주문 상태 옵션
export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

// 초기 상태
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

// 주문 상태 관리 store
export const useOrderStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 액션들
      createOrder: (orderData) => {
        const newOrder = {
          id: `order_${Date.now()}`,
          userId: orderData.userId,
          items: orderData.items.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          totalPrice: orderData.totalPrice,
          status: ORDER_STATUS.PENDING,
          createdAt: new Date().toISOString(),
          shippingAddress: {
            name: orderData.shippingAddress?.name || '',
            phone: orderData.shippingAddress?.phone || '',
            address: orderData.shippingAddress?.address || '',
            detailAddress: orderData.shippingAddress?.detailAddress || '',
            zipCode: orderData.shippingAddress?.zipCode || ''
          },
          paymentMethod: orderData.paymentMethod || 'card',
          orderNote: orderData.orderNote || ''
        };

        const { orders } = get();
        set({ 
          orders: [newOrder, ...orders],
          currentOrder: newOrder 
        });

        return newOrder;
      },

      updateOrderStatus: (orderId, status) => {
        const { orders } = get();
        const updatedOrders = orders.map(order =>
          order.id === orderId ? { ...order, status } : order
        );
        set({ orders: updatedOrders });

        // 현재 주문도 업데이트
        const { currentOrder } = get();
        if (currentOrder && currentOrder.id === orderId) {
          set({ currentOrder: { ...currentOrder, status } });
        }
      },

      cancelOrder: (orderId) => {
        get().updateOrderStatus(orderId, ORDER_STATUS.CANCELLED);
      },

      setCurrentOrder: (order) => {
        set({ currentOrder: order });
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      // 헬퍼 함수들
      getOrderById: (orderId) => {
        const { orders } = get();
        return orders.find(order => order.id === orderId);
      },

      getUserOrders: (userId) => {
        const { orders } = get();
        return orders.filter(order => order.userId === userId);
      },

      getOrdersByStatus: (status) => {
        const { orders } = get();
        return orders.filter(order => order.status === status);
      },

      getTotalOrderValue: (userId = null) => {
        const { orders } = get();
        const filteredOrders = userId 
          ? orders.filter(order => order.userId === userId)
          : orders;
        
        return filteredOrders.reduce((total, order) => {
          if (order.status !== ORDER_STATUS.CANCELLED) {
            return total + order.totalPrice;
          }
          return total;
        }, 0);
      },

      getOrderStatusText: (status) => {
        const statusTexts = {
          [ORDER_STATUS.PENDING]: '주문 대기',
          [ORDER_STATUS.CONFIRMED]: '주문 확인',
          [ORDER_STATUS.SHIPPED]: '배송 중',
          [ORDER_STATUS.DELIVERED]: '배송 완료',
          [ORDER_STATUS.CANCELLED]: '주문 취소'
        };
        return statusTexts[status] || '알 수 없음';
      },

      getFormattedOrderDate: (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });
      },

      canCancelOrder: (order) => {
        return order.status === ORDER_STATUS.PENDING || order.status === ORDER_STATUS.CONFIRMED;
      },

      getRecentOrders: (userId, limit = 5) => {
        const userOrders = get().getUserOrders(userId);
        return userOrders.slice(0, limit);
      }
    }),
    {
      name: 'order-storage',
      storage: createJSONStorage(),
    }
  )
);