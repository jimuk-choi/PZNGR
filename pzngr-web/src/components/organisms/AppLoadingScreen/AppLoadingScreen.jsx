import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  animation: ${fadeIn} 0.5s ease-in-out;
  padding: 2rem;
`;

const LoadingContent = styled.div`
  text-align: center;
  max-width: 400px;
  width: 100%;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  color: #007bff;
  margin-bottom: 2rem;
  letter-spacing: 2px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid #e3e3e3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto 2rem;
`;

const LoadingText = styled.h2`
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
`;

const LoadingSubtext = styled.p`
  color: #666;
  font-size: 1rem;
  margin-bottom: 2rem;
  line-height: 1.5;
`;

const StatusList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  text-align: left;
`;

const StatusItem = styled.li`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
  color: ${props => props.completed ? '#28a745' : '#666'};
  font-size: 0.9rem;
`;

const StatusIcon = styled.span`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  background: ${props => props.completed ? '#28a745' : '#e3e3e3'};
  color: white;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: #e3e3e3;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #007bff, #0056b3);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const AppLoadingScreen = ({ status }) => {
  const [progress, setProgress] = useState(0);
  const [dots, setDots] = useState('');

  // 점 애니메이션
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '';
        return prev + '.';
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  // 진행률 계산
  useEffect(() => {
    if (!status || !status.dataStatus) {
      setProgress(10);
      return;
    }

    const { dataStatus } = status;
    const completed = Object.values(dataStatus).filter(Boolean).length;
    const total = Object.keys(dataStatus).length;
    const calculatedProgress = Math.min(90, Math.max(10, (completed / total) * 80 + 10));
    
    setProgress(calculatedProgress);
  }, [status]);

  const statusItems = [
    { key: 'products', label: '상품 데이터 로딩', completed: status?.dataStatus?.products },
    { key: 'users', label: '사용자 시스템 초기화', completed: status?.dataStatus?.users },
    { key: 'categories', label: '카테고리 설정', completed: status?.dataStatus?.categories },
    { key: 'overall', label: '시스템 준비 완료', completed: status?.dataStatus?.overall }
  ];

  return (
    <LoadingContainer>
      <LoadingContent>
        <Logo>PZNGR</Logo>
        
        <Spinner />
        
        <LoadingText>앱을 시작하는 중{dots}</LoadingText>
        <LoadingSubtext>
          PZNGR 쇼핑몰의 모든 기능을 준비하고 있습니다.
          <br />잠시만 기다려 주세요.
        </LoadingSubtext>
        
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
        
        <StatusList>
          {statusItems.map((item) => (
            <StatusItem key={item.key} completed={item.completed}>
              <StatusIcon completed={item.completed}>
                {item.completed ? '✓' : '○'}
              </StatusIcon>
              {item.label}
            </StatusItem>
          ))}
        </StatusList>
        
        {status?.isInitializing && (
          <LoadingSubtext>
            초기 설정을 완료하는 중입니다...
          </LoadingSubtext>
        )}
      </LoadingContent>
    </LoadingContainer>
  );
};

export default AppLoadingScreen;