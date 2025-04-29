import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Landing, 
  SignIn, 
  SignUp, 
  Dashboard, 
  TrademarkFiling, 
  PatentFiling, 
  CopyrightFiling, 
  GenerateDocuments, 
  Documents, 
  UploadDocuments,
  ComplianceChecker,
  FilingPrep
} from './pages';
import MainLayout from './components/MainLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Routes with ProgressSidebar */}
        <Route path="/dashboard/trademark" element={
          <MainLayout>
            <TrademarkFiling />
          </MainLayout>
        } />
        <Route path="/dashboard/patent" element={
          <MainLayout>
            <PatentFiling />
          </MainLayout>
        } />
        <Route path="/dashboard/copyright" element={
          <MainLayout>
            <CopyrightFiling />
          </MainLayout>
        } />
        <Route path="/dashboard/generate-documents" element={
          <MainLayout>
            <GenerateDocuments />
          </MainLayout>
        } />
        <Route path="/dashboard/documents/:filingId" element={
          <MainLayout>
            <Documents />
          </MainLayout>
        } />
        <Route path="/dashboard/documents/:filingId/upload" element={
          <MainLayout>
            <UploadDocuments />
          </MainLayout>
        } />
        <Route path="/dashboard/compliance/:filingId" element={
          <MainLayout>
            <ComplianceChecker />
          </MainLayout>
        } />
        <Route path="/dashboard/filing-prep/:filingId" element={
          <MainLayout>
            <FilingPrep />
          </MainLayout>
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
