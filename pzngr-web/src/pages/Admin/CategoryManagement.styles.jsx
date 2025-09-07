import styled from 'styled-components';

export const PageHeader = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e5e5;
`;

export const StatusMessage = styled.div`
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 1rem;
  background-color: ${props => props.$success ? '#d4edda' : '#f8d7da'};
  color: ${props => props.$success ? '#155724' : '#721c24'};
  border: 1px solid ${props => props.$success ? '#c3e6cb' : '#f5c6cb'};
`;

export const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
`;

export const CategoryCount = styled.span`
  color: #6c757d;
  font-size: 14px;
`;

export const FormContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  padding: 2rem;
  margin-bottom: 2rem;
`;

export const FormTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.25rem;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const Label = styled.label`
  font-weight: 500;
  color: #333;
  font-size: 14px;
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
  }
`;

export const Select = styled.select`
  padding: 12px;
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

export const CheckboxRow = styled.div`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
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

export const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
  border-top: 1px solid #e5e5e5;
`;

export const CategoryList = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
`;

export const CategoryListTitle = styled.h3`
  margin: 0;
  padding: 1rem 1.5rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e5e5e5;
  border-radius: 8px 8px 0 0;
  font-size: 1.1rem;
  color: #333;
`;

export const LoadingMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6c757d;
`;

export const ErrorMessage = styled.div`
  padding: 2rem;
  text-align: center;
  color: #dc3545;
`;

export const CategoryTree = styled.div`
  padding: 1rem 0;
`;

export const CategoryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  margin-left: ${props => props.level * 2}rem;
  border-bottom: 1px solid #f0f0f0;
  
  &:hover {
    background-color: #f8f9fa;
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

export const CategoryInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 1rem;
`;

export const ExpandButton = styled.button`
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6c757d;
  font-size: 12px;
  width: 20px;
  text-align: center;
  
  &:hover {
    color: #333;
  }
`;

export const CategoryDetails = styled.div`
  flex: 1;
  margin-left: ${props => props.hasChildren ? '0' : '24px'};
`;

export const CategoryName = styled.div`
  font-weight: 500;
  color: #333;
  margin-bottom: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const CategoryIcon = styled.span`
  color: #6c757d;
`;

export const InactiveLabel = styled.span`
  background-color: #dc3545;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: normal;
`;

export const HiddenLabel = styled.span`
  background-color: #ffc107;
  color: #212529;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 12px;
  font-weight: normal;
`;

export const CategoryDescription = styled.div`
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 0.5rem;
`;

export const CategoryMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 12px;
  color: #adb5bd;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;

export const CategoryActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 0.25rem;
  }
`;