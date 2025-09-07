import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { theme, GlobalStyle } from "../shared/styles";
import { useAppInitialization } from "../hooks/useAppInitialization.jsx";
import ScrollToTop from "../components/atoms/ScrollToTop";
import AppLoadingScreen from "../components/organisms/AppLoadingScreen";
import AppErrorScreen from "../components/organisms/AppErrorScreen";
import Main from "../pages/Main";
import Shop from "../pages/Shop";
import ProductDetail from "../pages/ProductDetail";
import CustomerService from "../pages/CustomerService";
import Cart from "../pages/Cart";
import MyPage from "../pages/MyPage";
import { Login, Register, ForgotPassword, ResetPassword, EditProfile, DeleteAccount } from "../pages/Auth";
import { ProductManagement, CategoryManagement, AdminDashboard, CouponManagement } from "../pages/Admin";
import AdminRoute from "../components/atoms/AdminRoute";

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "626950598844-qhf3a0i33c6jbfuhpdkrq2ltuuaoblej.apps.googleusercontent.com";

function App() {
  const {
    showLoading,
    showError,
    canProceed,
    error,
    retryInitialization,
    initializationStatus
  } = useAppInitialization();

  // 로딩 화면 표시
  if (showLoading) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AppLoadingScreen status={initializationStatus} />
      </ThemeProvider>
    );
  }

  // 오류 화면 표시
  if (showError) {
    return (
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <AppErrorScreen 
          error={error} 
          onRetry={retryInitialization}
          status={initializationStatus}
        />
      </ThemeProvider>
    );
  }

  // 앱 준비 완료 - 정상 라우팅
  if (canProceed) {
    return (
      <GoogleOAuthProvider 
        clientId={GOOGLE_CLIENT_ID}
        onScriptLoadError={() => console.error('Google OAuth 스크립트 로드 실패')}
        onScriptLoadSuccess={() => console.log('Google OAuth 스크립트 로드 성공')}
      >
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Router>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Main />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/customer-service" element={<CustomerService />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/my-page" element={<MyPage />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route path="/auth/edit-profile" element={<EditProfile />} />
              <Route path="/auth/delete-account" element={<DeleteAccount />} />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/products" element={
                <AdminRoute>
                  <ProductManagement />
                </AdminRoute>
              } />
              <Route path="/admin/products/new" element={
                <AdminRoute>
                  <ProductManagement />
                </AdminRoute>
              } />
              <Route path="/admin/products/edit/:productId" element={
                <AdminRoute>
                  <ProductManagement />
                </AdminRoute>
              } />
              <Route path="/admin/categories" element={
                <AdminRoute>
                  <CategoryManagement />
                </AdminRoute>
              } />
              <Route path="/admin/coupons" element={
                <AdminRoute>
                  <CouponManagement />
                </AdminRoute>
              } />
              {/* 기존 호환성을 위한 리다이렉트 */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </GoogleOAuthProvider>
    );
  }

  // 예상치 못한 상태 - 기본 로딩
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div>앱을 준비하고 있습니다...</div>
      </div>
    </ThemeProvider>
  );
}

export default App;
