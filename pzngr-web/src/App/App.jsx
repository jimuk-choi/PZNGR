import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import { AppContainer } from "./styles.jsx";
import Shop from "../pages/Shop";

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<h1>홈 페이지</h1>} /> {/* 임시 홈 페이지 */}
          <Route path="/shop" element={<Shop />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
