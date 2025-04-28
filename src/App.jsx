import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatentFiling from './pages/PatentFiling';
import UploadDashboard from './pages/UploadDashboard';
import GenerateDocuments from './pages/GenerateDocuments';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PatentFiling />} />
        <Route path="/dashboard/upload" element={<UploadDashboard />} />
        <Route path="/generate-documents" element={<GenerateDocuments />} />
      </Routes>
    </Router>
  );
};

export default App; 