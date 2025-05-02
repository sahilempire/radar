import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { 
  Landing, 
  SignIn, 
  SignUp, 
  Dashboard, 
  TrademarkFiling, 
  PatentFiling, 
  PatentGenerateDocuments,
  PatentDocuments,
  PatentCompliance,
  PatentFilingPreparation,
  PatentConfirmation,
  CopyrightFiling, 
  GenerateDocuments, 
  Documents, 
  UploadDocuments,
  ComplianceChecker,
  FilingPrep
} from './pages';
import MainLayout from './components/MainLayout';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ResponsibleAI from './pages/ResponsibleAI';
import PatentUploadDocuments from './pages/PatentUploadDocuments';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Legal Pages */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/responsible-ai" element={<ResponsibleAI />} />
        
        {/* Trademark Routes */}
        <Route path="/dashboard/trademark" element={
          <MainLayout>
            <TrademarkFiling />
          </MainLayout>
        } />
        
        {/* Patent Routes */}
        <Route path="/dashboard/patent" element={
          <MainLayout>
            <PatentFiling />
          </MainLayout>
        } />
        <Route path="/dashboard/patent/generate-documents" element={
          <MainLayout>
            <PatentGenerateDocuments />
          </MainLayout>
        } />
        <Route path="/dashboard/patent/documents" element={
          <MainLayout>
            <PatentDocuments />
          </MainLayout>
        } />
        <Route path="/dashboard/patent/documents/:id/upload" element={
          <MainLayout>
            <PatentUploadDocuments />
          </MainLayout>
        } />
        <Route path="/dashboard/patent/documents/upload" element={
          <MainLayout>
            <PatentUploadDocuments />
          </MainLayout>
        } />
        <Route path="/dashboard/patent/compliance" element={
          <MainLayout>
            <PatentCompliance />
          </MainLayout>
        } />
        <Route path="/dashboard/patent/filing" element={
          <MainLayout>
            <PatentFilingPreparation />
          </MainLayout>
        } />
        <Route path="/dashboard/patent/confirmation" element={
          <MainLayout>
            <PatentConfirmation />
          </MainLayout>
        } />
        
        {/* Copyright Routes */}
        <Route path="/dashboard/copyright" element={
          <MainLayout>
            <CopyrightFiling />
          </MainLayout>
        } />
        
        {/* Legacy Routes */}
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
