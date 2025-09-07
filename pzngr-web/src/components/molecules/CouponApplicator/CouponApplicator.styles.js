import styled from 'styled-components';

export const Container = styled.div`
  margin: 1rem 0;
`;

export const DisabledContainer = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  text-align: center;
`;

export const InputSection = styled.div`
  padding: 1.5rem;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  
  h4 {
    margin: 0 0 1rem 0;
    color: #333;
  }
`;

export const CouponInputGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const CouponInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  text-transform: uppercase;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #666;
  }
  
  &::placeholder {
    text-transform: none;
  }
`;

export const AvailableCouponsToggle = styled.div`
  text-align: center;
  margin-bottom: 1rem;
`;

export const AvailableCouponsSection = styled.div`
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
`;

export const CouponList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
`;

export const CouponItem = styled.div`
  padding: 1rem;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #007bff;
    box-shadow: 0 1px 4px rgba(0, 123, 255, 0.15);
  }
`;

export const CouponItemHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const CouponItemName = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 0.875rem;
`;

export const CouponItemCode = styled.div`
  font-family: monospace;
  font-size: 0.75rem;
  color: #007bff;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
`;

export const CouponItemDescription = styled.div`
  font-size: 0.75rem;
  color: #666;
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

export const CouponItemDetails = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: #888;
  
  span:first-child {
    color: #28a745;
    font-weight: 600;
  }
`;

export const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #666;
`;

export const AppliedCouponSection = styled.div`
  margin: 1rem 0;
`;

export const AppliedCouponCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
`;

export const CouponInfo = styled.div`
  flex: 1;
`;

export const CouponName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

export const CouponCode = styled.div`
  font-family: monospace;
  font-size: 0.75rem;
  opacity: 0.9;
  margin-bottom: 0.5rem;
`;

export const DiscountAmount = styled.div`
  font-size: 1.125rem;
  font-weight: 700;
  color: #fff;
`;

export const Message = styled.div`
  padding: 0.75rem 1rem;
  border-radius: 6px;
  margin-top: 0.5rem;
  background: ${props => props.$isError ? '#f8d7da' : '#d4edda'};
  border: 1px solid ${props => props.$isError ? '#f5c6cb' : '#c3e6cb'};
  color: ${props => props.$isError ? '#721c24' : '#155724'};
  
  p {
    margin: 0;
    font-size: 0.875rem;
  }
`;