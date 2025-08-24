import React from "react";
import { MainLayout } from "../../layouts";
import { PageContainer } from "./PageTemplate.styles.jsx";

const PageTemplate = ({ children, className = "", ...props }) => {
  return (
    <MainLayout>
      <PageContainer className={className} {...props}>
        {children}
      </PageContainer>
    </MainLayout>
  );
};

export default PageTemplate;