import styled from 'styled-components';

export const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 0.5rem;

  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  text-align: center;
  border-left: 4px solid ${props => props.$warning ? '#f39c12' : '#007bff'};
`;

export const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #666;
`;

export const AlertBanner = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #856404;
`;

export const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const FilterSelect = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const BulkActionBar = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
  align-items: center;

  @media (max-width: 768px) {
    flex-wrap: wrap;
  }
`;

export const CouponList = styled.div`
  display: grid;
  gap: 1rem;
`;

export const CouponCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  position: relative;
  border-left: 4px solid ${props => {
    switch (props.$status) {
      case 'active': return '#28a745';
      case 'inactive': return '#6c757d';
      case 'expired': return '#dc3545';
      case 'exhausted': return '#fd7e14';
      default: return '#007bff';
    }
  }};

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
`;

export const CouponCheckbox = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export const CouponHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  margin-left: 2rem;
`;

export const CouponName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
`;

export const CouponCode = styled.div`
  font-family: monospace;
  font-size: 0.875rem;
  color: #007bff;
  background: #f8f9fa;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
`;

export const CouponStatus = styled.div`
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  background: ${props => {
    switch (props.$status) {
      case 'active': return '#d4edda';
      case 'inactive': return '#e2e3e5';
      case 'expired': return '#f8d7da';
      case 'exhausted': return '#ffeaa7';
      default: return '#cce5ff';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'active': return '#155724';
      case 'inactive': return '#495057';
      case 'expired': return '#721c24';
      case 'exhausted': return '#856404';
      default: return '#004085';
    }
  }};
`;

export const CouponDescription = styled.p`
  color: #666;
  font-size: 0.875rem;
  margin: 0 0 1rem 2rem;
  line-height: 1.4;
`;

export const CouponDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin: 1rem 0 1rem 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
`;

export const DetailItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  
  span:first-child {
    color: #666;
    font-weight: 500;
  }
  
  span:last-child {
    color: #333;
    font-weight: 600;
  }
`;

export const CouponActions = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 1rem;
  margin-left: 2rem;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

export const ModalContent = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
`;

export const TemplateModal = styled.div`
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #eee;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #333;
  }
`;

export const CouponForm = styled.form`
  padding: 1.5rem;
`;

export const FormSection = styled.div`
  margin-bottom: 2rem;
  
  h4 {
    margin-bottom: 1rem;
    color: #333;
    font-size: 1rem;
    font-weight: 600;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1rem;
`;

export const InputRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.875rem;
`;

export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &:disabled {
    background: #f8f9fa;
    color: #666;
  }
`;

export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  background: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
  
  &[multiple] {
    height: 120px;
  }
`;

export const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.875rem;
  resize: vertical;
  min-height: 80px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

export const InputWithButton = styled.div`
  display: flex;
  gap: 0.5rem;
  
  input {
    flex: 1;
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
  }
  
  label {
    font-size: 0.875rem;
    color: #333;
    cursor: pointer;
  }
`;

export const ConditionRow = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  margin-bottom: 1rem;
  
  select {
    flex: 1;
  }
  
  input {
    flex: 1;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
`;

export const TemplateGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1.5rem;
`;

export const TemplateCard = styled.div`
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #007bff;
    box-shadow: 0 2px 8px rgba(0, 123, 255, 0.15);
  }
  
  h4 {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  p {
    margin: 0.25rem 0;
  }
`;