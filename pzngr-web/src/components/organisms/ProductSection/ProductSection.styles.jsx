import styled from "styled-components";
import { maxMedia } from "../../../shared/styles/breakpoints";

export const ProductSectionContainer = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxxxxxl} 0
    ${({ theme }) => theme.spacing.xxxxxxl} 0;
  ${maxMedia.mobile`
    padding: ${({ theme }) => theme.spacing.xxxl} 0 ${({ theme }) =>
    theme.spacing.xxxl} 0; 
  `}
`;

export const ProductTitle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xxxxxxxxxl};
`;

export const ProductBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xxxxl};
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.xxxxl};

  /* Desktop styling - default */
  ${maxMedia.desktopM`
    justify-content: center;
  `}

  /* Mobile styling */
  ${maxMedia.mobile`
    padding: 0 ${({ theme }) => theme.spacing.xl};
    justify-content: center;
  `}
`;

export const ProductCard = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  width: 384px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  ${maxMedia.mobile`
    gap: ${({ theme }) => theme.spacing.xs};
  `}
`;

export const ProductImageWrapper = styled.div`
  width: 280px;
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 8px;
`;

export const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;

  transition: ${({ theme }) => theme.transitions.medium};
  /* &:hover {
    transform: scale(1.05);
  } */
`;

export const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

export const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  ${maxMedia.desktopM`
    align-items: center
  `}
`;

export const ProductName = styled.div`
  color: ${({ theme }) => theme.colors.black};

  /* Desktop - default: 18px */
  font-size: 18px;

  /* Tablet: 16px */
  ${maxMedia.tablet`
    font-size: 16px;
  `}

  /* Mobile: 14px */
  ${maxMedia.mobile`
    font-size: 14px;
  `}
`;

export const ProductPrice = styled.div`
  color: ${({ theme }) => theme.colors.black};

  /* Desktop - default: 18px */
  font-size: 18px;

  /* Tablet: 16px */
  ${maxMedia.tablet`
    font-size: 16px;
  `}

  /* Mobile: 14px */
  ${maxMedia.mobile`
    font-size: 14px;
  `}
`;

export const ProductActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;

  /* Mobile에서 간격 줄이기 */
  ${maxMedia.mobile`
    gap: ${({ theme }) => theme.spacing.md};
  `}
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: ${({ theme }) => theme.transitions.fast};

  /* Desktop/Tablet - default size */
  width: 24px;
  height: 24px;

  /* Mobile - smaller size */
  ${maxMedia.mobile`
    width: 18px;
    height: 18px;
    padding: ${({ theme }) => theme.spacing.xs};
  `}/* &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  } */
`;

export const ShowMoreButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  margin: ${({ theme }) => theme.spacing.lg} auto 0;
  color: ${({ theme }) => theme.colors.black};

  /* Mobile에서만 표시 */
  ${maxMedia.mobile`
    display: flex;
  `}
`;
