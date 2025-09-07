import React from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import Text from "../../atoms/Text/Text.jsx";
import { useUserStore } from "../../../stores/userStore";
import { useProductStore } from "../../../stores/productStore";
import { 
  CardContainer, 
  ImageWrapper, 
  ProductImage, 
  InfoSection, 
  ProductInfo, 
  ProductName, 
  ProductPrice,
  ActionButtons,
  ActionButton
} from "./ProductCard.styles.jsx";

const ProductCard = ({ product, showAdminControls = false }) => {
  const navigate = useNavigate();
  const isAdmin = useUserStore((state) => state.isAdmin());
  const removeProduct = useProductStore((state) => state.removeProduct);

  const handleCardClick = (e) => {
    if (e.target.closest('[data-admin-action]')) {
      return;
    }
    navigate(`/product/${product.seo?.slug || product.id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/admin/products/edit/${product.id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    
    const confirmDelete = window.confirm(
      `정말로 "${product.name}" 상품을 삭제하시겠습니까?\n\n삭제된 상품은 복구할 수 없습니다.`
    );
    
    if (confirmDelete) {
      removeProduct(product.id);
      alert('상품이 삭제되었습니다.');
    }
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
        {(isAdmin || showAdminControls) && (
          <ActionButtons>
            <ActionButton 
              onClick={handleEdit}
              data-admin-action="edit"
              title="상품 수정"
            >
              <Edit2 />
            </ActionButton>
            <ActionButton 
              onClick={handleDelete}
              data-admin-action="delete"
              title="상품 삭제"
            >
              <Trash2 />
            </ActionButton>
          </ActionButtons>
        )}
      </InfoSection>
    </CardContainer>
  );
};

export default ProductCard;