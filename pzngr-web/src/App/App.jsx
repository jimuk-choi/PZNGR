import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppContainer } from "./styles.jsx";
import Main from "../pages/Main";
import Shop from "../pages/Shop";
import CustomerService from "../pages/CustomerService";

function App() {
  return (
    <Router>
      <AppContainer>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/customer-service" element={<CustomerService />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
