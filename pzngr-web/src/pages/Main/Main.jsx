import React from "react";
import { MainContainer, MainImage } from "./styles.jsx";
import { Img01 } from "../../assets/images";

const Main = () => {
  return (
    <MainContainer>
      <MainImage src={Img01} alt="Main visual" />
    </MainContainer>
  );
};

export default Main;
