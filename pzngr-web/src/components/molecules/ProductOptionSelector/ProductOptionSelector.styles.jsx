import styled from 'styled-components';

export const OptionsContainer = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 1.5rem;
  background-color: #ffffff;
`;

export const OptionsTitle = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;
`;

export const OptionGroup = styled.div`
  margin-bottom: 2rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export const OptionLabel = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

export const RequiredMark = styled.span`
  color: #dc3545;
  margin-left: 0.25rem;
  font-weight: bold;
`;

export const OptionValues = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Select = styled.select`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  background-color: white;
  min-height: 48px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
  
  &:disabled {
    background-color: #f8f9fa;
    color: #6c757d;
    cursor: not-allowed;
  }
  
  option:disabled {
    color: #6c757d;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const RadioItem = styled.div`
  display: flex;
  align-items: center;
`;

export const RadioInput = styled.input`
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const RadioLabel = styled.label`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid ${props => props.disabled ? '#e5e5e5' : '#ddd'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
  transition: border-color 0.2s, background-color 0.2s;
  
  &:hover {
    border-color: ${props => props.disabled ? '#e5e5e5' : '#007bff'};
  }
  
  ${RadioInput}:checked + & {
    border-color: #007bff;
    background-color: rgba(0, 123, 255, 0.1);
  }
`;

export const RadioLabelContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const CheckboxItem = styled.div`
  display: flex;
  align-items: center;
`;

export const CheckboxInput = styled.input`
  margin-right: 0.75rem;
  width: 18px;
  height: 18px;
  
  &:disabled {
    cursor: not-allowed;
  }
`;

export const CheckboxLabel = styled.label`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid ${props => props.disabled ? '#e5e5e5' : '#ddd'};
  border-radius: 6px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  background-color: ${props => props.disabled ? '#f8f9fa' : 'white'};
  transition: border-color 0.2s, background-color 0.2s;
  
  &:hover {
    border-color: ${props => props.disabled ? '#e5e5e5' : '#007bff'};
  }
  
  ${CheckboxInput}:checked + & {
    border-color: #007bff;
    background-color: rgba(0, 123, 255, 0.1);
  }
`;

export const CheckboxLabelContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const AdditionalPrice = styled.span`
  color: #007bff;
  font-weight: 500;
  margin-left: 0.5rem;
`;

export const StockInfo = styled.span`
  font-size: 12px;
  color: ${props => props.available ? '#28a745' : '#dc3545'};
  margin-left: 0.5rem;
`;

export const PriceSummary = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  text-align: right;
  border: 1px solid #e5e5e5;
`;