import { storage } from '../config/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';

// Firebase Storage를 사용한 이미지 업로드 서비스
export const firebaseImageService = {
  // 파일 검증 함수
  validateFile(file) {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      throw new Error('지원하지 않는 파일 형식입니다.');
    }
    
    if (file.size > 5 * 1024 * 1024) { // 5MB (Firebase 무료 플랜 고려)
      throw new Error('파일 크기가 너무 큽니다. (최대 5MB)');
    }
  },

  // 고유 파일명 생성
  generateFileName(file) {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 11);
    const extension = file.name.split('.').pop();
    return `images/${timestamp}_${randomString}.${extension}`;
  },

  async uploadSingle(file) {
    console.log('📁 Firebase 단일 이미지 업로드:', file.name);
    
    try {
      // 파일 검증
      this.validateFile(file);
      
      // 고유 파일명 생성
      const fileName = this.generateFileName(file);
      const storageRef = ref(storage, fileName);
      
      // 파일 업로드
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      // 업로드 완료 대기
      return new Promise((resolve, reject) => {
        uploadTask.on('state_changed',
          (snapshot) => {
            // 업로드 진행률 (필요시 사용)
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`업로드 진행률: ${progress}%`);
          },
          (error) => {
            console.error('Firebase 업로드 에러:', error);
            reject(new Error('이미지 업로드에 실패했습니다.'));
          },
          async () => {
            try {
              // 다운로드 URL 가져오기
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              const result = {
                success: true,
                data: {
                  filename: fileName,
                  originalName: file.name,
                  size: file.size,
                  mimetype: file.type,
                  url: downloadURL,
                  fullUrl: downloadURL, // ImageUpload 컴포넌트와 호환성
                  uploadedAt: new Date().toISOString(),
                  optimized: true,
                  versions: {
                    original: downloadURL
                  }
                }
              };
              
              console.log('✅ Firebase 단일 이미지 업로드 완료:', fileName);
              resolve(result);
            } catch (error) {
              console.error('다운로드 URL 가져오기 에러:', error);
              reject(new Error('업로드 완료 후 URL 가져오기에 실패했습니다.'));
            }
          }
        );
      });
    } catch (error) {
      console.error('Firebase 업로드 에러:', error);
      throw error;
    }
  },

  async uploadMultiple(files) {
    console.log('📁 Firebase 다중 이미지 업로드:', files.length + '개 파일');
    
    const fileArray = Array.from(files);
    const results = [];
    
    // 병렬 업로드를 위한 Promise 배열
    const uploadPromises = fileArray.map(async (file) => {
      try {
        const result = await this.uploadSingle(file);
        return result.data;
      } catch (error) {
        console.error(`파일 ${file.name} 업로드 실패:`, error);
        return {
          filename: file.name,
          originalName: file.name,
          error: error.message,
          success: false
        };
      }
    });

    // 모든 업로드 완료 대기
    const uploadResults = await Promise.all(uploadPromises);
    results.push(...uploadResults);

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

    console.log(`✅ Firebase 다중 이미지 업로드 완료: ${successCount}/${fileArray.length}개 성공`);
    return mockResult;
  },

  async deleteImage(filename) {
    console.log('🗑️ Firebase 이미지 삭제:', filename);
    
    try {
      const fileRef = ref(storage, filename);
      await deleteObject(fileRef);
      
      const result = {
        success: true,
        message: `이미지 ${filename}이 삭제되었습니다.`,
        deletedAt: new Date().toISOString()
      };
      
      console.log('✅ Firebase 이미지 삭제 완료:', filename);
      return result;
    } catch (error) {
      console.error('Firebase 삭제 에러:', error);
      throw new Error('이미지 삭제에 실패했습니다.');
    }
  },

  async getUploadedImages() {
    console.log('📋 Firebase 업로드된 이미지 목록 조회');
    
    try {
      const listRef = ref(storage, 'images/');
      const listResult = await listAll(listRef);
      
      const imagePromises = listResult.items.map(async (itemRef) => {
        const downloadURL = await getDownloadURL(itemRef);
        return {
          filename: itemRef.name,
          fullPath: itemRef.fullPath,
          url: downloadURL,
          fullUrl: downloadURL
        };
      });

      const images = await Promise.all(imagePromises);
      
      const result = {
        success: true,
        data: images,
        message: `Firebase에서 ${images.length}개의 이미지를 찾았습니다.`
      };
      
      console.log('✅ Firebase 이미지 목록 조회 완료:', images.length + '개');
      return result;
    } catch (error) {
      console.error('Firebase 목록 조회 에러:', error);
      throw new Error('이미지 목록 조회에 실패했습니다.');
    }
  }
};