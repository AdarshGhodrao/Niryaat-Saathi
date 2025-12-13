import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { PendingApproval } from './pages/PendingApproval';
import { Dashboard } from './pages/Dashboard';
import { MarketIntel } from './pages/MarketIntel';
import { CountryRelations } from './pages/CountryRelations';
import { GovtBenefits } from './pages/GovtBenefits';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pending-approval" element={<PendingApproval />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/market-intel"
              element={
                <ProtectedRoute>
                  <Layout>
                    <MarketIntel />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/country-relations"
              element={
                <ProtectedRoute>
                  <Layout>
                    <CountryRelations />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/govt-benefits"
              element={
                <ProtectedRoute>
                  <Layout>
                    <GovtBenefits />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
