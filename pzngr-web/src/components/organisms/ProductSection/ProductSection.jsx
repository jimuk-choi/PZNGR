import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../atoms/Container/Container.jsx";
import Text from "../../atoms/Text/Text.jsx";
import ProductCard from "../../molecules/ProductCard/ProductCard.jsx";
import { products } from "../../../shared/data/products.js";
import {
  ProductSectionContainer,
  ProductTitle,
  ProductBox,
  ShowMoreButton,
} from "./ProductSection.styles.jsx";

const ProductSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 375);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  const handleShowMore = () => {
    navigate('/shop');
  };

  const getDisplayedProducts = () => {
    if (isMobile) {
      return products.slice(0, 3);
    }
    return products.slice(0, 7);
  };

  return (
    <ProductSectionContainer>
      <Container>
        <ProductTitle>
          <Text size="xxl" weight="semibold">
            Product
          </Text>
        </ProductTitle>

        <ProductBox>
          {getDisplayedProducts().map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </ProductBox>

        {isMobile && products.length > 3 && (
          <ShowMoreButton onClick={handleShowMore}>
            <Text size="sm" weight="normal">
              더보기
            </Text>
          </ShowMoreButton>
        )}
      </Container>
    </ProductSectionContainer>
  );
};

ProductSection.displayName = "ProductSection";

export default ProductSection;
