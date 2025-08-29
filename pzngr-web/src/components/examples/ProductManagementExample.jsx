import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  PRODUCT_STATUS, 
  OPTION_TYPE,
  createEmptyProduct,
  createProductOption,
  createOptionValue 
} from '../../models/Product';
import { DEFAULT_CATEGORIES, buildCategoryTree } from '../../models/Category';
import { 
  mockProducts,
  getProductStats,
  searchProducts,
  getProductsByCategory,
  getFeaturedProducts,
  getBestSellers
} from '../../data/mockProducts';
import {
  createProduct,
  updateProduct,
  deleteProduct,
  sortProducts,
  filterProducts,
  paginateProducts,
  getProductStatusText,
  getProductStatusColor,
  generateSlug,
  calculateDiscountRate
} from '../../utils/productHelpers';
import {
  validateProduct,
  validateProductName,
  validatePrice,
  validateSKU
} from '../../utils/productValidation';

const Container = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const Section = styled.div`
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #f9f9f9;
`;

const SectionTitle = styled.h2`
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 10px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const Card = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: relative;
`;

const ProductCard = styled(Card)`
  border-left: 4px solid ${props => getProductStatusColor(props.status)};
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 4px;
  background: ${props => {
    if (props.variant === 'primary') return '#007bff';
    if (props.variant === 'success') return '#28a745';
    if (props.variant === 'danger') return '#dc3545';
    if (props.variant === 'warning') return '#ffc107';
    return '#6c757d';
  }};
  color: ${props => props.variant === 'warning' ? '#000' : '#fff'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  border: 1px solid ${props => props.hasError ? '#dc3545' : '#ddd'};
  border-radius: 4px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  min-height: 100px;
  resize: vertical;
  box-sizing: border-box;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
`;

const ErrorText = styled.span`
  color: #dc3545;
  font-size: 12px;
  display: block;
  margin-top: 4px;
`;

const StatusBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
  color: white;
  background: ${props => getProductStatusColor(props.status)};
`;

const StatCard = styled(Card)`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2em;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #666;
  font-size: 14px;
`;

const FilterBar = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  align-items: center;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  padding: 8px 12px;
  border: 1px solid #ddd;
  background: ${props => props.active ? '#007bff' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: ${props => props.active ? '#0056b3' : '#f8f9fa'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ProductManagementExample = () => {
  // 상태 관리
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [paginatedData, setPaginatedData] = useState({ products: [], pagination: {} });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState(createEmptyProduct());
  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    sortBy: 'created',
    sortOrder: 'desc'
  });

  // 통계 데이터 계산
  const stats = getProductStats();
  const categoryTree = buildCategoryTree(DEFAULT_CATEGORIES);

  // 필터링 및 페이지네이션 적용
  useEffect(() => {
    let filtered = [...products];

    // 검색어 적용
    if (searchTerm) {
      filtered = searchProducts(searchTerm);
    }

    // 필터 적용
    filtered = filterProducts(filtered, filters);

    // 정렬 적용
    filtered = sortProducts(filtered, filters.sortBy, filters.sortOrder);

    setFilteredProducts(filtered);

    // 페이지네이션 적용
    const paginated = paginateProducts(filtered, currentPage, 6);
    setPaginatedData(paginated);
  }, [products, searchTerm, filters, currentPage]);

  // 폼 데이터 변경 핸들러
  const handleFormChange = (field, value) => {
    setFormData(prev => {
      const newData = { ...prev };
      
      // 중첩된 객체 처리
      if (field.includes('.')) {
        const keys = field.split('.');
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) current[keys[i]] = {};
          current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
      } else {
        newData[field] = value;
      }
      
      return newData;
    });

    // 실시간 검증
    setFormErrors(prev => ({
      ...prev,
      [field]: ''
    }));
  };

  // 상품 생성/수정 처리
  const handleSaveProduct = () => {
    let result;
    
    if (isCreating) {
      result = createProduct(formData, products);
    } else if (isEditing) {
      result = updateProduct(selectedProduct.id, formData, products);
    }

    if (result.success) {
      if (isCreating) {
        setProducts([...products, result.product]);
      } else {
        setProducts(products.map(p => 
          p.id === selectedProduct.id ? result.product : p
        ));
      }
      
      setIsCreating(false);
      setIsEditing(false);
      setSelectedProduct(null);
      setFormData(createEmptyProduct());
      setFormErrors({});
      alert(isCreating ? '상품이 생성되었습니다.' : '상품이 수정되었습니다.');
    } else {
      setFormErrors(result.errors);
    }
  };

  // 상품 삭제 처리
  const handleDeleteProduct = (productId) => {
    if (window.confirm('정말로 이 상품을 삭제하시겠습니까?')) {
      const result = deleteProduct(productId, products);
      if (result.success) {
        setProducts(products.map(p => 
          p.id === productId ? { ...p, status: PRODUCT_STATUS.DISCONTINUED } : p
        ));
        alert(result.message);
      }
    }
  };

  // 새 상품 생성 시작
  const startCreateProduct = () => {
    setIsCreating(true);
    setIsEditing(false);
    setSelectedProduct(null);
    setFormData(createEmptyProduct());
    setFormErrors({});
  };

  // 상품 수정 시작
  const startEditProduct = (product) => {
    setIsEditing(true);
    setIsCreating(false);
    setSelectedProduct(product);
    setFormData(product);
    setFormErrors({});
  };

  // 편집 취소
  const cancelEdit = () => {
    setIsCreating(false);
    setIsEditing(false);
    setSelectedProduct(null);
    setFormData(createEmptyProduct());
    setFormErrors({});
  };

  return (
    <Container>
      <Header>
        <Title>🛍️ 상품 관리 시스템</Title>
        <Subtitle>완전한 상품 관리 및 CRUD 기능 데모</Subtitle>
      </Header>

      {/* 통계 대시보드 */}
      <Section>
        <SectionTitle>📊 상품 통계</SectionTitle>
        <Grid>
          <StatCard>
            <StatNumber>{stats.totalProducts}</StatNumber>
            <StatLabel>총 상품 수</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.activeProducts}</StatNumber>
            <StatLabel>판매중</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.outOfStockProducts}</StatNumber>
            <StatLabel>품절</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.totalInventory}</StatNumber>
            <StatLabel>총 재고량</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{stats.averageRating.toFixed(1)}⭐</StatNumber>
            <StatLabel>평균 평점</StatLabel>
          </StatCard>
          <StatCard>
            <StatNumber>{(stats.totalValue / 1000000).toFixed(1)}M</StatNumber>
            <StatLabel>총 상품 가치 (원)</StatLabel>
          </StatCard>
        </Grid>
      </Section>

      {/* 상품 목록 및 관리 */}
      <Section>
        <SectionTitle>
          🛒 상품 목록 관리
          <Button 
            variant="success" 
            onClick={startCreateProduct}
            style={{ float: 'right' }}
          >
            + 새 상품 등록
          </Button>
        </SectionTitle>

        {/* 필터 및 검색 */}
        <FilterBar>
          <Input
            type="text"
            placeholder="상품명, 브랜드, 설명으로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: '300px' }}
          />
          
          <Select
            value={filters.category}
            onChange={(e) => setFilters({...filters, category: e.target.value})}
          >
            <option value="">전체 카테고리</option>
            {DEFAULT_CATEGORIES.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>

          <Select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
          >
            <option value="">전체 상태</option>
            {Object.values(PRODUCT_STATUS).map(status => (
              <option key={status} value={status}>
                {getProductStatusText(status)}
              </option>
            ))}
          </Select>

          <Select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-');
              setFilters({...filters, sortBy, sortOrder});
            }}
          >
            <option value="created-desc">최신순</option>
            <option value="created-asc">오래된순</option>
            <option value="name-asc">이름순</option>
            <option value="price-asc">가격 낮은순</option>
            <option value="price-desc">가격 높은순</option>
            <option value="rating-desc">평점 높은순</option>
            <option value="sales-desc">판매량 많은순</option>
          </Select>
        </FilterBar>

        <div>
          <strong>검색 결과: {filteredProducts.length}개</strong>
        </div>

        {/* 상품 목록 */}
        <Grid>
          {paginatedData.products.map(product => (
            <ProductCard key={product.id} status={product.status}>
              <StatusBadge status={product.status}>
                {getProductStatusText(product.status)}
              </StatusBadge>

              <div style={{ marginTop: '20px' }}>
                <h4>{product.name}</h4>
                <p><strong>브랜드:</strong> {product.brand}</p>
                <p><strong>SKU:</strong> {product.sku}</p>
                <p><strong>가격:</strong> {product.price.sale?.toLocaleString() || product.price.regular.toLocaleString()}원</p>
                {product.price.discount > 0 && (
                  <p style={{ color: '#dc3545' }}>
                    <strong>할인:</strong> {calculateDiscountRate(product.price.regular, product.price.sale)}% 
                    ({product.price.discount.toLocaleString()}원 할인)
                  </p>
                )}
                <p><strong>재고:</strong> {product.inventory.available}개</p>
                <p><strong>평점:</strong> {product.stats.rating}⭐ ({product.stats.reviewCount}개 리뷰)</p>
                <p><strong>조회수:</strong> {product.stats.viewCount}회</p>
                <p><strong>판매량:</strong> {product.stats.purchaseCount}개</p>

                <div style={{ marginTop: '10px' }}>
                  <Button 
                    variant="primary" 
                    onClick={() => startEditProduct(product)}
                  >
                    수정
                  </Button>
                  <Button 
                    variant="danger" 
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={product.status === PRODUCT_STATUS.DISCONTINUED}
                  >
                    삭제
                  </Button>
                  <Button onClick={() => setSelectedProduct(product)}>
                    상세보기
                  </Button>
                </div>
              </div>
            </ProductCard>
          ))}
        </Grid>

        {/* 페이지네이션 */}
        {paginatedData.pagination.totalPages > 1 && (
          <PaginationContainer>
            <PaginationButton
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              처음
            </PaginationButton>
            <PaginationButton
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={!paginatedData.pagination.hasPrevPage}
            >
              이전
            </PaginationButton>
            
            {Array.from({ length: paginatedData.pagination.totalPages }, (_, i) => (
              <PaginationButton
                key={i + 1}
                active={currentPage === i + 1}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </PaginationButton>
            ))}
            
            <PaginationButton
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={!paginatedData.pagination.hasNextPage}
            >
              다음
            </PaginationButton>
            <PaginationButton
              onClick={() => setCurrentPage(paginatedData.pagination.totalPages)}
              disabled={currentPage === paginatedData.pagination.totalPages}
            >
              마지막
            </PaginationButton>
          </PaginationContainer>
        )}
      </Section>

      {/* 상품 등록/수정 폼 */}
      {(isCreating || isEditing) && (
        <Section>
          <SectionTitle>
            {isCreating ? '📝 새 상품 등록' : '✏️ 상품 정보 수정'}
            <Button variant="secondary" onClick={cancelEdit} style={{ float: 'right' }}>
              취소
            </Button>
          </SectionTitle>

          <Grid>
            <Card>
              <h3>기본 정보</h3>
              
              <FormGroup>
                <Label>상품명 *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleFormChange('name', e.target.value)}
                  hasError={formErrors.name}
                  placeholder="상품명을 입력하세요"
                />
                {formErrors.name && <ErrorText>{formErrors.name}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>브랜드 *</Label>
                <Input
                  value={formData.brand}
                  onChange={(e) => handleFormChange('brand', e.target.value)}
                  hasError={formErrors.brand}
                  placeholder="브랜드를 입력하세요"
                />
                {formErrors.brand && <ErrorText>{formErrors.brand}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>SKU *</Label>
                <Input
                  value={formData.sku}
                  onChange={(e) => handleFormChange('sku', e.target.value)}
                  hasError={formErrors.sku}
                  placeholder="SKU를 입력하세요"
                />
                {formErrors.sku && <ErrorText>{formErrors.sku}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>상품 설명</Label>
                <TextArea
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="상품 설명을 입력하세요"
                />
              </FormGroup>

              <FormGroup>
                <Label>상품 상태</Label>
                <Select
                  value={formData.status}
                  onChange={(e) => handleFormChange('status', e.target.value)}
                >
                  {Object.values(PRODUCT_STATUS).map(status => (
                    <option key={status} value={status}>
                      {getProductStatusText(status)}
                    </option>
                  ))}
                </Select>
              </FormGroup>
            </Card>

            <Card>
              <h3>가격 정보</h3>
              
              <FormGroup>
                <Label>정가 *</Label>
                <Input
                  type="number"
                  value={formData.price?.regular || 0}
                  onChange={(e) => handleFormChange('price.regular', parseInt(e.target.value) || 0)}
                  hasError={formErrors.regularPrice}
                />
                {formErrors.regularPrice && <ErrorText>{formErrors.regularPrice}</ErrorText>}
              </FormGroup>

              <FormGroup>
                <Label>판매가 *</Label>
                <Input
                  type="number"
                  value={formData.price?.sale || 0}
                  onChange={(e) => handleFormChange('price.sale', parseInt(e.target.value) || 0)}
                  hasError={formErrors.salePrice}
                />
                {formErrors.salePrice && <ErrorText>{formErrors.salePrice}</ErrorText>}
              </FormGroup>

              {formData.price?.regular && formData.price?.sale && (
                <div>
                  <strong>할인율:</strong> {calculateDiscountRate(formData.price.regular, formData.price.sale)}%
                </div>
              )}
            </Card>

            <Card>
              <h3>재고 정보</h3>
              
              <FormGroup>
                <Label>총 재고 *</Label>
                <Input
                  type="number"
                  value={formData.inventory?.total || 0}
                  onChange={(e) => handleFormChange('inventory.total', parseInt(e.target.value) || 0)}
                />
              </FormGroup>

              <FormGroup>
                <Label>판매 가능 재고</Label>
                <Input
                  type="number"
                  value={formData.inventory?.available || 0}
                  onChange={(e) => handleFormChange('inventory.available', parseInt(e.target.value) || 0)}
                />
              </FormGroup>

              <FormGroup>
                <Label>안전 재고</Label>
                <Input
                  type="number"
                  value={formData.inventory?.safetyStock || 0}
                  onChange={(e) => handleFormChange('inventory.safetyStock', parseInt(e.target.value) || 0)}
                />
              </FormGroup>
            </Card>
          </Grid>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button variant="success" onClick={handleSaveProduct}>
              {isCreating ? '상품 등록' : '수정 완료'}
            </Button>
            <Button variant="secondary" onClick={cancelEdit}>
              취소
            </Button>
          </div>
        </Section>
      )}

      {/* 상품 상세 정보 */}
      {selectedProduct && !isEditing && !isCreating && (
        <Section>
          <SectionTitle>
            🔍 상품 상세 정보 - {selectedProduct.name}
            <Button onClick={() => setSelectedProduct(null)} style={{ float: 'right' }}>
              닫기
            </Button>
          </SectionTitle>

          <Grid>
            <Card>
              <h3>기본 정보</h3>
              <p><strong>ID:</strong> {selectedProduct.id}</p>
              <p><strong>이름:</strong> {selectedProduct.name}</p>
              <p><strong>브랜드:</strong> {selectedProduct.brand}</p>
              <p><strong>SKU:</strong> {selectedProduct.sku}</p>
              <p><strong>상태:</strong> {getProductStatusText(selectedProduct.status)}</p>
              <p><strong>등록일:</strong> {new Date(selectedProduct.createdAt).toLocaleDateString()}</p>
            </Card>

            <Card>
              <h3>가격 정보</h3>
              <p><strong>정가:</strong> {selectedProduct.price.regular.toLocaleString()}원</p>
              <p><strong>판매가:</strong> {selectedProduct.price.sale.toLocaleString()}원</p>
              <p><strong>할인 금액:</strong> {selectedProduct.price.discount.toLocaleString()}원</p>
              <p><strong>할인율:</strong> {selectedProduct.price.discountRate}%</p>
            </Card>

            <Card>
              <h3>재고 정보</h3>
              <p><strong>총 재고:</strong> {selectedProduct.inventory.total}개</p>
              <p><strong>판매 가능:</strong> {selectedProduct.inventory.available}개</p>
              <p><strong>예약됨:</strong> {selectedProduct.inventory.reserved}개</p>
              <p><strong>안전 재고:</strong> {selectedProduct.inventory.safetyStock}개</p>
            </Card>

            <Card>
              <h3>통계 정보</h3>
              <p><strong>조회수:</strong> {selectedProduct.stats.viewCount}회</p>
              <p><strong>판매량:</strong> {selectedProduct.stats.purchaseCount}개</p>
              <p><strong>위시리스트:</strong> {selectedProduct.stats.wishlistCount}개</p>
              <p><strong>평균 평점:</strong> {selectedProduct.stats.rating}⭐</p>
              <p><strong>리뷰 수:</strong> {selectedProduct.stats.reviewCount}개</p>
            </Card>
          </Grid>
        </Section>
      )}

      {/* 카테고리 및 추가 기능들 */}
      <Section>
        <SectionTitle>🔧 추가 기능들</SectionTitle>
        <Grid>
          <Card>
            <h3>인기 상품</h3>
            {getBestSellers().slice(0, 3).map(product => (
              <div key={product.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{product.name}</span>
                <span>{product.stats.purchaseCount}개 판매</span>
              </div>
            ))}
          </Card>

          <Card>
            <h3>추천 상품</h3>
            {getFeaturedProducts().slice(0, 3).map(product => (
              <div key={product.id} style={{ 
                padding: '10px', 
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{product.name}</span>
                <span>{product.stats.rating}⭐</span>
              </div>
            ))}
          </Card>

          <Card>
            <h3>카테고리별 상품 수</h3>
            {Object.entries(stats.categoryDistribution).map(([category, count]) => (
              <div key={category} style={{ 
                padding: '5px 0',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{DEFAULT_CATEGORIES.find(c => c.id === category)?.name || category}</span>
                <span>{count}개</span>
              </div>
            ))}
          </Card>
        </Grid>
      </Section>
    </Container>
  );
};

export default ProductManagementExample;