import styled from "styled-components";
import { maxMedia } from "../../shared/styles/breakpoints.jsx";

export const ProductDetailContainer = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxxxxxl} 0;
  
  ${maxMedia.mobile`
    padding: ${({ theme }) => theme.spacing.xxxl} 0;
  `}
`;

export const ProductImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xxxxl};
  
  ${maxMedia.mobile`
    margin-bottom: ${({ theme }) => theme.spacing.xxxl};
  `}
`;

export const ProductImage = styled.img`
  width: 400px;
  height: 400px;
  object-fit: cover;
  border-radius: 8px;
  
  ${maxMedia.tablet`
    width: 320px;
    height: 320px;
  `}
  
  ${maxMedia.mobile`
    width: 280px;
    height: 280px;
  `}
`;

export const ProductInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  
  ${maxMedia.mobile`
    gap: ${({ theme }) => theme.spacing.md};
  `}
`;

export const ProductName = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;

export const ProductPrice = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.black};
`;

export const ProductDescription = styled.div`
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

export const ProductOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin: ${({ theme }) => theme.spacing.lg} 0;
`;

export const ProductActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  
  > div {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.xs};
    
    span {
      min-width: 40px;
      text-align: center;
      font-weight: 500;
      font-size: 16px;
      padding: 0 ${({ theme }) => theme.spacing.sm};
    }
  }
`;

export const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const AddToCartButton = styled.div`
  width: 100%;
  max-width: 300px;
`;