import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';

// 초기 상태
const initialState = {
  isLoggedIn: false,
  user: null,
};

// 사용자 상태 관리 store
export const useUserStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 액션들
      login: (userData) => {
        set({
          isLoggedIn: true,
          user: {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            isAdmin: userData.isAdmin || false,
          },
        });
      },

      logout: () => {
        set(initialState);
      },

      updateUser: (userData) => {
        const { user } = get();
        if (user) {
          set({
            user: {
              ...user,
              ...userData,
            },
          });
        }
      },

      // 헬퍼 함수들
      getCurrentUser: () => get().user,
      isAuthenticated: () => get().isLoggedIn,
      isAdmin: () => get().user?.isAdmin || false,
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(),
    }
  )
);