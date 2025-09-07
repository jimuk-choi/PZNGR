import { firebaseImageService } from './firebaseImageService';

// 환경에 따라 Mock 또는 Firebase 서비스 선택
const USE_FIREBASE = process.env.REACT_APP_USE_FIREBASE === 'true';

// Mock 서비스 (개발/테스트용)
const mockImageService = {
  async uploadSingle(file) {
    console.log('📁 Mock 단일 이미지 업로드:', file.name);
    
    // 실제 API 호출을 모방하기 위해 지연 추가
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 파일 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('지원하지 않는 파일 형식입니다.');
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB
      throw new Error('파일 크기가 너무 큽니다. (최대 10MB)');
    }
    
    // Mock 업로드 결과 생성
    const mockResult = {
      success: true,
      data: {
        filename: `${Date.now()}_${file.name}`,
        originalName: file.name,
        size: file.size,
        mimetype: file.type,
        url: URL.createObjectURL(file), // 임시 blob URL
        uploadedAt: new Date().toISOString(),
        optimized: true,
        versions: {
          thumbnail: URL.createObjectURL(file),
          medium: URL.createObjectURL(file),
          large: URL.createObjectURL(file),
          original: URL.createObjectURL(file)
        }
      }
    };
    
    console.log('✅ Mock 단일 이미지 업로드 완료:', mockResult.data.filename);
    return mockResult;
  },

  async uploadMultiple(files) {
    console.log('📁 Mock 다중 이미지 업로드:', files.length + '개 파일');
    
    // 실제 API 호출을 모방하기 위해 지연 추가
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const fileArray = Array.from(files);
    const results = [];
    
    for (const file of fileArray) {
      try {
        // 파일 검증
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error('지원하지 않는 파일 형식입니다.');
        }
        
        if (file.size > 10 * 1024 * 1024) { // 10MB
          throw new Error('파일 크기가 너무 큽니다. (최대 10MB)');
        }
        
        // 각 파일에 대해 고유한 Blob URL 생성
        const blobUrl = URL.createObjectURL(file);
        
        const mockData = {
          filename: `${Date.now()}_${Math.random().toString(36).substring(2, 11)}_${file.name}`,
          originalName: file.name,
          size: file.size,
          mimetype: file.type,
          url: blobUrl,
          uploadedAt: new Date().toISOString(),
          optimized: true,
          versions: {
            thumbnail: blobUrl,
            medium: blobUrl,
            large: blobUrl,
            original: blobUrl
          }
        };
        
        results.push(mockData);
        console.log(`✅ ${file.name} 업로드 완료`);
        
      } catch (error) {
        console.error(`파일 ${file.name} 업로드 실패:`, error);
        results.push({
          filename: file.name,
          originalName: file.name,
          error: error.message,
          success: false
        });
      }
    }
    
    const successCount = results.filter(r => r.success !== false).length;
    const mockResult = {
      success: successCount > 0,
      data: results,
      summary: {
        total: fileArray.length,
        success: successCount,
        failed: fileArray.length - successCount
      }
    };
    
    console.log(`✅ Mock 다중 이미지 업로드 완료: ${successCount}/${fileArray.length}개 성공`);
    return mockResult;
  },

  async deleteImage(filename) {
    console.log('🗑️ Mock 이미지 삭제:', filename);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockResult = {
      success: true,
      message: `이미지 ${filename}이 삭제되었습니다.`,
      deletedAt: new Date().toISOString()
    };
    
    console.log('✅ Mock 이미지 삭제 완료:', filename);
    return mockResult;
  },

  async getUploadedImages() {
    console.log('📋 Mock 업로드된 이미지 목록 조회');
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const mockResult = {
      success: true,
      data: [],
      message: 'Mock 서비스 - 실제 이미지 목록은 AWS S3 연동 후 제공됩니다.'
    };
    
    console.log('✅ Mock 이미지 목록 조회 완료');
    return mockResult;
  }
};

// 실제 사용할 서비스 선택
export const imageUploadService = USE_FIREBASE ? firebaseImageService : mockImageService;