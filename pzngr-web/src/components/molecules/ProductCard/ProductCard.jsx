import React from "react";
import { useNavigate } from "react-router-dom";
import Text from "../../atoms/Text/Text.jsx";
import { 
  CardContainer, 
  ImageWrapper, 
  ProductImage, 
  InfoSection, 
  ProductInfo, 
  ProductName, 
  ProductPrice
} from "./ProductCard.styles.jsx";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/product/${product.slug}`);
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <ImageWrapper>
        <ProductImage 
          src={product.image} 
          alt={product.imageAlt}
        />
      </ImageWrapper>
      <InfoSection>
        <ProductInfo>
          <ProductName>
            <Text weight="normal">{product.name}</Text>
          </ProductName>
          <ProductPrice>
            <Text weight="bold">{product.price}</Text>
          </ProductPrice>
        </ProductInfo>
      </InfoSection>
    </CardContainer>
  );
};

export default ProductCard;