import styled from 'styled-components';

export const CategoryFilter = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
`;

export const CategoryFilterTitle = styled.div`
  margin-bottom: 1rem;
`;

export const CategoryButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  
  @media (max-width: 768px) {
    gap: 0.5rem;
  }
`;

export const CategoryIcon = styled.span`
  margin-right: 0.5rem;
  color: inherit;
`;

export const ProductResults = styled.div`
  margin-top: 1rem;
`;

export const ResultsHeader = styled.div`
  padding: 1rem 0;
  border-bottom: 1px solid #e5e5e5;
  margin-bottom: 1.5rem;
`;

export const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  gap: 1.5rem;
`;