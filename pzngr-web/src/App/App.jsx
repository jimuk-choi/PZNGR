import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { theme, GlobalStyle } from "../shared/styles";
import Main from "../pages/Main";
import Shop from "../pages/Shop";
import CustomerService from "../pages/CustomerService";
import Cart from "../pages/Cart";
import MyPage from "../pages/MyPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/customer-service" element={<CustomerService />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/my-page" element={<MyPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
