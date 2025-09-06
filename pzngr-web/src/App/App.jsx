import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
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
import { Login, Register } from "../pages/Auth";

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
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </Router>
      </ThemeProvider>
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
