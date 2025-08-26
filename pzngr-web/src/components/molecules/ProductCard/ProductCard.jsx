import React from "react";
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
  return (
    <CardContainer>
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