import React from "react";
import { useParams } from "react-router-dom";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import { products } from "../../shared/data/products.js";
import {
  ProductDetailContainer,
  ProductImageContainer,
  ProductImage,
  ProductInfoContainer,
  ProductName,
  ProductPrice
} from "./ProductDetail.styles.jsx";

const ProductDetail = () => {
  const { slug } = useParams();
  const product = products.find(p => p.slug === slug);

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

  return (
    <PageTemplate>
      <ProductDetailContainer>
        <Container>
          <ProductImageContainer>
            <ProductImage 
              src={product.image} 
              alt={product.imageAlt}
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
                {product.price}
              </Text>
            </ProductPrice>
          </ProductInfoContainer>
        </Container>
      </ProductDetailContainer>
    </PageTemplate>
  );
};

export default ProductDetail;