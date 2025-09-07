import styled from 'styled-components';

export const OptionsContainer = styled.div`
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  background-color: #ffffff;
`;

export const OptionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e5e5;
  background-color: #f8f9fa;
  border-radius: 8px 8px 0 0;
`;

export const EmptyState = styled.div`
  padding: 3rem;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 0 0 8px 8px;
`;

export const OptionsList = styled.div`
  padding: 0;
`;

export const OptionItem = styled.div`
  border-bottom: 1px solid #e5e5e5;
  
  &:last-child {
    border-bottom: none;
    border-radius: 0 0 8px 8px;
  }
`;

export const OptionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  background-color: ${props => props.expanded ? '#f8f9fa' : '#ffffff'};
  
  &:hover {
    background-color: #f8f9fa;
  }
`;

export const OptionInfo = styled.div`
  flex: 1;
`;

export const OptionName = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  margin-bottom: 0.25rem;
`;

export const OptionBadge = styled.span`
  background-color: ${props => {
    switch(props.type) {
      case 'select': return '#007bff';
      case 'radio': return '#28a745';
      case 'checkbox': return '#ffc107';
      default: return '#6c757d';
    }
  }};
  color: ${props => props.type === 'checkbox' ? '#212529' : 'white'};
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: normal;
  text-transform: uppercase;
`;

export const RequiredBadge = styled.span`
  background-color: #dc3545;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: normal;
`;

export const OptionMeta = styled.div`
  font-size: 12px;
  color: #6c757d;
`;

export const OptionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export const OptionDetails = styled.div`
  padding: 1.5rem;
  background-color: #f8f9fa;
  border-top: 1px solid #e5e5e5;
`;

export const OptionSettings = styled.div`
  margin-bottom: 2rem;
`;

export const SettingRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1rem;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SettingGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const CheckboxRow = styled.div`
  margin-top: 1rem;
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

export const CheckboxLabel = styled.label`
  font-size: 14px;
  color: #333;
  cursor: pointer;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

export const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background-color: white;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const ValuesSection = styled.div`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
`;

export const ValuesHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

export const EmptyValues = styled.div`
  padding: 2rem;
  text-align: center;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

export const ValuesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ValueItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const ValueInputs = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 1rem;
  flex: 1;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const ValueInputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const ValueActions = styled.div`
  display: flex;
  align-items: center;
`;

export const OptionsHint = styled.div`
  padding: 1rem 1.5rem;
  background-color: #e9ecef;
  border-radius: 0 0 8px 8px;
  border-top: 1px solid #e5e5e5;
`;