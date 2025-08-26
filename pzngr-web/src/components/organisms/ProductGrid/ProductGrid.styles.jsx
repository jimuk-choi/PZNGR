import styled from "styled-components";
import { maxMedia } from "../../../shared/styles/breakpoints";

export const GridContainer = styled.section`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.xxxxxxl} 0
    ${({ theme }) => theme.spacing.xxxxxxl} 0;
`;

export const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

export const TitleContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xxxxl};
`;

export const SectionTitle = styled.h2`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  font-size: ${({ theme }) => theme.fontSizes.xxl};
  color: ${({ theme }) => theme.colors.black};
  line-height: normal;
  margin: 0;
`;

export const ProductWrapper = styled.div`
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