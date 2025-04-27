import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import TrademarkFiling from './pages/TrademarkFiling';
import PatentFiling from './pages/PatentFiling';
import CopyrightFiling from './pages/CopyrightFiling';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/trademark" element={<TrademarkFiling />} />
        <Route path="/dashboard/patent" element={<PatentFiling />} />
        <Route path="/dashboard/copyright" element={<CopyrightFiling />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
