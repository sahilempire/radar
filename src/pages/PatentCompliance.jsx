import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';
import { checkPatentCompliance } from '../services/patentComplianceService';

const PatentCompliance = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complianceResults, setComplianceResults] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [documents, setDocuments] = useState(null);

  useEffect(() => {
    try {
      // First try to get data from location state
      if (location.state?.submissionData && location.state?.documents) {
        setSubmissionData(location.state.submissionData);
        setDocuments(location.state.documents);
        // Also save to localStorage for persistence
        localStorage.setItem('patentSubmissionData', JSON.stringify(location.state.submissionData));
        localStorage.setItem('patentGeneratedDocuments', JSON.stringify(location.state.documents));
      } else {
        // If no location state, try localStorage
        const storedData = JSON.parse(localStorage.getItem('patentSubmissionData'));
        const storedDocuments = JSON.parse(localStorage.getItem('patentGeneratedDocuments'));
        
        if (storedData && storedDocuments) {
          setSubmissionData(storedData);
          setDocuments(storedDocuments);
        } else {
          setError('No patent submission data found. Please complete the patent filing first.');
        }
      }
    } catch (error) {
      console.error('Error loading patent data:', error);
      setError('Failed to load patent data. Please try again.');
    }
  }, [location.state]);

  const handleRunComplianceCheck = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the latest data from localStorage
      const storedData = JSON.parse(localStorage.getItem('patentSubmissionData'));
      if (!storedData) {
        throw new Error('No patent submission data found');
      }
      
      const result = await checkPatentCompliance(storedData.id);
      setComplianceResults(result);
    } catch (error) {
      console.error('Error checking compliance:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'met':
        return 'text-green-600';
      case 'missing':
        return 'text-red-600';
      case 'partial':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'met':
        return '✓ Met';
      case 'missing':
        return '✗ Missing';
      case 'partial':
        return '~ Partial';
      default:
        return status;
    }
  };

  const getRatingText = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  const getRatingColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-primary';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleContinue = () => {
    navigate('/dashboard/patent/filing', { 
      state: { 
        submissionData,
        documents,
        complianceResults 
      } 
    });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard/patent')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Patent Filing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-[#0080ff] transition-colors rounded-[25%] hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <IoArrowBack className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-primary">Patent Compliance Checker</h1>
          </div>
          <p className="text-gray-600 mt-2">Verify your patent application against USPTO filing requirements</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          {!complianceResults ? (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Check Patent Compliance</h2>
                <p className="text-gray-600 max-w-2xl text-lg">Our AI will analyze your patent application against USPTO requirements</p>
              </div>
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-28 h-32 rounded-full mb-4">
                  <svg className="w-14 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Ready to check compliance of your patent application</h3>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-8 mb-10">
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-lg">Validates required fields and documents</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-lg">Checks against USPTO requirements</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-lg">Identifies potential issues before filing</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </div>
                    <p className="text-gray-700 text-lg">Provides guidance on missing information</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleRunComplianceCheck}
                  disabled={isLoading}
                  className={`px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center space-x-2 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running Compliance Check...
                    </div>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Run Compliance Check</span>
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div className="space-y-8">
              <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Overall Compliance Score</h2>
                    <div className="flex flex-col items-center text-center">
                      <div className="relative w-32 h-32 mb-4">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="3"
                            strokeDasharray={`${complianceResults.overallCompliance}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">{complianceResults.overallCompliance}%</span>
                        </div>
                      </div>
                      <h3 className={`text-xl font-semibold text-gray-900 mb-2 ${getRatingColor(complianceResults.overallCompliance)}`}>
                        {getRatingText(complianceResults.overallCompliance)}
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        {complianceResults.overallCompliance >= 80 
                          ? 'Your application meets most requirements for filing.'
                          : 'Your application needs improvements for approval.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="space-y-4">
                  {complianceResults.requirements.map((req) => (
                    <div key={req.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                      <div className={`flex-shrink-0 mt-1 ${getStatusColor(req.status)}`}>
                        {getStatusText(req.status)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{req.name}</h4>
                        <p className="text-gray-600 text-sm">{req.details}</p>
                        {req.status === 'missing' && (
                          <div className="mt-2 text-sm text-red-600">
                            <span className="font-medium">Action Required:</span> {req.recommendation}
                          </div>
                        )}
                        {req.status === 'partial' && (
                          <div className="mt-2 text-sm text-yellow-600">
                            <span className="font-medium">Recommendation:</span> {req.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-8 space-x-4">
                <button
                  onClick={handleRunComplianceCheck}
                  disabled={isLoading}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                    isLoading
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-50 text-primary hover:bg-blue-100'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Rechecking...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Recheck Compliance</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleContinue}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  <span>Continue to Filing Prep</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatentCompliance; 