import React from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import ProductSection from "../../components/organisms/ProductSection/ProductSection.jsx";
import { MainImageSection, SectionSpacing } from "./Main.styles.jsx";
import { Img01 } from "../../shared/assets";

const Main = () => {
  return (
    <PageTemplate>
      <MainImageSection $bgImage={Img01} />

      <ProductSection />
    </PageTemplate>
  );
};

export default Main;
