import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../../components/atoms/Container";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import { ImageUpload } from "../../components/molecules";
import ProductOptions from "../../components/molecules/ProductOptions";
import { useProductStore } from "../../stores/productStore";
import { useCategoryStore } from "../../stores/categoryStore";
import * as S from "./ProductManagement.styles";

const ProductManagement = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const isEditMode = !!productId;
  
  const getProductById = useProductStore((state) => state.getProductById);
  const addProduct = useProductStore((state) => state.addProduct);
  const updateProduct = useProductStore((state) => state.updateProduct);
  
  const getActiveCategories = useCategoryStore((state) => state.getActiveCategories);

  const [productData, setProductData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    images: [],
    options: [],
  });

  const [uploadStatus, setUploadStatus] = useState("");

  useEffect(() => {
    if (isEditMode && productId) {
      const existingProduct = getProductById(productId);
      if (existingProduct) {
        const existingImages = [];
        
        if (existingProduct.images?.main) {
          existingImages.push({
            url: existingProduct.images.main,
            originalName: 'main-image.jpg',
            size: 0,
            mimetype: 'image/jpeg'
          });
        } else if (existingProduct.image) {
          existingImages.push({
            url: existingProduct.image,
            originalName: 'product-image.jpg',
            size: 0,
            mimetype: 'image/jpeg'
          });
        }
        
        if (existingProduct.images?.gallery) {
          existingProduct.images.gallery.forEach((imageUrl, index) => {
            if (imageUrl && imageUrl !== existingProduct.images.main) {
              existingImages.push({
                url: imageUrl,
                originalName: `gallery-${index + 1}.jpg`,
                size: 0,
                mimetype: 'image/jpeg'
              });
            }
          });
        }
        
        setProductData({
          name: existingProduct.name || "",
          price: existingProduct.price?.toString() || "",
          description: existingProduct.description || "",
          category: existingProduct.category || "",
          images: existingImages,
          options: existingProduct.options || [],
        });
      } else {
        alert('상품을 찾을 수 없습니다.');
        navigate('/admin/products');
      }
    }
  }, [isEditMode, productId, getProductById, navigate]);

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

    if (productData.images.length === 0 && !isEditMode) {
      const confirmWithoutImage = window.confirm(
        "상품 이미지가 없습니다. 이미지 없이 등록하시겠습니까?"
      );
      if (!confirmWithoutImage) return;
    }

    const productPayload = {
      name: productData.name,
      price: parseInt(productData.price),
      description: productData.description,
      category: productData.category,
      image: productData.images.length > 0 ? productData.images[0].url : '',
      images: productData.images.length > 0 ? { 
        main: productData.images[0].url,
        gallery: productData.images.map(img => img.url)
      } : (isEditMode ? { main: '', gallery: [] } : null),
      options: productData.options,
      stock: 10,
    };

    try {
      if (isEditMode) {
        updateProduct(productId, productPayload);
        alert("상품이 성공적으로 수정되었습니다!");
      } else {
        addProduct(productPayload);
        alert("상품이 성공적으로 등록되었습니다!");
      }
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error('Product save error:', error);
      alert(`상품 ${isEditMode ? '수정' : '등록'} 중 오류가 발생했습니다.`);
    }
  };

  return (
    <Container>
      <S.PageHeader>
        <Text variant="h2">{isEditMode ? '상품 수정' : '상품 관리'}</Text>
        <Text variant="body1" color="gray">
          {isEditMode 
            ? '상품 정보를 수정할 수 있습니다.' 
            : '새로운 상품을 등록하거나 기존 상품을 수정할 수 있습니다.'
          }
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
              {getActiveCategories().map(category => (
                <option key={category.id} value={category.id}>
                  {'  '.repeat(category.level)}{category.name}
                </option>
              ))}
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

        <S.FormSection>
          <Text variant="h3">상품 옵션</Text>
          <ProductOptions
            options={productData.options}
            onChange={(options) => setProductData(prev => ({ ...prev, options }))}
          />
        </S.FormSection>

        <S.ButtonGroup>
          <Button type="button" variant="outline" onClick={handleCancel}>
            취소
          </Button>
          <Button type="submit" variant="primary">
            {isEditMode ? '상품 수정' : '상품 등록'}
          </Button>
        </S.ButtonGroup>
      </S.FormContainer>
    </Container>
  );
};

export default ProductManagement;
