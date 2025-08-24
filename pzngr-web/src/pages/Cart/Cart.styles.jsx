import styled from "styled-components";

export const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xxxxxxl} 0;
`;

export const CartTitle = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xxxxl};
  text-align: center;
`;

export const EmptyCartMessage = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xxxl};
`;