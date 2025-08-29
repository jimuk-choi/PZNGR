import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import Button from "../../components/atoms/Button/Button.jsx";
import { mockProducts } from "../../data/mockProducts.js";
import { useCartStore } from "../../stores/cartStore.js";
import {
  ProductDetailContainer,
  ProductImageContainer,
  ProductImage,
  ProductInfoContainer,
  ProductName,
  ProductPrice,
  ProductDescription,
  // ProductOptions, // 현재 미사용
  ProductActions,
  QuantitySelector,
  QuantityButton,
  AddToCartButton,
} from "./ProductDetail.styles.jsx";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = mockProducts.find(p => p.seo?.slug === slug || p.id === slug);
  const { addToCart, getProductQuantityInCart } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions] = useState([]);

  // 상품이 없으면 404 처리
  if (!product) {
    return (
      <PageTemplate>
        <Container variant="center" padding="xxxxxl">
          <Text size="xl" weight="bold">상품을 찾을 수 없습니다.</Text>
        </Container>
      </PageTemplate>
    );
  }

  const handleQuantityChange = (change) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // 상품 데이터를 장바구니 스토어가 기대하는 형태로 변환
    const productForCart = {
      id: product.id,
      name: product.name,
      price: product.price.sale || product.price.regular, // 새 구조의 price 사용
      image: product.images.main,
      description: product.description || product.shortDescription,
      category: product.category.main || '',
      stock: product.inventory?.total || 100
    };

    addToCart(productForCart, quantity, selectedOptions);
    alert(`${product.name}이(가) 장바구니에 추가되었습니다!`);
  };

  const currentQuantityInCart = getProductQuantityInCart(product.id);

  return (
    <PageTemplate>
      <ProductDetailContainer>
        <Container>
          <ProductImageContainer>
            <ProductImage 
              src={product.images.main} 
              alt={product.name}
            />
          </ProductImageContainer>
          
          <ProductInfoContainer>
            <ProductName>
              <Text size="xxl" weight="semibold">
                {product.name}
              </Text>
            </ProductName>
            
            <ProductPrice>
              <Text size="xl" weight="bold">
                {(product.price.sale || product.price.regular).toLocaleString('ko-KR')} 원
              </Text>
            </ProductPrice>

            {product.description && (
              <ProductDescription>
                <Text size="md" color="gray">
                  {product.description}
                </Text>
              </ProductDescription>
            )}

            {currentQuantityInCart > 0 && (
              <Text size="sm" color="primary">
                현재 장바구니에 {currentQuantityInCart}개 담겨있습니다.
              </Text>
            )}

            <ProductActions>
              <QuantitySelector>
                <Text size="sm" weight="medium">수량:</Text>
                <div>
                  <QuantityButton onClick={() => handleQuantityChange(-1)}>
                    -
                  </QuantityButton>
                  <span>{quantity}</span>
                  <QuantityButton onClick={() => handleQuantityChange(1)}>
                    +
                  </QuantityButton>
                </div>
              </QuantitySelector>

              <AddToCartButton>
                <Button variant="primary" size="large" onClick={handleAddToCart}>
                  장바구니 담기
                </Button>
              </AddToCartButton>
            </ProductActions>
          </ProductInfoContainer>
        </Container>
      </ProductDetailContainer>
    </PageTemplate>
  );
};

export default ProductDetail;