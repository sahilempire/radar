import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import TrademarkFiling from './pages/TrademarkFiling';
import Documents from './pages/Documents';
import UploadDocuments from './pages/UploadDocuments';
import ComplianceChecker from './pages/ComplianceChecker';
import PreFiling from './pages/PreFiling';
import Dashboard from './pages/Dashboard';
import GenerateDocuments from './pages/GenerateDocuments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Trademark Routes */}
        <Route path="/dashboard/trademark" element={
          <MainLayout>
            <TrademarkFiling />
          </MainLayout>
        } />
        
        {/* Generate Documents Route */}
        <Route path="/dashboard/generate-documents" element={
          <MainLayout>
            <GenerateDocuments />
          </MainLayout>
        } />
        
        {/* Documents Routes */}
        <Route path="/dashboard/documents">
          <Route path=":filingId" element={
            <MainLayout>
              <Documents />
            </MainLayout>
          } />
          <Route path=":filingId/upload" element={
            <MainLayout>
              <UploadDocuments />
            </MainLayout>
          } />
        </Route>

        {/* Compliance Route */}
        <Route path="/dashboard/compliance/:filingId" element={
          <MainLayout>
            <ComplianceChecker />
          </MainLayout>
        } />

        {/* Filing Prep Route */}
        <Route path="/dashboard/filing-prep/:filingId" element={
          <MainLayout>
            <PreFiling />
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App; 