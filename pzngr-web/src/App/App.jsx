import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "../components/Header";
import { AppContainer } from "./styles.jsx";
import Home from "../pages/Home";
import Shop from "../pages/Shop";
import CustomerService from "../pages/CustomerService";

function App() {
  return (
    <Router>
      <AppContainer>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/customer-service" element={<CustomerService />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
