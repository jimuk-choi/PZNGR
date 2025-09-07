import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const UploadArea = styled.div`
  border: 2px dashed ${props => props.$dragOver ? '#007bff' : '#ddd'};
  border-radius: 8px;
  padding: 40px 20px;
  text-align: center;
  background-color: ${props => props.$dragOver ? '#f8f9ff' : '#fafafa'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    border-color: #007bff;
    background-color: #f8f9ff;
  }
`;

export const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

export const ImagePreviewGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 15px;
  margin-top: 20px;
`;

export const ImagePreviewItem = styled.div`
  position: relative;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

export const ImageInfo = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

export const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: #ff4444;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #ff4444;
    color: white;
  }
`;