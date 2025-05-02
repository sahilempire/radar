import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProgressSidebar from './ProgressSidebar';
import { MinimalFooter } from './Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);

  const steps = [
    { path: '/dashboard/trademark', title: 'Trademark Filing', progress: 20 },
    { path: '/dashboard/generate-documents', title: 'Generate Documents', progress: 40 },
    { path: '/dashboard/documents', title: 'Documents', progress: 60 },
    { path: '/dashboard/compliance', title: 'Compliance Check', progress: 80 },
    { path: '/dashboard/filing-prep', title: 'Filing Preparation', progress: 100 }
  ];

  console.log('Progress:', progress);

  const getCurrentProgress = () => {
    console.log('Calculating progress for path:', location.pathname);
    
    // Get the appropriate steps based on the path
    const steps = location.pathname.includes('/patent') ? [
      { path: '/dashboard/patent', title: 'Patent Filing', progress: 20 },
      { path: '/dashboard/patent/generate-documents', title: 'Generate Documents', progress: 40 },
      { path: '/dashboard/patent/documents', title: 'Documents', progress: 60 },
      { path: '/dashboard/patent/compliance', title: 'Compliance Check', progress: 80 },
      { path: '/dashboard/patent/filing', title: 'Filing Preparation', progress: 100 }
    ] : [
      { path: '/dashboard/trademark', title: 'Trademark Filing', progress: 20 },
      { path: '/dashboard/generate-documents', title: 'Generate Documents', progress: 40 },
      { path: '/dashboard/documents', title: 'Documents', progress: 60 },
      { path: '/dashboard/compliance', title: 'Compliance Check', progress: 80 },
      { path: '/dashboard/filing-prep', title: 'Filing Preparation', progress: 100 }
    ];

    // Find the current step by checking for exact match or matching path
    const currentStep = steps.find(step => {
      const isExactMatch = location.pathname === step.path;
      // Check if the step path matches the current path
      const isPathMatch = step.path === location.pathname || 
                         location.pathname.startsWith(step.path + '/');
      console.log(`Checking step ${step.path} against current path ${location.pathname}: exact=${isExactMatch}, match=${isPathMatch}`);
      return isPathMatch;
    });

    // Find the step with the longest matching path
    const matchingSteps = steps.filter(step => 
      location.pathname === step.path || location.pathname.startsWith(step.path + '/')
    );
    const bestMatch = matchingSteps.reduce((best, current) => 
      (best?.path.length > current.path.length) ? best : current, 
      null
    );

    console.log('Best matching step found:', bestMatch);
    
    if (bestMatch) {
      console.log('Setting progress to:', bestMatch.progress);
      return bestMatch.progress;
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div className="w-64 flex-shrink-0">
          <ProgressSidebar progress={progress} />
        </div>
        <main className="w-full p-10">
          {children}
        </main>
      </div>
      <MinimalFooter />
    </div>
  );
};

export default MainLayout; 