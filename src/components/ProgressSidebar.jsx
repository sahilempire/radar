import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const steps = [
  {
    id: 'trademark',
    title: 'Trademark Filing',
    description: 'Complete the trademark application form',
    path: '/dashboard/trademark',
    progress: 20
  },
  {
    id: 'generate-documents',
    title: 'Generate Documents',
    description: 'Review and generate filing documents',
    path: '/dashboard/generate-documents',
    progress: 40
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Manage your documents',
    path: '/dashboard/documents',
    progress: 60
  },
  {
    id: 'compliance',
    title: 'Compliance Check',
    description: 'Verify compliance with IP offices',
    path: '/dashboard/compliance',
    progress: 80
  },
  {
    id: 'filing-prep',
    title: 'Filing Preparation',
    description: 'Final review before submission',
    path: '/dashboard/filing-prep',
    progress: 100
  }
];

const ProgressSidebar = ({ progress }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Calculate progress based on current step
  const getCurrentProgress = () => {
    // Normalize the current path
    const normalizedPath = currentPath.replace(/\/+$/, '');
    
    console.log('Debug - Current Path:', currentPath);
    console.log('Debug - Normalized Path:', normalizedPath);
    
    const currentStep = steps.find(step => {
      // Normalize the step path
      const normalizedStepPath = step.path.replace(/\/+$/, '');
      
      console.log('Debug - Checking Step:', step.id);
      console.log('Debug - Step Path:', step.path);
      console.log('Debug - Normalized Step Path:', normalizedStepPath);
      
      const matches = normalizedPath === normalizedStepPath || 
             normalizedPath.startsWith(normalizedStepPath + '/') ||
             (step.id === 'documents' && normalizedPath.includes('/dashboard/documents/')) ||
             (step.id === 'compliance' && (normalizedPath.includes('/dashboard/compliance/') || normalizedPath === '/dashboard/compliance'));
      
      console.log('Debug - Matches:', matches);
      
      return matches;
    });

    console.log('Debug - Found Step:', currentStep);
    console.log('Debug - Progress:', currentStep ? currentStep.progress : 0);
    
    return currentStep ? currentStep.progress : 0;
  };

  // Use calculated progress if no progress prop is provided
  const safeProgress = progress !== undefined ? Math.min(Math.max(Number(progress) || 0, 0), 100) : getCurrentProgress();

  console.log('Debug - Final Progress:', safeProgress);

  // Debug progress updates
  useEffect(() => {
    console.log('ProgressSidebar received new progress:', safeProgress);
  }, [safeProgress]);

  const getStepStatus = (step, index) => {
    // Normalize the current path
    const normalizedPath = currentPath.replace(/\/+$/, '');
    
    const currentStepIndex = steps.findIndex(s => {
      // Normalize the step path
      const normalizedStepPath = s.path.replace(/\/+$/, '');
      
      return normalizedPath === normalizedStepPath || 
             normalizedPath.startsWith(normalizedStepPath + '/') ||
             (s.id === 'documents' && normalizedPath.includes('/dashboard/documents/')) ||
             (s.id === 'compliance' && (normalizedPath.includes('/dashboard/compliance/') || normalizedPath === '/dashboard/compliance'));
    });
    
    console.log('Current Step Index:', currentStepIndex);
    
    if (index < currentStepIndex) {
      return 'completed';
    }
    if (index === currentStepIndex) {
      return 'active';
    }
    return 'pending';
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black">Filing Progress</h2>
          <p className="text-sm text-gray-600">Track your trademark application progress</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{safeProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#0080ff] h-2 rounded-full transition-all duration-500"
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => {
            const status = getStepStatus(step, index);
            const isCompleted = status === 'completed';
            const isActive = status === 'active';

            return (
              <div key={step.id} className="relative">
                {/* Connector line */}
                {index > 0 && (
                  <div className={`absolute left-4 top-0 w-0.5 h-6 ${
                    isCompleted ? 'bg-[#0080ff]' : 'bg-gray-200'
                  }`} />
                )}

                <div className="flex items-start gap-3">
                  {/* Step indicator */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-[#0080ff] text-white' 
                      : isActive 
                        ? 'bg-[#0080ff]/10 text-[#0080ff] border-2 border-[#0080ff]' 
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>

                  {/* Step content */}
                  <div className="flex-1">
                    <h3 className={`text-sm font-medium ${
                      isActive ? 'text-[#0080ff]' : isCompleted ? 'text-black' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressSidebar; 