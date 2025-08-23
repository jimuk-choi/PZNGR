import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App"; // This now points to src/App/index.js which exports App.jsx

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
