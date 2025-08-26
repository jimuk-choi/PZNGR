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