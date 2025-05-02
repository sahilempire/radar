import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const steps = [
  {
    id: 'patent-filing',
    title: 'Patent Filing',
    description: 'Complete the patent application details',
    path: '/dashboard/patent',
    progress: 20
  },
  {
    id: 'generate-documents',
    title: 'Generate Documents',
    description: 'Review and generate patent documents',
    path: '/dashboard/patent/generate-documents',
    progress: 40
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Manage your patent documents',
    path: '/dashboard/patent/documents',
    progress: 60
  },
  {
    id: 'compliance',
    title: 'Compliance Check',
    description: 'Verify compliance with patent offices',
    path: '/dashboard/patent/compliance',
    progress: 80
  },
  {
    id: 'filing-prep',
    title: 'Filing Preparation',
    description: 'Final review before patent submission',
    path: '/dashboard/patent/filing-prep',
    progress: 100
  }
];

const PatentProgressSidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Calculate progress based on current step
  const getCurrentProgress = () => {
    const normalizedPath = currentPath.replace(/\/+$/, '');
    
    const currentStep = steps.find(step => {
      const normalizedStepPath = step.path.replace(/\/+$/, '');
      return normalizedPath.startsWith(normalizedStepPath);
    });
    
    return currentStep ? currentStep.progress : 0;
  };

  const getStepStatus = (step, index) => {
    const normalizedPath = currentPath.replace(/\/+$/, '');
    
    const currentStepIndex = steps.findIndex(s => {
      const normalizedStepPath = s.path.replace(/\/+$/, '');
      return normalizedPath.startsWith(normalizedStepPath);
    });
    
    if (index < currentStepIndex) {
      return 'completed';
    }
    if (index === currentStepIndex) {
      return 'active';
    }
    return 'pending';
  };

  const progress = getCurrentProgress();

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-black">Filing Progress</h2>
          <p className="text-sm text-gray-600">Track your patent application progress</p>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-gray-600 mb-2">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-[#F1E8E2] h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
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
                    isCompleted ? 'bg-[#F1E8E2]' : 'bg-gray-200'
                  }`} style={{ marginTop: '-24px' }} />
                )}

                <Link 
                  to={step.path}
                  className="block"
                >
                  <div className="flex items-start gap-3">
                    {/* Step indicator */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center relative z-10 ${
                      isCompleted 
                        ? 'bg-[#F1E8E2] text-white' 
                        : isActive 
                          ? 'bg-[#F1E8E2]/10 text-[#F1E8E2] border-2 border-[#F1E8E2]' 
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
                        isActive ? 'text-[#F1E8E2]' : isCompleted ? 'text-black' : 'text-gray-500'
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-gray-600">{step.description}</p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PatentProgressSidebar; 