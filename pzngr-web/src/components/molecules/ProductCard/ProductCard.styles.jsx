import styled from "styled-components";
import { maxMedia } from "../../../shared/styles/breakpoints";

export const CardContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.white};
  width: 384px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};

  &:hover {
    /* transform: translateY(-2px); */
    opacity: 0.9;
  }

  ${maxMedia.mobile`
    gap: ${({ theme }) => theme.spacing.xs};
  `}
`;

export const ImageWrapper = styled.div`
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
`;

export const InfoSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  padding: 0 ${({ theme }) => theme.spacing.lg};
`;

export const ProductInfo = styled.div`
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

export const ActionButtons = styled.div`
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
  `}

  svg {
    width: 100%;
    height: 100%;
    color: ${({ theme }) => theme.colors.black};
  }
`;
