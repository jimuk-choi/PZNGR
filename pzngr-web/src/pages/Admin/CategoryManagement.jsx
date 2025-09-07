import React, { useState } from "react";
import Container from "../../components/atoms/Container";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import { useCategoryStore } from "../../stores/categoryStore";
import * as S from "./CategoryManagement.styles";

const CategoryManagement = () => {
  const {
    categories,
    getRootCategories,
    getChildCategories,
    addCategory,
    updateCategory,
    removeCategory,
    toggleCategoryActive,
    toggleCategoryInMenu,
    loading,
    error
  } = useCategoryStore();

  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState(new Set());
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    slug: '',
    parentId: null,
    icon: '',
    image: '',
    isActive: true,
    showInMenu: true
  });

  const [statusMessage, setStatusMessage] = useState('');

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slug: '',
      parentId: null,
      icon: '',
      image: '',
      isActive: true,
      showInMenu: true
    });
    setEditingCategory(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 이름이 변경되면 자동으로 slug 생성
    if (name === 'name' && value) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({
        ...prev,
        slug: slug
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setStatusMessage('카테고리 이름을 입력해주세요.');
      return;
    }

    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, formData);
        setStatusMessage('카테고리가 수정되었습니다.');
      } else {
        addCategory(formData);
        setStatusMessage('카테고리가 추가되었습니다.');
      }
      
      resetForm();
      setShowForm(false);
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (error) {
      setStatusMessage(`오류: ${error.message}`);
      setTimeout(() => setStatusMessage(''), 5000);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description,
      slug: category.slug,
      parentId: category.parentId,
      icon: category.icon,
      image: category.image,
      isActive: category.isActive,
      showInMenu: category.showInMenu
    });
    setShowForm(true);
  };

  const handleDelete = (category) => {
    const hasChildren = getChildCategories(category.id).length > 0;
    
    if (hasChildren) {
      alert('하위 카테고리가 있는 카테고리는 삭제할 수 없습니다.');
      return;
    }

    if (window.confirm(`"${category.name}" 카테고리를 삭제하시겠습니까?`)) {
      try {
        removeCategory(category.id);
        setStatusMessage('카테고리가 삭제되었습니다.');
        setTimeout(() => setStatusMessage(''), 3000);
      } catch (error) {
        setStatusMessage(`오류: ${error.message}`);
        setTimeout(() => setStatusMessage(''), 5000);
      }
    }
  };

  const handleToggleExpand = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const renderCategory = (category, level = 0) => {
    const children = getChildCategories(category.id);
    const hasChildren = children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id}>
        <S.CategoryItem level={level}>
          <S.CategoryInfo>
            {hasChildren && (
              <S.ExpandButton onClick={() => handleToggleExpand(category.id)}>
                {isExpanded ? '▼' : '▶'}
              </S.ExpandButton>
            )}
            
            <S.CategoryDetails hasChildren={hasChildren}>
              <S.CategoryName>
                {category.icon && <S.CategoryIcon>{category.icon}</S.CategoryIcon>}
                {category.name}
                {!category.isActive && <S.InactiveLabel>비활성</S.InactiveLabel>}
                {!category.showInMenu && <S.HiddenLabel>메뉴숨김</S.HiddenLabel>}
              </S.CategoryName>
              
              <S.CategoryDescription>{category.description}</S.CategoryDescription>
              
              <S.CategoryMeta>
                <span>ID: {category.id}</span>
                <span>Slug: {category.slug}</span>
                <span>Level: {category.level}</span>
                <span>상품: {category.stats?.productCount || 0}개</span>
              </S.CategoryMeta>
            </S.CategoryDetails>
          </S.CategoryInfo>

          <S.CategoryActions>
            <Button 
              variant="outline" 
              size="small" 
              onClick={() => handleEdit(category)}
            >
              수정
            </Button>
            
            <Button 
              variant={category.isActive ? "outline" : "primary"} 
              size="small"
              onClick={() => toggleCategoryActive(category.id)}
            >
              {category.isActive ? '비활성화' : '활성화'}
            </Button>
            
            <Button 
              variant="outline" 
              size="small"
              onClick={() => toggleCategoryInMenu(category.id)}
            >
              {category.showInMenu ? '메뉴숨김' : '메뉴표시'}
            </Button>
            
            <Button 
              variant="danger" 
              size="small" 
              onClick={() => handleDelete(category)}
              disabled={hasChildren}
            >
              삭제
            </Button>
          </S.CategoryActions>
        </S.CategoryItem>

        {isExpanded && children.map(child => renderCategory(child, level + 1))}
      </div>
    );
  };

  return (
    <Container>
      <S.PageHeader>
        <Text variant="h2">카테고리 관리</Text>
        <Text variant="body1" color="gray">
          상품 카테고리를 생성, 수정, 삭제할 수 있습니다.
        </Text>
      </S.PageHeader>

      {statusMessage && (
        <S.StatusMessage $success={!statusMessage.startsWith('오류')}>
          {statusMessage}
        </S.StatusMessage>
      )}

      <S.ActionBar>
        <Button
          variant="primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? '취소' : '카테고리 추가'}
        </Button>
        
        <S.CategoryCount>
          총 {categories.length}개 카테고리
        </S.CategoryCount>
      </S.ActionBar>

      {showForm && (
        <S.FormContainer>
          <S.FormTitle>
            {editingCategory ? '카테고리 수정' : '카테고리 추가'}
          </S.FormTitle>
          
          <S.Form onSubmit={handleSubmit}>
            <S.FormRow>
              <S.InputGroup>
                <S.Label>카테고리 이름 *</S.Label>
                <S.Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="카테고리 이름을 입력하세요"
                  required
                />
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>Slug</S.Label>
                <S.Input
                  type="text"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="URL 슬러그 (자동 생성)"
                />
              </S.InputGroup>
            </S.FormRow>

            <S.InputGroup>
              <S.Label>설명</S.Label>
              <S.TextArea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="카테고리 설명을 입력하세요"
                rows={3}
              />
            </S.InputGroup>

            <S.FormRow>
              <S.InputGroup>
                <S.Label>상위 카테고리</S.Label>
                <S.Select
                  name="parentId"
                  value={formData.parentId || ''}
                  onChange={handleInputChange}
                >
                  <option value="">최상위 카테고리</option>
                  {categories.filter(cat => cat.level < 2 && cat.id !== editingCategory?.id).map(category => (
                    <option key={category.id} value={category.id}>
                      {'  '.repeat(category.level)}
                      {category.name}
                    </option>
                  ))}
                </S.Select>
              </S.InputGroup>

              <S.InputGroup>
                <S.Label>아이콘</S.Label>
                <S.Input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleInputChange}
                  placeholder="예: fas fa-tshirt"
                />
              </S.InputGroup>
            </S.FormRow>

            <S.InputGroup>
              <S.Label>이미지 URL</S.Label>
              <S.Input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="카테고리 대표 이미지 URL"
              />
            </S.InputGroup>

            <S.CheckboxRow>
              <S.CheckboxGroup>
                <S.Checkbox
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                <S.CheckboxLabel>활성화</S.CheckboxLabel>
              </S.CheckboxGroup>

              <S.CheckboxGroup>
                <S.Checkbox
                  type="checkbox"
                  name="showInMenu"
                  checked={formData.showInMenu}
                  onChange={handleInputChange}
                />
                <S.CheckboxLabel>메뉴에 표시</S.CheckboxLabel>
              </S.CheckboxGroup>
            </S.CheckboxRow>

            <S.FormActions>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                취소
              </Button>
              <Button type="submit" variant="primary">
                {editingCategory ? '수정' : '추가'}
              </Button>
            </S.FormActions>
          </S.Form>
        </S.FormContainer>
      )}

      <S.CategoryList>
        <S.CategoryListTitle>카테고리 목록</S.CategoryListTitle>
        
        {loading ? (
          <S.LoadingMessage>카테고리를 불러오는 중...</S.LoadingMessage>
        ) : error ? (
          <S.ErrorMessage>오류: {error}</S.ErrorMessage>
        ) : (
          <S.CategoryTree>
            {getRootCategories().map(category => renderCategory(category))}
          </S.CategoryTree>
        )}
      </S.CategoryList>
    </Container>
  );
};

export default CategoryManagement;