import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import AddFunds from './pages/AddFunds';
import WithdrawFunds from './pages/WithdrawFunds';
import InvestmentPlans from './pages/InvestmentPlans';
import Profile from './pages/Profile';
import Referrals from './pages/Referrals';
import Goals from './pages/Goals';
import Transactions from './pages/Transactions';
import Support from './pages/Support';
import Security from './pages/Security';
import About from './pages/About';
import Contact from './pages/Contact';
import Service from './pages/Service';
import Project from './pages/Project';
import DepositQR from './pages/DepositQR';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/wallet" 
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-funds" 
          element={
            <ProtectedRoute>
              <AddFunds />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/withdraw-funds" 
          element={
            <ProtectedRoute>
              <WithdrawFunds />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/investment-plans" 
          element={
            <ProtectedRoute>
              <InvestmentPlans />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/referrals" 
          element={
            <ProtectedRoute>
              <Referrals />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/goals" 
          element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/support" 
          element={
            <ProtectedRoute>
              <Support />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/security" 
          element={
            <ProtectedRoute>
              <Security />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/deposit-qr" 
          element={
            <ProtectedRoute>
              <DepositQR />
            </ProtectedRoute>
          } 
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/service" element={<Service />} />
        <Route path="/project" element={<Project />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
