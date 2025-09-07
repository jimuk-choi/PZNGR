import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from './utils/localStorage';
import { DEFAULT_CATEGORIES, createEmptyCategory, buildCategoryTree, getCategoryPath } from '../models/Category';

const initialState = {
  categories: DEFAULT_CATEGORIES,
  selectedCategoryId: null,
  selectedParentId: null,
  categoryTree: buildCategoryTree(DEFAULT_CATEGORIES),
  loading: false,
  error: null,
};

export const useCategoryStore = create(
  persist(
    (set, get) => ({
      // 상태
      ...initialState,

      // 액션들
      setCategories: (categories) => {
        set({
          categories,
          categoryTree: buildCategoryTree(categories)
        });
      },

      addCategory: (categoryData) => {
        const { categories } = get();
        const newCategory = {
          ...createEmptyCategory(),
          ...categoryData,
          id: `category_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const updatedCategories = [...categories, newCategory];
        set({
          categories: updatedCategories,
          categoryTree: buildCategoryTree(updatedCategories)
        });

        return newCategory;
      },

      updateCategory: (categoryId, updates) => {
        const { categories } = get();
        const updatedCategories = categories.map(category =>
          category.id === categoryId 
            ? { ...category, ...updates, updatedAt: new Date() }
            : category
        );
        
        set({
          categories: updatedCategories,
          categoryTree: buildCategoryTree(updatedCategories)
        });
      },

      removeCategory: (categoryId) => {
        const { categories } = get();
        
        // 하위 카테고리가 있는지 확인
        const hasChildren = categories.some(cat => cat.parentId === categoryId);
        if (hasChildren) {
          throw new Error('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다.');
        }

        const filteredCategories = categories.filter(category => category.id !== categoryId);
        set({
          categories: filteredCategories,
          categoryTree: buildCategoryTree(filteredCategories)
        });
      },

      setSelectedCategory: (categoryId) => {
        set({ selectedCategoryId: categoryId });
      },

      setSelectedParent: (parentId) => {
        set({ selectedParentId: parentId });
      },

      setLoading: (loading) => {
        set({ loading });
      },

      setError: (error) => {
        set({ error });
      },

      // 헬퍼 함수들
      getCategoryById: (categoryId) => {
        const { categories } = get();
        return categories.find(category => category.id === categoryId);
      },

      getCategoriesByParent: (parentId) => {
        const { categories } = get();
        return categories
          .filter(category => category.parentId === parentId)
          .sort((a, b) => a.sortOrder - b.sortOrder);
      },

      getRootCategories: () => {
        return get().getCategoriesByParent(null);
      },

      getChildCategories: (parentId) => {
        return get().getCategoriesByParent(parentId);
      },

      getCategoryPath: (categoryId) => {
        const { categories } = get();
        return getCategoryPath(categories, categoryId);
      },

      getCategoryTree: () => {
        const { categoryTree } = get();
        return categoryTree;
      },

      getActiveCategories: () => {
        const { categories } = get();
        return categories.filter(category => category.isActive);
      },

      getMenuCategories: () => {
        const { categories } = get();
        return categories.filter(category => category.showInMenu && category.isActive);
      },

      searchCategories: (query) => {
        const { categories } = get();
        if (!query) return categories;
        
        const lowercaseQuery = query.toLowerCase();
        return categories.filter(category =>
          category.name.toLowerCase().includes(lowercaseQuery) ||
          category.description.toLowerCase().includes(lowercaseQuery)
        );
      },

      getCategoryStats: (categoryId) => {
        const category = get().getCategoryById(categoryId);
        return category ? category.stats : null;
      },

      updateCategoryStats: (categoryId, stats) => {
        get().updateCategory(categoryId, { stats });
      },

      incrementCategoryViewCount: (categoryId) => {
        const category = get().getCategoryById(categoryId);
        if (category) {
          const newStats = {
            ...category.stats,
            viewCount: category.stats.viewCount + 1
          };
          get().updateCategory(categoryId, { stats: newStats });
        }
      },

      updateCategoryProductCount: (categoryId, productCount) => {
        const category = get().getCategoryById(categoryId);
        if (category) {
          const newStats = {
            ...category.stats,
            productCount
          };
          get().updateCategory(categoryId, { stats: newStats });
        }
      },

      toggleCategoryActive: (categoryId) => {
        const category = get().getCategoryById(categoryId);
        if (category) {
          get().updateCategory(categoryId, { isActive: !category.isActive });
        }
      },

      toggleCategoryInMenu: (categoryId) => {
        const category = get().getCategoryById(categoryId);
        if (category) {
          get().updateCategory(categoryId, { showInMenu: !category.showInMenu });
        }
      },

      reorderCategories: (categoryIds, parentId = null) => {
        const { categories } = get();
        const updatedCategories = categories.map(category => {
          if (category.parentId === parentId) {
            const newIndex = categoryIds.indexOf(category.id);
            return newIndex >= 0 
              ? { ...category, sortOrder: newIndex, updatedAt: new Date() }
              : category;
          }
          return category;
        });

        set({
          categories: updatedCategories,
          categoryTree: buildCategoryTree(updatedCategories)
        });
      },

      moveCategory: (categoryId, newParentId) => {
        const { categories } = get();
        const category = categories.find(cat => cat.id === categoryId);
        
        if (!category) return;

        // 무한 루프 방지: 자신의 하위 카테고리로 이동하는지 확인
        if (newParentId) {
          const path = getCategoryPath(categories, newParentId);
          if (path.some(cat => cat.id === categoryId)) {
            throw new Error('카테고리를 자신의 하위 카테고리로 이동할 수 없습니다.');
          }
        }

        const newLevel = newParentId 
          ? (categories.find(cat => cat.id === newParentId)?.level || 0) + 1 
          : 0;

        get().updateCategory(categoryId, { 
          parentId: newParentId, 
          level: newLevel 
        });
      },

      resetCategories: () => {
        set({
          categories: DEFAULT_CATEGORIES,
          categoryTree: buildCategoryTree(DEFAULT_CATEGORIES),
          selectedCategoryId: null,
          selectedParentId: null,
          loading: false,
          error: null
        });
      }
    }),
    {
      name: 'category-storage',
      storage: createJSONStorage(),
    }
  )
);