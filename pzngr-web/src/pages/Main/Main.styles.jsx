import styled from "styled-components";

export const MainImageSection = styled.section`
  width: 100%;
  aspect-ratio: 1920 / 1783;
  background-image: url(${props => props.$bgImage});
  background-position: 0% 58.61%;
  background-repeat: no-repeat;
  background-size: 100% 161.53%;
  flex-shrink: 0;
`;

export const SectionSpacing = styled.div`
  height: ${({ theme }) => theme.spacing.xxxxxxl};
`;