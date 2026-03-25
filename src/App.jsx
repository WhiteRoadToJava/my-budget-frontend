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
import AdminLayout from "./components/admin/AdminLayout.jsx";
import UserLyout from "./components/user/UserLyout.jsx";
import AccountsPage from "./pages/user/AccountsPage.jsx";

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
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                </Route>
              </Route>
              
{/* 1. الـ ProtectedRoute لا يحتاج لـ path هنا لأنه مجرد حارس */}
<Route element={<ProtectedRoute requiredRoles={["USER"]} />}>
    
    {/* 2. الـ Layout هو من يأخذ المسار الأساسي /user */}
    <Route path="/user" element={<UserLyout />}>
        
        {/* 3. المسارات الفرعية بدون سلاش في البداية لتكون تابعة لـ /user */}
        <Route path="dashboard" element={<UserDashboard />} />
        <Route path="expenses" element={<Expense />} />
        <Route path="incomes" element={<Incomse />} />
        <Route path="accounts" element={<AccountsPage />} />
        
        {/* 4. الـ index للتوجيه التلقائي */}
        <Route index element={<Navigate to="dashboard" replace />} />
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
