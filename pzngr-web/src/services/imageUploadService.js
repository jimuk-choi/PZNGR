const API_BASE_URL = 'http://localhost:3001/api';

export const imageUploadService = {
  async uploadSingle(file) {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`${API_BASE_URL}/upload/single`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('단일 이미지 업로드 실패:', error);
      throw error;
    }
  },

  async uploadMultiple(files) {
    const formData = new FormData();
    
    Array.from(files).forEach(file => {
      formData.append('images', file);
    });

    try {
      const response = await fetch(`${API_BASE_URL}/upload/multiple`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('다중 이미지 업로드 실패:', error);
      throw error;
    }
  },

  async deleteImage(filename) {
    try {
      const response = await fetch(`${API_BASE_URL}/upload/${filename}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      throw error;
    }
  },

  async getUploadedImages() {
    try {
      const response = await fetch(`${API_BASE_URL}/uploads`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('업로드된 이미지 목록 조회 실패:', error);
      throw error;
    }
  }
};