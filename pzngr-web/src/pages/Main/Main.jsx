import React from "react";
import PageTemplate from "../../components/templates/PageTemplate/PageTemplate.jsx";
import { MainImageSection } from "./Main.styles.jsx";
import { Img01 } from "../../shared/assets";

const Main = () => {
  return (
    <PageTemplate>
      <MainImageSection $bgImage={Img01} />
    </PageTemplate>
  );
};

export default Main;