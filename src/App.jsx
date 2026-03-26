import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/LoginTemp.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Dashboard from "./styles/pages/Dashboard.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import Expense from "./pages/user/expenses/Expense.jsx";
import Incomse from "./pages/user/imcomes/Incomse.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import ProtectedRoute from "./components/protuctions/ProtectedRoule.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import UserLyout from "./components/user/UserLyout.jsx";
import Account from "./pages/user/accounts/Account.jsx";

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

              <Route element={<ProtectedRoute requiredRoles={["ADMIN"]} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin/*" element={<Dashboard />} />
                </Route>
              </Route>
              <Route element={<ProtectedRoute requiredRoles={["USER"]} />}>
                <Route element={<UserLyout />}>
                  <Route path="/user" element={<UserDashboard />} />
                  <Route path="/user/accounts" element={<Account />} />
                  <Route path="/user/expenses" element={<Expense />} />
                  <Route path="/user/incomes" element={<Incomse />} />
                </Route>
              </Route>
            </Routes>
          </UserProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;