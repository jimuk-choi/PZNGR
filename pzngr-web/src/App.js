import styled from "styled-components";
import Header from "./components/Header";

const AppContainer = styled.div`
  text-align: center;
  min-height: 100vh;
  background-color: #ffffff;
`;

function App() {
  return (
    <AppContainer>
      <Header />
    </AppContainer>
  );
}

export default App;
