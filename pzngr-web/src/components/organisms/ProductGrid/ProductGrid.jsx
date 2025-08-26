import React from "react";
import Container from "../../atoms/Container/Container.jsx";
import Text from "../../atoms/Text/Text.jsx";
import ProductCard from "../../molecules/ProductCard/ProductCard.jsx";
import { 
  GridContainer, 
  TitleContainer, 
  ProductWrapper 
} from "./ProductGrid.styles.jsx";

const ProductGrid = ({ products, onAddToCart, onAddToWishlist }) => {
  return (
    <GridContainer>
      <Container>
        <TitleContainer>
          <Text size="xxl" weight="semibold">
            Product
          </Text>
        </TitleContainer>

        <ProductWrapper>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onAddToWishlist={onAddToWishlist}
            />
          ))}
        </ProductWrapper>
      </Container>
    </GridContainer>
  );
};

export default ProductGrid;