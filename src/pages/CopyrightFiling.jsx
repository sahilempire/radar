import React from 'react';
import FilingForm from '../components/FilingForm';

const CopyrightFiling = () => {
  return (
    <div className="min-h-screen bg-background text-light px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Copyright Filing</h1>
        <FilingForm type="copyright" onClose={() => window.history.back()} />
      </div>
    </div>
  );
};

export default CopyrightFiling; 