import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/LoginTemp.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Dashboard from "./styles/pages/Dashboard.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import Expense from "./pages/user/expenses/Expense.jsx";
import Incomse from "./pages/user/imcomes/Incomse.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import ProtectedRoute from "./components/protuctions/ProtectedRoule.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <UserProvider>
            <Routes>
              {/* Your routes and components go here */}
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<Login />} />
              <Route path="/auth/login" element={<Login />} />
              <Route
                path="/auth/forgot-password"
                element={<ForgotPassword />}
              />
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route element={<ProtectedRoute requiredRoles={['admin']} />}>
                <Route path="/admin/*" element={<AdminDashboard />} />

              </Route>
              <Route element={<ProtectedRoute requiredRoles={['USER']} />}>
                <Route path="/user/*" element={<UserDashboard />} />
                <Route path="/user/expenses" element={<Expense />} />
                <Route path="/user/incomes" element={<Incomse />} />
              </Route>
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
