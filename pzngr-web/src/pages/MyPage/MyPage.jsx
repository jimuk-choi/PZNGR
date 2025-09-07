import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../stores/userStore";
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
  const { user, isLoggedIn } = useUserStore();

  if (!isLoggedIn || !user) {
    navigate('/auth/login');
    return null;
  }

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
            {/* 사용자 프로필 섹션 */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '1.5rem',
              borderRadius: '8px',
              marginBottom: '2rem',
              border: '1px solid #e1e5e9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                {user.profileImage ? (
                  <img 
                    src={user.profileImage} 
                    alt="프로필" 
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      marginRight: '1rem',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#007bff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: 'bold'
                  }}>
                    {user.name?.charAt(0) || 'U'}
                  </div>
                )}
                
                <div>
                  <Text size="lg" weight="semibold" style={{ marginBottom: '0.25rem' }}>
                    {user.name}
                  </Text>
                  <Text size="sm" style={{ color: '#666', marginBottom: '0.5rem' }}>
                    {user.email}
                  </Text>
                  
                  {/* 연결된 소셜 계정 표시 */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Text size="xs" style={{ color: '#666' }}>
                      연결된 계정:
                    </Text>
                    {user.loginProvider === 'google' && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        Google
                      </span>
                    )}
                    {user.socialLogins?.google && user.loginProvider !== 'google' && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        Google
                      </span>
                    )}
                    {user.password && (
                      <span style={{
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#28a745',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        이메일
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
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