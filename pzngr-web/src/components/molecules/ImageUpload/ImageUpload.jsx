import React, { useState, useRef } from 'react';
import Button from '../../atoms/Button';
import Text from '../../atoms/Text';
import { imageUploadService } from '../../../services/imageUploadService';
import * as S from './ImageUpload.styles';

const ImageUpload = ({ 
  multiple = false, 
  maxFiles = 5,
  onUploadComplete,
  onUploadError,
  accept = 'image/*' 
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    
    if (multiple && fileArray.length > maxFiles) {
      const errorMsg = `최대 ${maxFiles}개의 파일만 선택할 수 있습니다.`;
      onUploadError && onUploadError(new Error(errorMsg));
      return;
    }

    handleUpload(fileArray);
  };

  const handleUpload = async (files) => {
    setUploading(true);

    try {
      let result;
      
      if (multiple) {
        result = await imageUploadService.uploadMultiple(files);
      } else {
        result = await imageUploadService.uploadSingle(files[0]);
      }

      if (result.success) {
        const newImages = multiple ? result.data : [result.data];
        setUploadedImages(prev => [...prev, ...newImages]);
        onUploadComplete && onUploadComplete(result);
      }
    } catch (error) {
      onUploadError && onUploadError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    handleFileSelect(e.target.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDeleteImage = async (filename, index) => {
    try {
      await imageUploadService.deleteImage(filename);
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
    } catch (error) {
      onUploadError && onUploadError(error);
    }
  };

  return (
    <S.Container>
      <S.UploadArea
        $dragOver={dragOver}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
        
        <S.UploadContent>
          <Text variant="body1" align="center">
            {dragOver 
              ? '파일을 여기에 놓으세요' 
              : '이미지를 드래그하거나 여기를 클릭하세요'
            }
          </Text>
          
          <Button 
            variant="outline" 
            disabled={uploading}
            type="button"
          >
            {uploading ? '업로드 중...' : '파일 선택'}
          </Button>
          
          <Text variant="caption" align="center" color="gray">
            {multiple 
              ? `최대 ${maxFiles}개 파일, 각각 최대 5MB` 
              : '최대 5MB'
            }
          </Text>
        </S.UploadContent>
      </S.UploadArea>

      {uploadedImages.length > 0 && (
        <S.ImagePreviewGrid>
          {uploadedImages.map((image, index) => (
            <S.ImagePreviewItem key={image.filename}>
              <S.PreviewImage 
                src={image.fullUrl} 
                alt={image.originalName}
              />
              <S.ImageInfo>
                <Text variant="caption" style={{ fontWeight: 'bold' }}>
                  {image.originalName}
                </Text>
                <Text variant="caption" color="gray">
                  {image.mimetype.split('/')[1].toUpperCase()} • {(image.size / 1024 / 1024).toFixed(2)}MB
                </Text>
              </S.ImageInfo>
              <S.DeleteButton 
                onClick={() => handleDeleteImage(image.filename, index)}
              >
                ×
              </S.DeleteButton>
            </S.ImagePreviewItem>
          ))}
        </S.ImagePreviewGrid>
      )}
    </S.Container>
  );
};

export default ImageUpload;