import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';

function App() {

  const originalWarn = console.warn;

  console.warn = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("The width(-1) and height(-1) of chart")
    ) {
      return; // 🚫 ignore this specific warning
    }

    originalWarn(...args); // keep other warnings
  };
  return (
    <AuthProvider>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={
          <PublicRoute><Login /></PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute><Register /></PublicRoute>
        } />

        <Route path="/dashboard" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute><Transactions /></ProtectedRoute>
        } />
        <Route path="/budget" element={
          <ProtectedRoute><Budget /></ProtectedRoute>
        } />

      </Routes>
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </AuthProvider>
  );
}

export default App;