import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFiling, getSupportingFiles } from "../services";
import { checkCompliance } from "../services/complianceService";
import { IoArrowBack } from 'react-icons/io5';

function ComplianceChecker() {
  const { filingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complianceResults, setComplianceResults] = useState(null);
  const [activeTab, setActiveTab] = useState('USPTO');

  const handleRunComplianceCheck = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await checkCompliance(filingId);
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
            <h1 className="text-2xl font-bold text-primary">Compliance Checker</h1>
          </div>
          <p className="text-gray-600 mt-2">Verify your trademark application against official filing requirements</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          {!complianceResults ? (
            <>
              <div className="mb-10">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Check Filing Compliance</h2>
                <p className="text-gray-600 max-w-2xl text-lg">Our AI will analyze your application against requirements for USPTO, EUIPO, and Indian IP offices</p>
              </div>
              
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-28 h-32 rounded-full mb-4">
                  <svg className="w-14 h-16 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Ready to check compliance of your trademark application</h3>
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
                    <p className="text-gray-700 text-lg">Checks against requirements for multiple jurisdictions</p>
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
                          {/* Background circle */}
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          {/* Progress circle */}
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#EF4444"
                            strokeWidth="3"
                            strokeDasharray="3.5, 100"
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">3.5%</span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Needs Improvement</h3>
                      <p className="text-gray-600 max-w-md">
                        Your application needs significant improvements for approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <nav className="flex justify-center" aria-label="Tabs">
                  <div className="flex justify-between w-full bg-gray-100 p-1 rounded-lg">
                    {Object.keys(complianceResults.jurisdictions).map((jurisdiction) => (
                      <button
                        key={jurisdiction}
                        onClick={() => setActiveTab(jurisdiction)}
                        className={`group flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                          activeTab === jurisdiction
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <svg 
                          className={`w-5 h-5 transition-colors duration-200 ${
                            activeTab === jurisdiction ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        <span>{jurisdiction}</span>
                      </button>
                    ))}
                  </div>
                </nav>
              </div>

              {Object.entries(complianceResults.jurisdictions).map(([jurisdiction, data]) => (
                <div 
                  key={jurisdiction}
                  className={`${activeTab === jurisdiction ? 'block' : 'hidden'}`}
                >
                  <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                    <div className="space-y-4">
                      {data.requirements.map((req, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                          <div className={`flex-shrink-0 mt-1 ${getStatusColor(req.status)}`}>
                            {getStatusText(req.status)}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{req.requirement}</h4>
                            <p className="text-gray-600 text-sm">{req.details}</p>
                            {req.status === 'missing' && (
                              <div className="mt-2 text-sm text-red-600">
                                <span className="font-medium">Action Required:</span> Please provide this information to complete your application.
                              </div>
                            )}
                            {req.status === 'partial' && (
                              <div className="mt-2 text-sm text-yellow-600">
                                <span className="font-medium">Recommendation:</span> Consider providing more detailed information.
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

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
                  onClick={() => navigate(`/dashboard/filing-prep/${filingId}`)}
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
}

export default ComplianceChecker;
