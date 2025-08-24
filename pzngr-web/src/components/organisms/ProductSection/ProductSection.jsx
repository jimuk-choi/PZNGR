import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../atoms/Container/Container.jsx";
import Text from "../../atoms/Text/Text.jsx";
import DACT from "../../atoms/Image/DA_CT.jpg";
import DAHS from "../../atoms/Image/DA_HS.jpg";
import DANV from "../../atoms/Image/DA_NV.jpg";
import DAOat from "../../atoms/Image/DA_Oat.jpg";
import DPSBCC from "../../atoms/Image/DPSB_CC.jpg";
import DPSBHO from "../../atoms/Image/DPSB_HO.jpg";
import DPSBLN from "../../atoms/Image/DPSB_LN.jpg";
import {
  ProductSectionContainer,
  ProductTitle,
  ProductBox,
  ProductCard,
  ProductImageWrapper,
  ProductImage,
  ProductInfo,
  ProductDetails,
  ProductName,
  ProductPrice,
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

  // 상품 데이터
  const products = [
    {
      id: 1,
      name: "Doodle Arch T-Shirt - Scarlet Oat",
      price: "32,000 원",
      image: DAOat,
    },
    {
      id: 2,
      name: "Doodle Arch T-Shirt - Chestnut Tiramisu",
      price: "32,000 원",
      image: DACT,
    },
    {
      id: 3,
      name: "Doodle Arch T-Shirt - Harris The Sky",
      price: "32,000 원",
      image: DAHS,
    },
    {
      id: 4,
      name: "Doodle Arch T-Shirt - Old Forest",
      price: "32,000 원",
      image: DANV,
    },
    {
      id: 5,
      name: "Doodle Plane SB - Halloween Orange",
      price: "25,000 원",
      image: DPSBHO,
    },
    {
      id: 6,
      name: "Doodle Plane SB - Lemon Navy",
      price: "25,000 원",
      image: DPSBLN,
    },
    {
      id: 7,
      name: "Doodle Plane SB - Cacao Cream",
      price: "25,000 원",
      image: DPSBCC,
    },
  ];

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
            <ProductCard key={product.id}>
              <ProductImageWrapper>
                <ProductImage src={product.image} alt={product.name} />
              </ProductImageWrapper>

              <ProductInfo>
                <ProductDetails>
                  <ProductName>
                    <Text weight="normal">{product.name}</Text>
                  </ProductName>
                  <ProductPrice>
                    <Text weight="bold">{product.price}</Text>
                  </ProductPrice>
                </ProductDetails>

                {/* <ProductActions>
                  <ActionButton onClick={() => handleAddToCart(product.id)}>
                    <Icon name="shopping_basket" size={getIconSize()} />
                  </ActionButton>
                  <ActionButton onClick={() => handleAddToWishlist(product.id)}>
                    <Icon name="favorite" size={getIconSize()} />
                  </ActionButton>
                </ProductActions> */}
              </ProductInfo>
            </ProductCard>
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
