import React from "react";
import { useNavigate } from "react-router-dom";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import Container from "../../components/atoms/Container/Container.jsx";
import Text from "../../components/atoms/Text/Text.jsx";
import {
  MyPageContainer,
  MyPageTitle,
  MyPageContent,
  MenuSection,
  MenuList,
  MenuItem,
} from "./MyPage.styles.jsx";

const MyPage = () => {
  const navigate = useNavigate();
  return (
    <PageTemplate>
      <Container>
        <MyPageContainer>
          <MyPageTitle>
            <Text size="xxl" weight="semibold">
              My Page
            </Text>
          </MyPageTitle>
          
          <MyPageContent>
            <MenuSection>
              <MenuList>
                <MenuItem>
                  <Text size="md">주문 내역</Text>
                </MenuItem>
                <MenuItem>
                  <Text size="md">배송 조회</Text>
                </MenuItem>
                <MenuItem onClick={() => navigate('/auth/edit-profile')} style={{cursor: 'pointer'}}>
                  <Text size="md">회원 정보 수정</Text>
                </MenuItem>
                <MenuItem>
                  <Text size="md">문의하기</Text>
                </MenuItem>
              </MenuList>
            </MenuSection>
          </MyPageContent>
        </MyPageContainer>
      </Container>
    </PageTemplate>
  );
};

export default MyPage;