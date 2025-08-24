import React from "react";
import Header from "../../organisms/Header/Header.jsx";
import Footer from "../../organisms/Footer/Footer.jsx";
import { LayoutContainer, MainContent } from "./MainLayout.styles.jsx";

const MainLayout = ({ children }) => {
  return (
    <LayoutContainer>
      <Header />
      <MainContent>
        {children}
      </MainContent>
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout;