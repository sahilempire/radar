import React from 'react';
import PatentProgressSidebar from './PatentProgressSidebar';

const PatentLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <PatentProgressSidebar />
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
};

export default PatentLayout; 