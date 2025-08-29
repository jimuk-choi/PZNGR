import React, { useState } from 'react';
import styled from 'styled-components';
import Button from '../../atoms/Button';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  padding: 2rem;
  color: white;
`;

const ErrorContent = styled.div`
  text-align: center;
  max-width: 500px;
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 3rem 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const ErrorIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 2rem;
`;

const ErrorTitle = styled.h1`
  color: white;
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const ErrorMessage = styled.p`
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  text-align: left;
  margin-bottom: 2rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;

  summary {
    color: rgba(255, 255, 255, 0.9);
    font-weight: 500;
    margin-bottom: 0.5rem;
    outline: none;
    cursor: pointer;

    &:hover {
      color: white;
    }
  }
`;

const ErrorCode = styled.code`
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  color: #ffeaa7;
  white-space: pre-wrap;
  word-break: break-word;
  display: block;
  margin-top: 0.5rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ReloadButton = styled(Button)`
  background: white;
  color: #ee5a24;
  border: none;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: #f8f9fa;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const RefreshPageButton = styled(Button)`
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.5);
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: white;
    transform: translateY(-2px);
  }
`;

const StatusInfo = styled.div`
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;
`;

const StatusTitle = styled.h3`
  color: white;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const StatusItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.25rem 0;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
`;

const StatusIcon = styled.span`
  margin-right: 8px;
  font-size: 0.8rem;
`;

const AppErrorScreen = ({ error, onRetry, status }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  
  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await onRetry();
    } catch (retryError) {
      console.error('Retry failed:', retryError);
    }
    setIsRetrying(false);
  };

  const handleRefreshPage = () => {
    window.location.reload();
  };

  const getErrorDisplayMessage = (error) => {
    if (typeof error === 'string') return error;
    if (error?.message) return error.message;
    return '알 수 없는 오류가 발생했습니다.';
  };

  const getErrorDetails = (error) => {
    if (typeof error === 'object' && error !== null) {
      return JSON.stringify(error, null, 2);
    }
    return error?.toString() || '세부 정보 없음';
  };

  const statusItems = status?.dataStatus ? [
    { key: 'products', label: '상품 데이터', status: status.dataStatus.products },
    { key: 'users', label: '사용자 시스템', status: status.dataStatus.users },
    { key: 'categories', label: '카테고리', status: status.dataStatus.categories },
    { key: 'overall', label: '전체 시스템', status: status.dataStatus.overall }
  ] : [];

  return (
    <ErrorContainer>
      <ErrorContent>
        <ErrorIcon>⚠️</ErrorIcon>
        
        <ErrorTitle>앱 시작 오류</ErrorTitle>
        
        <ErrorMessage>
          PZNGR 앱을 시작하는 중 문제가 발생했습니다.
          <br />
          아래 버튼을 눌러 다시 시도해보세요.
        </ErrorMessage>

        <ErrorMessage>
          <strong>오류 내용:</strong> {getErrorDisplayMessage(error)}
        </ErrorMessage>

        {status && (
          <StatusInfo>
            <StatusTitle>시스템 상태</StatusTitle>
            <StatusList>
              {statusItems.map((item) => (
                <StatusItem key={item.key}>
                  <StatusIcon>{item.status ? '✅' : '❌'}</StatusIcon>
                  {item.label}: {item.status ? '정상' : '오류'}
                </StatusItem>
              ))}
            </StatusList>
          </StatusInfo>
        )}

        <ErrorDetails>
          <summary>기술 세부정보 보기</summary>
          <ErrorCode>{getErrorDetails(error)}</ErrorCode>
          {status && (
            <ErrorCode>{JSON.stringify(status, null, 2)}</ErrorCode>
          )}
        </ErrorDetails>

        <ButtonGroup>
          <ReloadButton 
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? '재시도 중...' : '다시 시도'}
          </ReloadButton>
          
          <RefreshPageButton 
            onClick={handleRefreshPage}
          >
            페이지 새로고침
          </RefreshPageButton>
        </ButtonGroup>

        <ErrorMessage style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
          문제가 계속 발생하면 브라우저의 개발자 도구(F12)에서 
          더 자세한 오류 정보를 확인할 수 있습니다.
        </ErrorMessage>
      </ErrorContent>
    </ErrorContainer>
  );
};

export default AppErrorScreen;