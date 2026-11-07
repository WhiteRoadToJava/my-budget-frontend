import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/auth/LoginTemp.jsx";
import Register from "./pages/auth/Register.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import UserDashboard from "./pages/user/UserDashboard.jsx";
import ProtectedRoute from "./components/routing/ProtectedRoute.jsx";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import AdminUsersPage from "./pages/admin/AdminUsersPage.jsx";
import AdminUserPage from "./pages/admin/AdminUserPage.jsx";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage.jsx";
import AdminAdminsPage from "./pages/admin/AdminAdminsPage.jsx";
import SubscriptionPage from "./pages/user/SubscriptionPage.jsx";
import Account from "./pages/user/accounts/Account.jsx";
import AccountsPage from "./pages/user/AccountsPage.jsx";
import SettingPage from "./pages/user/setting/SettingPage.jsx";
import AllTransactions from "./pages/user/transactions/AllTransactions.jsx";
import SchedulePage from "./pages/user/SchedulePage.jsx";
import CalendarPage from "./pages/user/CalendarPage.jsx";
import ActivateAccount from "./pages/auth/ActivateAccount.jsx";
import UserLayout from "./components/user/UserLayout.jsx";
// initialises i18next (saved language, Arabic for a first visit) before the first render
import "./configuration/i18n.js";
import { useTranslation } from "react-i18next";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import ReportPage from "./pages/user/ReportPage.jsx";
import DebtsPage from "./pages/user/debts/DebtsPage.jsx";
import DebtDetailsPage from "./pages/user/debts/DebtDetailsPage.jsx";





function App() {
  // re-renders the whole app when the language changes; most components call
  // i18n.t() directly and would otherwise keep showing the old language
  useTranslation();

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
              <Route path="/auth/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/auth/activate" element={<ActivateAccount />} />
              <Route path="/auth/reset-password" element={<ResetPassword />} />
              <Route
                path="/auth/forgot-password"
                element={<ForgotPassword />}
              />

              <Route element={<ProtectedRoute requiredRoles={["ADMIN"]} />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminUsersPage />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route path="/admin/users/:userId" element={<AdminUserPage />} />
                  <Route path="/admin/requests" element={<AdminRequestsPage />} />
                  <Route path="/admin/admins" element={<AdminAdminsPage />} />
                  <Route path="/admin/*" element={<Dashboard />} />
                  <Route path="/admin/dashboard" element={<Dashboard />} />
                </Route>
              </Route>
              <Route element={<ProtectedRoute requiredRoles={["USER"]} />}>
                <Route element={<UserLayout />}>
                  <Route path="/user" element={<UserDashboard />} />
                  <Route path="/user/subscription" element={<SubscriptionPage />} />
                  <Route path="/user/accounts" element={<Account />} />

                  <Route
                    path="/user/calendar"
                    element={<CalendarPage />}
                  />
                  <Route
                    path="/user/settings"
                    element={<SettingPage />}
                  />
                  <Route
                    path="/user/accounts/:accountId"
                    element={<AccountsPage />}
                  />
                  <Route 
                  path="/user/transactions"
                  element={<AllTransactions />}
                  />
                  <Route 
                  path="/user/schedule"
                  element={<SchedulePage />}
                  />
                  <Route 
                  path="/user/accounts/search"
                  element={<ReportPage /> }
                  />
                  <Route path="/user/debts" element={<DebtsPage />} />
                  <Route path="/user/debts/:debtId" element={<DebtDetailsPage />} />
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