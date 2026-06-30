import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute'; // Import this
import { AuthProvider } from './context/AuthContext';
import Expenses from './pages/Expenses';
import AiChat from './pages/AiChat';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Redirect "/" to "/login" */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/expenses" 
            element={
              <ProtectedRoute>
                <Expenses />
              </ProtectedRoute>
            } />

            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <AiChat />
                </ProtectedRoute>
              }
            />


        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;