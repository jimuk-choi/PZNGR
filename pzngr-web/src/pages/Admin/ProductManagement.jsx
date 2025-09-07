import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/atoms/Container";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import { ImageUpload } from "../../components/molecules";
import * as S from "./ProductManagement.styles";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    images: [],
  });

  const [uploadStatus, setUploadStatus] = useState("");

  const handleUploadComplete = (result) => {
    console.log("업로드 완료:", result);

    const newImages = Array.isArray(result.data) ? result.data : [result.data];
    setProductData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages],
    }));

    // 업로드된 파일 정보 표시
    const fileCount = newImages.length;
    const fileTypes = newImages
      .map((img) => img.mimetype.split("/")[1].toUpperCase())
      .join(", ");
    const totalSize = (
      newImages.reduce((sum, img) => sum + img.size, 0) /
      1024 /
      1024
    ).toFixed(2);

    // 최적화 정보 확인
    const optimizedImages = newImages.filter((img) => img.optimized !== false);
    const optimizationInfo =
      optimizedImages.length > 0
        ? `최적화됨 (${optimizedImages.length}/${fileCount})`
        : "";

    setUploadStatus(
      `✅ ${fileCount}개 이미지 업로드 완료 (${fileTypes}, 총 ${totalSize}MB) ${optimizationInfo}`
    );
    setTimeout(() => setUploadStatus(""), 7000);
  };

  const handleUploadError = (error) => {
    console.error("업로드 오류:", error);
    setUploadStatus(`오류: ${error.message}`);
    setTimeout(() => setUploadStatus(""), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    // 입력된 데이터가 있는지 확인
    const hasData =
      productData.name ||
      productData.price ||
      productData.description ||
      productData.category ||
      productData.images.length > 0;

    if (hasData) {
      const confirmCancel = window.confirm(
        "작성 중인 내용이 있습니다. 정말로 취소하시겠습니까?\n저장하지 않은 내용은 모두 사라집니다."
      );

      if (confirmCancel) {
        navigate(-1); // 이전 페이지로 이동
      }
    } else {
      navigate(-1); // 이전 페이지로 이동
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productData.name || !productData.price || !productData.category) {
      alert("필수 항목(상품명, 가격, 카테고리)을 모두 입력해주세요.");
      return;
    }

    if (productData.images.length === 0) {
      const confirmWithoutImage = window.confirm(
        "상품 이미지가 없습니다. 이미지 없이 등록하시겠습니까?"
      );
      if (!confirmWithoutImage) return;
    }

    console.log("상품 데이터:", productData);

    // 성공 메시지 및 페이지 이동
    alert("상품이 성공적으로 등록되었습니다!");
    navigate("/"); // 메인 페이지로 이동 (또는 상품 목록 페이지)
  };

  return (
    <Container>
      <S.PageHeader>
        <Text variant="h2">상품 관리</Text>
        <Text variant="body1" color="gray">
          새로운 상품을 등록하거나 기존 상품을 수정할 수 있습니다.
        </Text>
      </S.PageHeader>

      <S.FormContainer onSubmit={handleSubmit}>
        <S.FormSection>
          <Text variant="h3">기본 정보</Text>

          <S.InputGroup>
            <S.Label>
              상품명 <S.RequiredMark>*</S.RequiredMark>
            </S.Label>
            <S.Input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              placeholder="상품명을 입력하세요"
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>
              가격 <S.RequiredMark>*</S.RequiredMark>
            </S.Label>
            <S.Input
              type="number"
              name="price"
              value={productData.price}
              onChange={handleInputChange}
              placeholder="가격을 입력하세요 (원)"
              required
            />
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>
              카테고리 <S.RequiredMark>*</S.RequiredMark>
            </S.Label>
            <S.Select
              name="category"
              value={productData.category}
              onChange={handleInputChange}
              required
            >
              <option value="">카테고리 선택</option>
              <option value="darts">다트</option>
              <option value="accessories">액세서리</option>
              <option value="cases">케이스</option>
              <option value="boards">보드</option>
            </S.Select>
          </S.InputGroup>

          <S.InputGroup>
            <S.Label>상품 설명</S.Label>
            <S.TextArea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              placeholder="상품에 대한 자세한 설명을 입력하세요"
              rows={4}
            />
          </S.InputGroup>
        </S.FormSection>

        <S.FormSection>
          <Text variant="h3">상품 이미지</Text>

          <S.ImageGuidelines>
            <Text variant="body2" color="gray">
              📸 <strong>이미지 업로드 가이드:</strong>
            </Text>
            <ul style={{ margin: "8px 0", paddingLeft: "20px", color: "#666" }}>
              <li>지원 형식: JPG, JPEG, PNG, GIF, WebP</li>
              <li>최대 파일 크기: 5MB</li>
              <li>최대 업로드 수: 5개</li>
              <li>권장 해상도: 800×800px 이상</li>
              <li>
                ✨ 자동 최적화: 썸네일(150px), 중간(600px), 대형(1200px) + WebP
                변환
              </li>
            </ul>
          </S.ImageGuidelines>

          {uploadStatus && (
            <S.StatusMessage $success={!uploadStatus.startsWith("오류")}>
              {uploadStatus}
            </S.StatusMessage>
          )}

          <ImageUpload
            multiple={true}
            maxFiles={5}
            onUploadComplete={handleUploadComplete}
            onUploadError={handleUploadError}
          />

          {productData.images.length > 0 && (
            <S.UploadedImagesSection>
              <Text variant="h4">
                업로드된 이미지 ({productData.images.length}개)
              </Text>
              <S.ImageGrid>
                {productData.images.map((image, index) => (
                  <S.ImageCard key={image.filename || index}>
                    <S.ImagePreview
                      src={image.url}
                      alt={image.originalName}
                      onLoad={() =>
                        console.log(`이미지 로드됨: ${image.originalName}`)
                      }
                      onError={() =>
                        console.error(`이미지 로드 실패: ${image.originalName}`)
                      }
                    />
                    <S.ImageInfo>
                      <S.FileName title={image.originalName}>
                        {image.originalName}
                      </S.FileName>
                      <S.FileSize>
                        {(image.size / 1024).toFixed(1)} KB
                      </S.FileSize>
                      <S.RemoveButton
                        onClick={() => {
                          const newImages = productData.images.filter(
                            (_, i) => i !== index
                          );
                          setProductData((prev) => ({
                            ...prev,
                            images: newImages,
                          }));
                          // Blob URL 정리
                          if (image.url && image.url.startsWith("blob:")) {
                            URL.revokeObjectURL(image.url);
                          }
                        }}
                      >
                        삭제
                      </S.RemoveButton>
                    </S.ImageInfo>
                  </S.ImageCard>
                ))}
              </S.ImageGrid>
            </S.UploadedImagesSection>
          )}
        </S.FormSection>

        <S.ButtonGroup>
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            상품 등록
          </Button>
        </S.ButtonGroup>
      </S.FormContainer>
    </Container>
  );
};

export default ProductManagement;
