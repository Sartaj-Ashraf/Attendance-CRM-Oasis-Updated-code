import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AuthProvider from "./ContextApi/isAuth"; // ✅ default import
import "./index.css";
import App from "./App.jsx";
// import "./styles/Global.css";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  // </StrictMode>
);
