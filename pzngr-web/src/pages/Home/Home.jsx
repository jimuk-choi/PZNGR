import React from "react";
import { HomeContainer, HomeImage } from "./styles.jsx";
import { Img01 } from "../../assets/images";

const Home = () => {
  return (
    <HomeContainer>
      <HomeImage src={Img01} alt="Main visual" />
    </HomeContainer>
  );
};

export default Home;
