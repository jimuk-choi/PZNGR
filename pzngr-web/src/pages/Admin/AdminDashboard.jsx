import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/atoms/Container";
import Text from "../../components/atoms/Text";
import Button from "../../components/atoms/Button";
import { useUserStore } from "../../stores/userStore";
import { useProductStore } from "../../stores/productStore";
import { useCategoryStore } from "../../stores/categoryStore";
import * as S from "./AdminDashboard.styles";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const products = useProductStore((state) => state.products);
  const categories = useCategoryStore((state) => state.categories);

  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    activeCategories: categories.filter(cat => cat.isActive).length
  };

  return (
    <Container>
      <S.DashboardHeader>
        <Text variant="h1">관리자 대시보드</Text>
        <Text variant="body1" color="gray">
          안녕하세요, {user?.name || 'Admin'}님! 관리자 기능을 사용하실 수 있습니다.
        </Text>
      </S.DashboardHeader>

      <S.StatsGrid>
        <S.StatCard>
          <S.StatNumber>{stats.totalProducts}</S.StatNumber>
          <S.StatLabel>총 상품 수</S.StatLabel>
        </S.StatCard>
        
        <S.StatCard>
          <S.StatNumber>{stats.totalCategories}</S.StatNumber>
          <S.StatLabel>총 카테고리 수</S.StatLabel>
        </S.StatCard>
        
        <S.StatCard>
          <S.StatNumber>{stats.activeCategories}</S.StatNumber>
          <S.StatLabel>활성 카테고리</S.StatLabel>
        </S.StatCard>
      </S.StatsGrid>

      <S.ManagementSection>
        <Text variant="h2">관리 기능</Text>
        
        <S.ManagementGrid>
          <S.ManagementCard>
            <S.CardHeader>
              <S.CardIcon>📦</S.CardIcon>
              <S.CardTitle>상품 관리</S.CardTitle>
            </S.CardHeader>
            <S.CardDescription>
              상품을 추가, 수정, 삭제하고 재고를 관리할 수 있습니다.
            </S.CardDescription>
            <S.CardActions>
              <Button 
                variant="primary" 
                onClick={() => navigate('/admin/products')}
              >
                상품 관리로 이동
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/products/new')}
              >
                새 상품 등록
              </Button>
            </S.CardActions>
          </S.ManagementCard>

          <S.ManagementCard>
            <S.CardHeader>
              <S.CardIcon>📂</S.CardIcon>
              <S.CardTitle>카테고리 관리</S.CardTitle>
            </S.CardHeader>
            <S.CardDescription>
              상품 카테고리를 생성, 수정, 삭제하고 계층 구조를 관리할 수 있습니다.
            </S.CardDescription>
            <S.CardActions>
              <Button 
                variant="primary" 
                onClick={() => navigate('/admin/categories')}
              >
                카테고리 관리로 이동
              </Button>
            </S.CardActions>
          </S.ManagementCard>

          <S.ManagementCard>
            <S.CardHeader>
              <S.CardIcon>📊</S.CardIcon>
              <S.CardTitle>주문 관리</S.CardTitle>
            </S.CardHeader>
            <S.CardDescription>
              고객 주문을 확인하고 배송 상태를 관리할 수 있습니다.
            </S.CardDescription>
            <S.CardActions>
              <Button 
                variant="outline" 
                disabled
              >
                준비 중
              </Button>
            </S.CardActions>
          </S.ManagementCard>

          <S.ManagementCard>
            <S.CardHeader>
              <S.CardIcon>👥</S.CardIcon>
              <S.CardTitle>사용자 관리</S.CardTitle>
            </S.CardHeader>
            <S.CardDescription>
              회원 정보를 확인하고 권한을 관리할 수 있습니다.
            </S.CardDescription>
            <S.CardActions>
              <Button 
                variant="outline" 
                disabled
              >
                준비 중
              </Button>
            </S.CardActions>
          </S.ManagementCard>
        </S.ManagementGrid>
      </S.ManagementSection>

      <S.QuickActions>
        <Text variant="h3">빠른 작업</Text>
        <S.QuickActionButtons>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/products/new')}
          >
            + 새 상품 등록
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/shop')}
          >
            🛍️ 쇼핑몰 보기
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
          >
            🏠 메인 페이지
          </Button>
        </S.QuickActionButtons>
      </S.QuickActions>
    </Container>
  );
};

export default AdminDashboard;