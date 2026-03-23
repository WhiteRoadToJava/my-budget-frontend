import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/forgotPassword.jsx";
import Dashboard from "./styles/pages/Dashboard.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <Routes>
              {/* Your routes and components go here */}
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route
                path="/auth/forgot-password"
                element={<ForgotPassword />}
              />
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
