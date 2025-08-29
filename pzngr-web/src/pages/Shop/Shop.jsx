import React from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import ProductCard from "../../components/molecules/ProductCard/ProductCard.jsx";
import { mockProducts } from "../../data/mockProducts.js";
import {
  ProductSectionContainer,
  ProductTitle,
  ProductBox,
} from "../../components/organisms/ProductSection/ProductSection.styles.jsx";

const Shop = () => {
  return (
    <PageTemplate>
      <ProductSectionContainer>
        <Container>
          <ProductTitle>
            <Text size="xxl" weight="semibold">
              Shop
            </Text>
          </ProductTitle>

          <ProductBox>
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </ProductBox>
        </Container>
      </ProductSectionContainer>
    </PageTemplate>
  );
};

export default Shop;
