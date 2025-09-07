import React, { useState, useEffect } from 'react';
import Container from '../../components/atoms/Container';
import Text from '../../components/atoms/Text';
import Button from '../../components/atoms/Button';
import { useCouponStore } from '../../stores/couponStore';
import { useCategoryStore } from '../../stores/categoryStore';
import { 
  COUPON_TYPE, 
  COUPON_STATUS, 
  CONDITION_TYPE,
  createEmptyCoupon,
  generateCouponCode,
  DEFAULT_COUPON_TEMPLATES 
} from '../../models/Coupon';
import * as S from './CouponManagement.styles';

const CouponManagement = () => {
  const {
    addCoupon,
    updateCoupon,
    removeCoupon,
    duplicateCoupon,
    getCouponStatistics,
    getExpiringSoonCoupons,
    searchCoupons,
    bulkUpdateCoupons,
    checkExpiredCoupons
  } = useCouponStore();
  
  const { getActiveCategories } = useCategoryStore();
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState(createEmptyCoupon());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCoupons, setSelectedCoupons] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const statistics = getCouponStatistics();
  const expiringSoonCoupons = getExpiringSoonCoupons(7);
  const filteredCoupons = searchCoupons(searchTerm).filter(coupon => {
    if (statusFilter === 'all') return true;
    return coupon.status === statusFilter;
  });

  useEffect(() => {
    checkExpiredCoupons();
  }, [checkExpiredCoupons]);

  const handleAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm(createEmptyCoupon());
    setIsFormOpen(true);
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setCouponForm({
      ...coupon,
      validity: {
        ...coupon.validity,
        startDate: new Date(coupon.validity.startDate).toISOString().split('T')[0],
        endDate: new Date(coupon.validity.endDate).toISOString().split('T')[0]
      }
    });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!couponForm.name || !couponForm.code || couponForm.discountValue <= 0) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    const couponData = {
      ...couponForm,
      validity: {
        ...couponForm.validity,
        startDate: new Date(couponForm.validity.startDate),
        endDate: new Date(couponForm.validity.endDate)
      }
    };

    if (editingCoupon) {
      updateCoupon(editingCoupon.id, couponData);
      alert('쿠폰이 성공적으로 수정되었습니다.');
    } else {
      addCoupon(couponData);
      alert('쿠폰이 성공적으로 등록되었습니다.');
    }

    setIsFormOpen(false);
    setEditingCoupon(null);
    setCouponForm(createEmptyCoupon());
  };

  const handleDeleteCoupon = (couponId) => {
    if (window.confirm('정말로 이 쿠폰을 삭제하시겠습니까?')) {
      removeCoupon(couponId);
      alert('쿠폰이 삭제되었습니다.');
    }
  };

  const handleDuplicateCoupon = (couponId) => {
    const newCouponId = duplicateCoupon(couponId);
    if (newCouponId) {
      alert('쿠폰이 복사되었습니다.');
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setCouponForm(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setCouponForm(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleConditionAdd = () => {
    setCouponForm(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        {
          id: `condition_${Date.now()}`,
          type: CONDITION_TYPE.MIN_ORDER_AMOUNT,
          value: 0
        }
      ]
    }));
  };

  const handleConditionRemove = (conditionId) => {
    setCouponForm(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== conditionId)
    }));
  };

  const handleConditionChange = (conditionId, field, value) => {
    setCouponForm(prev => ({
      ...prev,
      conditions: prev.conditions.map(c =>
        c.id === conditionId ? { ...c, [field]: value } : c
      )
    }));
  };

  const handleBulkAction = (action) => {
    if (selectedCoupons.length === 0) {
      alert('쿠폰을 선택해주세요.');
      return;
    }

    switch (action) {
      case 'activate':
        bulkUpdateCoupons(selectedCoupons, { status: COUPON_STATUS.ACTIVE });
        alert(`${selectedCoupons.length}개 쿠폰이 활성화되었습니다.`);
        break;
      case 'deactivate':
        bulkUpdateCoupons(selectedCoupons, { status: COUPON_STATUS.INACTIVE });
        alert(`${selectedCoupons.length}개 쿠폰이 비활성화되었습니다.`);
        break;
      case 'delete':
        if (window.confirm(`선택한 ${selectedCoupons.length}개 쿠폰을 삭제하시겠습니까?`)) {
          selectedCoupons.forEach(id => removeCoupon(id));
          alert('선택한 쿠폰들이 삭제되었습니다.');
        }
        break;
      default:
        break;
    }
    
    setSelectedCoupons([]);
    setShowBulkActions(false);
  };

  const handleTemplateUse = (template) => {
    const templateCoupon = {
      ...createEmptyCoupon(),
      ...template,
      code: generateCouponCode()
    };
    setCouponForm(templateCoupon);
    setShowTemplateModal(false);
    setIsFormOpen(true);
  };

  return (
    <Container>
      <S.PageHeader>
        <div>
          <Text variant="h2">쿠폰 관리</Text>
          <Text variant="body1" color="gray">
            할인 쿠폰을 등록하고 관리할 수 있습니다.
          </Text>
        </div>
        <S.HeaderActions>
          <Button variant="outline" onClick={() => setShowTemplateModal(true)}>
            템플릿 사용
          </Button>
          <Button variant="primary" onClick={handleAddCoupon}>
            새 쿠폰 등록
          </Button>
        </S.HeaderActions>
      </S.PageHeader>

      <S.StatsGrid>
        <S.StatCard>
          <S.StatNumber>{statistics.total}</S.StatNumber>
          <S.StatLabel>전체 쿠폰</S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatNumber>{statistics.active}</S.StatNumber>
          <S.StatLabel>활성 쿠폰</S.StatLabel>
        </S.StatCard>
        <S.StatCard>
          <S.StatNumber>{statistics.totalUsed}</S.StatNumber>
          <S.StatLabel>총 사용량</S.StatLabel>
        </S.StatCard>
        <S.StatCard $warning={expiringSoonCoupons.length > 0}>
          <S.StatNumber>{expiringSoonCoupons.length}</S.StatNumber>
          <S.StatLabel>곧 만료 (7일 이내)</S.StatLabel>
        </S.StatCard>
      </S.StatsGrid>

      {expiringSoonCoupons.length > 0 && (
        <S.AlertBanner>
          <Text variant="body2">
            ⚠️ {expiringSoonCoupons.length}개의 쿠폰이 7일 이내에 만료됩니다.
          </Text>
        </S.AlertBanner>
      )}

      <S.FilterSection>
        <S.SearchInput
          type="text"
          placeholder="쿠폰 이름, 코드, 설명으로 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <S.FilterSelect
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="expired">만료됨</option>
          <option value="exhausted">소진됨</option>
        </S.FilterSelect>
        {selectedCoupons.length > 0 && (
          <Button 
            variant="outline" 
            onClick={() => setShowBulkActions(!showBulkActions)}
          >
            일괄 작업 ({selectedCoupons.length})
          </Button>
        )}
      </S.FilterSection>

      {showBulkActions && (
        <S.BulkActionBar>
          <Button variant="outline" onClick={() => handleBulkAction('activate')}>
            활성화
          </Button>
          <Button variant="outline" onClick={() => handleBulkAction('deactivate')}>
            비활성화
          </Button>
          <Button variant="danger" onClick={() => handleBulkAction('delete')}>
            삭제
          </Button>
        </S.BulkActionBar>
      )}

      <S.CouponList>
        {filteredCoupons.map(coupon => (
          <S.CouponCard key={coupon.id} $status={coupon.status}>
            <S.CouponCheckbox>
              <input
                type="checkbox"
                checked={selectedCoupons.includes(coupon.id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedCoupons(prev => [...prev, coupon.id]);
                  } else {
                    setSelectedCoupons(prev => prev.filter(id => id !== coupon.id));
                  }
                }}
              />
            </S.CouponCheckbox>
            
            <S.CouponHeader>
              <div>
                <S.CouponName>{coupon.name}</S.CouponName>
                <S.CouponCode>{coupon.code}</S.CouponCode>
              </div>
              <S.CouponStatus $status={coupon.status}>
                {coupon.status === 'active' && '활성'}
                {coupon.status === 'inactive' && '비활성'}
                {coupon.status === 'expired' && '만료됨'}
                {coupon.status === 'exhausted' && '소진됨'}
              </S.CouponStatus>
            </S.CouponHeader>
            
            <S.CouponDescription>
              {coupon.description}
            </S.CouponDescription>
            
            <S.CouponDetails>
              <S.DetailItem>
                <span>할인:</span>
                <span>
                  {coupon.type === 'percentage' && `${coupon.discountValue}%`}
                  {coupon.type === 'fixed_amount' && `${coupon.discountValue.toLocaleString()}원`}
                  {coupon.type === 'free_shipping' && '무료배송'}
                </span>
              </S.DetailItem>
              <S.DetailItem>
                <span>최소 주문:</span>
                <span>{coupon.minOrderAmount.toLocaleString()}원</span>
              </S.DetailItem>
              <S.DetailItem>
                <span>사용량:</span>
                <span>{coupon.usage.used}/{coupon.usage.limit || '무제한'}</span>
              </S.DetailItem>
              <S.DetailItem>
                <span>유효기간:</span>
                <span>
                  {coupon.validity.isAlwaysValid 
                    ? '무기한' 
                    : `${new Date(coupon.validity.startDate).toLocaleDateString()} ~ ${new Date(coupon.validity.endDate).toLocaleDateString()}`
                  }
                </span>
              </S.DetailItem>
            </S.CouponDetails>
            
            <S.CouponActions>
              <Button size="small" variant="outline" onClick={() => handleEditCoupon(coupon)}>
                수정
              </Button>
              <Button size="small" variant="outline" onClick={() => handleDuplicateCoupon(coupon.id)}>
                복사
              </Button>
              <Button size="small" variant="danger" onClick={() => handleDeleteCoupon(coupon.id)}>
                삭제
              </Button>
            </S.CouponActions>
          </S.CouponCard>
        ))}
      </S.CouponList>

      {filteredCoupons.length === 0 && (
        <S.EmptyState>
          <Text variant="body1" color="gray">
            {searchTerm || statusFilter !== 'all' 
              ? '검색 조건에 맞는 쿠폰이 없습니다.' 
              : '등록된 쿠폰이 없습니다.'
            }
          </Text>
        </S.EmptyState>
      )}

      {isFormOpen && (
        <S.Modal onClick={() => setIsFormOpen(false)}>
          <S.ModalContent onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <Text variant="h3">
                {editingCoupon ? '쿠폰 수정' : '새 쿠폰 등록'}
              </Text>
              <S.CloseButton onClick={() => setIsFormOpen(false)}>×</S.CloseButton>
            </S.ModalHeader>

            <S.CouponForm onSubmit={handleFormSubmit}>
              <S.FormSection>
                <Text variant="h4">기본 정보</Text>
                
                <S.InputGroup>
                  <S.Label>쿠폰 이름 *</S.Label>
                  <S.Input
                    type="text"
                    name="name"
                    value={couponForm.name}
                    onChange={handleFormChange}
                    placeholder="쿠폰 이름을 입력하세요"
                    required
                  />
                </S.InputGroup>

                <S.InputGroup>
                  <S.Label>쿠폰 코드 *</S.Label>
                  <S.InputWithButton>
                    <S.Input
                      type="text"
                      name="code"
                      value={couponForm.code}
                      onChange={handleFormChange}
                      placeholder="쿠폰 코드를 입력하세요"
                      required
                    />
                    <Button 
                      type="button" 
                      size="small"
                      onClick={() => setCouponForm(prev => ({
                        ...prev,
                        code: generateCouponCode()
                      }))}
                    >
                      자동생성
                    </Button>
                  </S.InputWithButton>
                </S.InputGroup>

                <S.InputGroup>
                  <S.Label>설명</S.Label>
                  <S.TextArea
                    name="description"
                    value={couponForm.description}
                    onChange={handleFormChange}
                    placeholder="쿠폰 설명을 입력하세요"
                    rows={3}
                  />
                </S.InputGroup>
              </S.FormSection>

              <S.FormSection>
                <Text variant="h4">할인 설정</Text>
                
                <S.InputGroup>
                  <S.Label>할인 타입 *</S.Label>
                  <S.Select
                    name="type"
                    value={couponForm.type}
                    onChange={handleFormChange}
                    required
                  >
                    <option value={COUPON_TYPE.PERCENTAGE}>정률 할인 (%)</option>
                    <option value={COUPON_TYPE.FIXED_AMOUNT}>정액 할인 (원)</option>
                    <option value={COUPON_TYPE.FREE_SHIPPING}>무료배송</option>
                  </S.Select>
                </S.InputGroup>

                {couponForm.type !== COUPON_TYPE.FREE_SHIPPING && (
                  <S.InputGroup>
                    <S.Label>할인 값 *</S.Label>
                    <S.Input
                      type="number"
                      name="discountValue"
                      value={couponForm.discountValue}
                      onChange={handleFormChange}
                      placeholder={couponForm.type === COUPON_TYPE.PERCENTAGE ? "할인 퍼센트" : "할인 금액"}
                      required
                    />
                  </S.InputGroup>
                )}

                {couponForm.type === COUPON_TYPE.PERCENTAGE && (
                  <S.InputGroup>
                    <S.Label>최대 할인 금액</S.Label>
                    <S.Input
                      type="number"
                      name="maxDiscountAmount"
                      value={couponForm.maxDiscountAmount}
                      onChange={handleFormChange}
                      placeholder="최대 할인 금액 (0: 무제한)"
                    />
                  </S.InputGroup>
                )}

                <S.InputGroup>
                  <S.Label>최소 주문 금액</S.Label>
                  <S.Input
                    type="number"
                    name="minOrderAmount"
                    value={couponForm.minOrderAmount}
                    onChange={handleFormChange}
                    placeholder="최소 주문 금액"
                  />
                </S.InputGroup>
              </S.FormSection>

              <S.FormSection>
                <Text variant="h4">사용 제한</Text>
                
                <S.InputRow>
                  <S.InputGroup>
                    <S.Label>총 사용 제한</S.Label>
                    <S.Input
                      type="number"
                      name="usage.limit"
                      value={couponForm.usage.limit}
                      onChange={handleFormChange}
                      placeholder="0: 무제한"
                    />
                  </S.InputGroup>
                  
                  <S.InputGroup>
                    <S.Label>사용자별 제한</S.Label>
                    <S.Input
                      type="number"
                      name="usage.limitPerUser"
                      value={couponForm.usage.limitPerUser}
                      onChange={handleFormChange}
                      placeholder="사용자당 사용 가능 횟수"
                    />
                  </S.InputGroup>
                </S.InputRow>
              </S.FormSection>

              <S.FormSection>
                <Text variant="h4">유효기간</Text>
                
                <S.CheckboxGroup>
                  <input
                    type="checkbox"
                    name="validity.isAlwaysValid"
                    checked={couponForm.validity.isAlwaysValid}
                    onChange={handleFormChange}
                  />
                  <label>무기한 사용 가능</label>
                </S.CheckboxGroup>

                {!couponForm.validity.isAlwaysValid && (
                  <S.InputRow>
                    <S.InputGroup>
                      <S.Label>시작일</S.Label>
                      <S.Input
                        type="date"
                        name="validity.startDate"
                        value={couponForm.validity.startDate}
                        onChange={handleFormChange}
                      />
                    </S.InputGroup>
                    
                    <S.InputGroup>
                      <S.Label>종료일</S.Label>
                      <S.Input
                        type="date"
                        name="validity.endDate"
                        value={couponForm.validity.endDate}
                        onChange={handleFormChange}
                      />
                    </S.InputGroup>
                  </S.InputRow>
                )}
              </S.FormSection>

              <S.FormSection>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text variant="h4">적용 조건</Text>
                  <Button type="button" size="small" onClick={handleConditionAdd}>
                    조건 추가
                  </Button>
                </div>
                
                {couponForm.conditions.map((condition) => (
                  <S.ConditionRow key={condition.id}>
                    <S.Select
                      value={condition.type}
                      onChange={(e) => handleConditionChange(condition.id, 'type', e.target.value)}
                    >
                      <option value={CONDITION_TYPE.MIN_ORDER_AMOUNT}>최소 주문 금액</option>
                      <option value={CONDITION_TYPE.CATEGORY}>특정 카테고리</option>
                      <option value={CONDITION_TYPE.PRODUCT}>특정 상품</option>
                      <option value={CONDITION_TYPE.FIRST_ORDER}>첫 주문</option>
                    </S.Select>
                    
                    {condition.type === CONDITION_TYPE.MIN_ORDER_AMOUNT && (
                      <S.Input
                        type="number"
                        value={condition.value}
                        onChange={(e) => handleConditionChange(condition.id, 'value', parseInt(e.target.value))}
                        placeholder="최소 주문 금액"
                      />
                    )}
                    
                    {condition.type === CONDITION_TYPE.CATEGORY && (
                      <S.Select
                        multiple
                        value={condition.value || []}
                        onChange={(e) => {
                          const selected = Array.from(e.target.selectedOptions, option => option.value);
                          handleConditionChange(condition.id, 'value', selected);
                        }}
                      >
                        {getActiveCategories().map(category => (
                          <option key={category.id} value={category.id}>
                            {'  '.repeat(category.level)}{category.name}
                          </option>
                        ))}
                      </S.Select>
                    )}
                    
                    <Button
                      type="button"
                      size="small"
                      variant="danger"
                      onClick={() => handleConditionRemove(condition.id)}
                    >
                      삭제
                    </Button>
                  </S.ConditionRow>
                ))}
              </S.FormSection>

              <S.FormSection>
                <Text variant="h4">진열 설정</Text>
                
                <S.CheckboxGroup>
                  <input
                    type="checkbox"
                    name="display.isPublic"
                    checked={couponForm.display.isPublic}
                    onChange={handleFormChange}
                  />
                  <label>공개 쿠폰</label>
                </S.CheckboxGroup>
                
                <S.CheckboxGroup>
                  <input
                    type="checkbox"
                    name="display.showInList"
                    checked={couponForm.display.showInList}
                    onChange={handleFormChange}
                  />
                  <label>쿠폰 목록에 표시</label>
                </S.CheckboxGroup>
              </S.FormSection>

              <S.FormActions>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  취소
                </Button>
                <Button type="submit" variant="primary">
                  {editingCoupon ? '수정' : '등록'}
                </Button>
              </S.FormActions>
            </S.CouponForm>
          </S.ModalContent>
        </S.Modal>
      )}

      {showTemplateModal && (
        <S.Modal onClick={() => setShowTemplateModal(false)}>
          <S.TemplateModal onClick={(e) => e.stopPropagation()}>
            <S.ModalHeader>
              <Text variant="h3">쿠폰 템플릿</Text>
              <S.CloseButton onClick={() => setShowTemplateModal(false)}>×</S.CloseButton>
            </S.ModalHeader>
            
            <S.TemplateGrid>
              {DEFAULT_COUPON_TEMPLATES.map((template, index) => (
                <S.TemplateCard key={index} onClick={() => handleTemplateUse(template)}>
                  <Text variant="h4">{template.name}</Text>
                  <Text variant="body2" color="gray">
                    {template.type === 'percentage' && `${template.discountValue}% 할인`}
                    {template.type === 'fixed_amount' && `${template.discountValue.toLocaleString()}원 할인`}
                    {template.type === 'free_shipping' && '무료배송'}
                  </Text>
                  {template.minOrderAmount > 0 && (
                    <Text variant="body2" color="gray">
                      최소 주문: {template.minOrderAmount.toLocaleString()}원
                    </Text>
                  )}
                </S.TemplateCard>
              ))}
            </S.TemplateGrid>
          </S.TemplateModal>
        </S.Modal>
      )}
    </Container>
  );
};

export default CouponManagement;