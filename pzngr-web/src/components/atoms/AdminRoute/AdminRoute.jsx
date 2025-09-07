import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../../stores/userStore';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useUserStore();
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (!isAdmin()) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh', 
        textAlign: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <h2>접근 권한이 없습니다</h2>
        <p>관리자만 접근할 수 있는 페이지입니다.</p>
        <button 
          onClick={() => window.history.back()}
          style={{
            padding: '10px 20px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            background: 'white',
            cursor: 'pointer'
          }}
        >
          이전 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return children;
};

export default AdminRoute;