import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { Layout } from './components/common/Layout';
import { AuthPage } from './pages/auth/AuthPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { EquipmentListPage } from './pages/equipments/EquipmentListPage';
import { NFCPage } from './pages/nfc/NFCPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<AuthPage />} />

          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/equipments"
            element={
              <ProtectedRoute>
                <Layout>
                  <EquipmentListPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/nfc"
            element={
              <ProtectedRoute>
                <Layout>
                  <NFCPage />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Redirection par défaut */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Route 404 */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600">Page non trouvée</p>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
