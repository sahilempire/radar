import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import PatentLayout from './components/PatentLayout';
import TrademarkFiling from './pages/TrademarkFiling';
import PatentFiling from './pages/PatentFiling';
import Documents from './pages/Documents';
import UploadDocuments from './pages/UploadDocuments';
import ComplianceChecker from './pages/ComplianceChecker';
import PreFiling from './pages/PreFiling';
import Dashboard from './pages/Dashboard';
import GenerateDocuments from './pages/GenerateDocuments';
import Landing from './pages/Landing';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ResponsibleAI from './pages/ResponsibleAI';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/responsible-ai" element={<ResponsibleAI />} />
        
        {/* Authentication Routes */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Trademark Routes */}
        <Route path="/dashboard/trademark" element={
          <MainLayout>
            <TrademarkFiling />
          </MainLayout>
        } />
        
        {/* Patent Routes */}
        <Route path="/dashboard/patent" element={
          <PatentLayout>
            <PatentFiling />
          </PatentLayout>
        } />
        
        <Route path="/dashboard/patent/generate-documents" element={
          <PatentLayout>
            <GenerateDocuments />
          </PatentLayout>
        } />
        
        <Route path="/dashboard/patent/documents/:filingId" element={
          <PatentLayout>
            <Documents />
          </PatentLayout>
        } />
        
        <Route path="/dashboard/patent/documents/:filingId/upload" element={
          <PatentLayout>
            <UploadDocuments />
          </PatentLayout>
        } />
        
        <Route path="/dashboard/patent/compliance/:filingId" element={
          <PatentLayout>
            <ComplianceChecker />
          </PatentLayout>
        } />
        
        <Route path="/dashboard/patent/filing-prep/:filingId" element={
          <PatentLayout>
            <PreFiling />
          </PatentLayout>
        } />
        
        {/* Trademark Document Routes */}
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

        {/* Trademark Compliance Route */}
        <Route path="/dashboard/compliance/:filingId" element={
          <MainLayout>
            <ComplianceChecker />
          </MainLayout>
        } />

        {/* Trademark Filing Prep Route */}
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