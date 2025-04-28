import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function GenerateDocuments() {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissionData, setSubmissionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('GenerateDocuments mounted');
    console.log('Location state:', location.state);
    
    // Check if we have submission data
    if (location.state?.submissionData) {
      console.log('Found submission data:', location.state.submissionData);
      setSubmissionData(location.state.submissionData);
      setIsLoading(false);
      setError(null);
    } else {
      console.log('No submission data found');
      setError('No submission data found');
      toast.error('No submission data found. Please complete the trademark filing first.');
      // Don't navigate automatically, let the user decide
    }
  }, [location]);

  const handleGenerate = async () => {
    if (!submissionData) {
      console.error('No submission data available');
      toast.error('No submission data available');
      return;
    }

    console.log('Starting document generation for submission:', submissionData);
    setIsGenerating(true);
    setError(null);

    try {
      // Simulate document generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Documents generated successfully');
      toast.success('Documents generated successfully!');
      // Navigate to documents page with the generated documents
      navigate('/dashboard/documents', { 
        state: { 
          submissionData,
          generatedDocuments: true 
        }
      });
    } catch (error) {
      console.error('Document generation error:', error);
      setError(error.message);
      toast.error('Failed to generate documents. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleBack = () => {
    navigate('/trademark-filing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-primary">Loading submission data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Submission</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleBack}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Trademark Filing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-primary">Generate Documents</h1>
          <button
            onClick={handleBack}
            className="px-4 py-2 text-primary hover:text-primary/80 transition-colors"
          >
            Back to Filing
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trademark Application Documents</h2>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">Submission ID: {submissionData.id}</p>
              <p className="text-gray-600">Trademark Name: {submissionData.trademarkName}</p>
              <p className="text-gray-600">Mark Type: {submissionData.markType}</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Available Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                  <h4 className="font-medium mb-2">Trademark Application Form</h4>
                  <p className="text-sm text-gray-600 mb-4">Official USPTO application form with your details</p>
                </div>
                <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                  <h4 className="font-medium mb-2">Declaration of Use</h4>
                  <p className="text-sm text-gray-600 mb-4">Required declaration for use in commerce</p>
                </div>
                <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                  <h4 className="font-medium mb-2">Specimen of Use</h4>
                  <p className="text-sm text-gray-600 mb-4">Documentation showing mark usage</p>
                </div>
                <div className="p-4 border rounded-lg hover:border-primary transition-colors">
                  <h4 className="font-medium mb-2">Power of Attorney</h4>
                  <p className="text-sm text-gray-600 mb-4">If attorney representation is selected</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full px-6 py-3 rounded-lg font-semibold text-white shadow hover:shadow-primary/30 transition-all
                ${isGenerating ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary'}`}
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating Documents...</span>
                </div>
              ) : (
                'Generate All Documents'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GenerateDocuments; 