import React, { useState, useMemo } from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import Button from "../../components/atoms/Button/Button.jsx";
import ProductCard from "../../components/molecules/ProductCard/ProductCard.jsx";
import { useProductStore } from "../../stores/productStore";
import { useCategoryStore } from "../../stores/categoryStore";
import {
  ProductSectionContainer,
  ProductTitle,
  ProductBox,
} from "../../components/organisms/ProductSection/ProductSection.styles.jsx";
import * as S from "./Shop.styles";

const Shop = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  
  const products = useProductStore((state) => state.products);
  const { 
    getActiveCategories, 
    getCategoryById,
    getChildCategories
  } = useCategoryStore();

  // 필터링된 상품들
  const filteredProducts = useMemo(() => {
    if (selectedCategoryId === 'all') {
      return products;
    }
    
    // 선택된 카테고리와 그 하위 카테고리들의 ID를 수집
    const getCategoryWithChildren = (categoryId) => {
      const categoryIds = [categoryId];
      const children = getChildCategories(categoryId);
      children.forEach(child => {
        categoryIds.push(...getCategoryWithChildren(child.id));
      });
      return categoryIds;
    };
    
    const targetCategoryIds = getCategoryWithChildren(selectedCategoryId);
    
    return products.filter(product => 
      targetCategoryIds.includes(product.category)
    );
  }, [products, selectedCategoryId, getChildCategories]);

  const categories = getActiveCategories();
  const selectedCategory = getCategoryById(selectedCategoryId);

  return (
    <PageTemplate>
      <ProductSectionContainer>
        <Container>
          <ProductTitle>
            <Text size="xxl" weight="semibold">
              Shop
            </Text>
            {selectedCategory && (
              <Text size="lg" color="gray">
                {selectedCategory.description}
              </Text>
            )}
          </ProductTitle>

          {/* 카테고리 필터 */}
          <S.CategoryFilter>
            <S.CategoryFilterTitle>
              <Text size="lg" weight="medium">카테고리</Text>
            </S.CategoryFilterTitle>
            <S.CategoryButtons>
              <Button
                variant={selectedCategoryId === 'all' ? 'primary' : 'outline'}
                size="medium"
                onClick={() => setSelectedCategoryId('all')}
              >
                전체 ({products.length})
              </Button>
              {categories.map(category => {
                const categoryProductCount = products.filter(p => {
                  const getCategoryWithChildren = (categoryId) => {
                    const categoryIds = [categoryId];
                    const children = getChildCategories(categoryId);
                    children.forEach(child => {
                      categoryIds.push(...getCategoryWithChildren(child.id));
                    });
                    return categoryIds;
                  };
                  const targetCategoryIds = getCategoryWithChildren(category.id);
                  return targetCategoryIds.includes(p.category);
                }).length;

                return (
                  <Button
                    key={category.id}
                    variant={selectedCategoryId === category.id ? 'primary' : 'outline'}
                    size="medium"
                    onClick={() => setSelectedCategoryId(category.id)}
                  >
                    {category.icon && <S.CategoryIcon>{category.icon}</S.CategoryIcon>}
                    {category.name} ({categoryProductCount})
                  </Button>
                );
              })}
            </S.CategoryButtons>
          </S.CategoryFilter>

          {/* 상품 결과 */}
          <S.ProductResults>
            <S.ResultsHeader>
              <Text size="md" color="gray">
                {filteredProducts.length}개의 상품이 있습니다
                {selectedCategory && ` (${selectedCategory.name})`}
              </Text>
            </S.ResultsHeader>
            
            {filteredProducts.length > 0 ? (
              <ProductBox>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </ProductBox>
            ) : (
              <S.EmptyState>
                <Text size="lg" color="gray">
                  {selectedCategory 
                    ? `${selectedCategory.name} 카테고리에 상품이 없습니다.`
                    : '상품이 없습니다.'
                  }
                </Text>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategoryId('all')}
                >
                  전체 상품 보기
                </Button>
              </S.EmptyState>
            )}
          </S.ProductResults>
        </Container>
      </ProductSectionContainer>
    </PageTemplate>
  );
};

export default Shop;
