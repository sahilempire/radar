import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProgressSidebar from './ProgressSidebar';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  const steps = [
    { path: '/dashboard/trademark', title: 'Trademark Filing', progress: 20 },
    { path: '/dashboard/generate-documents', title: 'Generate Documents', progress: 40 },
    { path: '/dashboard/documents', title: 'Documents', progress: 60 },
    { path: '/dashboard/compliance-check', title: 'Compliance Check', progress: 80 },
    { path: '/dashboard/filing-prep', title: 'Filing Preparation', progress: 100 }
  ];

  console.log('Progress:', progress);

  const getCurrentProgress = () => {
    console.log('Calculating progress for path:', location.pathname);
    
    // Normalize the path to handle both exact matches and nested routes
    const normalizedPath = location.pathname.split('/').slice(0, 3).join('/');
    console.log('Normalized path:', normalizedPath);

    // Find the current step
    const currentStep = steps.find(step => 
      normalizedPath === step.path || 
      location.pathname.startsWith(step.path + '/')
    );

    console.log('Current step found:', currentStep);
    
    if (currentStep) {
      console.log('Setting progress to:', currentStep.progress);
      return currentStep.progress;
    }

    // If no step matches, return 0
    console.log('No matching step found, returning 0');
    return 0;
  };

  useEffect(() => {
    const newProgress = getCurrentProgress();
    console.log('Progress updated to:', newProgress);
    setProgress(newProgress);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 flex-shrink-0">
        <ProgressSidebar progress={progress} />
      </div>
      <main className="w-full p-10">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 