import styled from "styled-components";

export const CartContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 60vh;
  padding: ${({ theme }) => theme.spacing.xxxxxxl} 0;
  max-width: 800px;
  margin: 0 auto;
`;

export const CartTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xxxxl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
`;

export const EmptyCartMessage = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.spacing.xxxl};
`;

export const CartItemsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

export const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
`;

export const CartItemImage = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const CartItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

export const CartItemName = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const CartItemOptions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export const CartItemPrice = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export const CartItemActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

export const CartItemQuantity = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  
  span {
    min-width: 30px;
    text-align: center;
    font-weight: 500;
  }
`;

export const QuantityButton = styled.button`
  width: 30px;
  height: 30px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.lightGray};
  }
`;

export const RemoveButton = styled.button`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.danger};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.danger};
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.danger};
    color: white;
  }
`;

export const CartSummary = styled.div`
  width: 100%;
  border-top: 2px solid ${({ theme }) => theme.colors.black};
  padding-top: ${({ theme }) => theme.spacing.lg};
  margin-top: ${({ theme }) => theme.spacing.lg};
`;

export const CartTotal = styled.div`
  text-align: right;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const CheckoutButton = styled.div`
  text-align: center;
  width: 100%;
`;