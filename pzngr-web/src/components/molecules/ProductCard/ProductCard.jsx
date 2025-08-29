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
    navigate(`/product/${product.seo?.slug || product.id}`);
  };

  return (
    <CardContainer onClick={handleCardClick}>
      <ImageWrapper>
        <ProductImage 
          src={product.images?.main || product.image} 
          alt={product.name}
        />
      </ImageWrapper>
      <InfoSection>
        <ProductInfo>
          <ProductName>
            <Text weight="normal">{product.name}</Text>
          </ProductName>
          <ProductPrice>
            <Text weight="bold">
              {typeof product.price === 'string' 
                ? product.price 
                : `${(product.price.sale || product.price.regular).toLocaleString('ko-KR')} 원`
              }
            </Text>
          </ProductPrice>
        </ProductInfo>
      </InfoSection>
    </CardContainer>
  );
};

export default ProductCard;