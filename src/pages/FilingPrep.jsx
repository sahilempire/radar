import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFilingPrepAnalysis } from '../services/filingService';
import { IoArrowBack } from 'react-icons/io5';

function FilingPrep() {
  const { filingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('checklist');

  // Calculate dates based on current date
  const currentDate = new Date();
  
  // Use current date if no specific date is provided
  const filingDate = currentDate;
  
  // Format date as MM/DD/YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleAIAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getFilingPrepAnalysis(filingId);
      setAnalysis(result);
    } catch (error) {
      console.error('Error getting filing preparation analysis:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-[#C67B49] transition-colors rounded-[25%] hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <IoArrowBack className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-primary">Filing Preparation</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <nav className="flex justify-center" aria-label="Tabs">
            <div className="flex justify-between w-full bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('checklist')}
                className={`group flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'checklist'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    activeTab === 'checklist' ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <span>Filing Checklist</span>
              </button>
              <button
                onClick={() => setActiveTab('analysis')}
                className={`group flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-md font-medium text-sm transition-all duration-200 ${
                  activeTab === 'analysis'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <svg 
                  className={`w-5 h-5 transition-colors duration-200 ${
                    activeTab === 'analysis' ? 'text-primary' : 'text-gray-500 group-hover:text-gray-700'
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>AI Analysis</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'checklist' && (
            <>
              {/* Filing Checklist */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Filing Checklist</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Trademark Application</h3>
                      <p className="text-sm text-gray-600">Basic application details and requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Supporting Documents</h3>
                      <p className="text-sm text-gray-600">All required documents uploaded</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Compliance Check</h3>
                      <p className="text-sm text-gray-600">Verified against jurisdiction requirements</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filing Calendar */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Filing Calendar</h2>
                <p className="text-gray-600 mb-6">Important dates for your trademark application</p>
                <div className="space-y-6">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Estimated Filing Date</h3>
                    <p className="text-sm text-gray-600 mb-2">When your application will be submitted</p>
                    <p className="text-primary font-medium text-lg">{formatDate(filingDate)}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Estimated First Office Action</h3>
                    <p className="text-sm text-gray-600 mb-2">Initial review by the patent office</p>
                    <p className="text-primary font-medium text-lg">3-4 months</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Estimated Registration Time</h3>
                    <p className="text-sm text-gray-600 mb-2">Total time for application approval</p>
                    <p className="text-primary font-medium text-lg">9-12 months</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analysis' && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">AI Analysis</h2>
              <p className="text-gray-600 mb-6">Get AI-powered insights about your trademark application</p>

              {!analysis && (
                <div className="text-center py-8">
                  <button
                    onClick={handleAIAnalysis}
                    disabled={isLoading}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                      isLoading
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-primary text-white hover:bg-primary/90'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Analyzing...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>Run AI Analysis</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg text-center">
                  {error}
                </div>
              )}

              {analysis && (
                <div className="space-y-8">
                  {/* Approval Status */}
                  <div className="p-6 bg-white border border-gray-200 rounded-lg">
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
                            stroke={analysis.overview.approvalPercentage >= 80 ? '#10B981' : 
                                   analysis.overview.approvalPercentage >= 60 ? '#F59E0B' : '#EF4444'}
                            strokeWidth="3"
                            strokeDasharray={`${analysis.overview.approvalPercentage}, 100`}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-2xl font-bold">
                            {analysis.overview.approvalPercentage}%
                          </span>
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {analysis.overview.approvalPercentage >= 80 ? 'Good' : 
                         analysis.overview.approvalPercentage >= 60 ? 'Moderate' : 'Needs Improvement'}
                      </h3>
                      <p className="text-gray-600 max-w-md">
                        {analysis.overview.approvalPercentage >= 80 ? 
                          'Your application shows strong potential for approval.' :
                         analysis.overview.approvalPercentage >= 60 ?
                          'Your application has moderate chances of approval with some improvements needed.' :
                          'Your application needs significant improvements for approval.'}
                      </p>
                    </div>
                  </div>

                  {/* Overview Section */}
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Overview</h3>
                    <p className="text-gray-600 mb-4">{analysis.overview.summary}</p>
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-900">Next Steps</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {analysis.overview.nextSteps.map((step, index) => (
                          <li key={index}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Application Review Section */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Application Review</h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                          <li>The trademark name 'ampersand' is distinctive and has a clear brand identity</li>
                          <li>The business description of 'micro SaaS products' provides a clear and focused scope for the trademark</li>
                          <li>The applicant has filed the application based on an intent to use, indicating a plan to use the mark in commerce</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Areas for Improvement</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-2">
                          <li>The application currently lacks a specimen of use, as the mark is not yet in use in commerce</li>
                          <li>The business description could potentially be expanded to further clarify the specific goods and services offered</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Document Analysis Section */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Analysis</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
                        <ul className="list-disc list-inside text-gray-600">
                          {analysis.documentAnalysis.requiredDocuments.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                      {analysis.documentAnalysis.missingDocuments.length > 0 && (
                        <div>
                          <h4 className="font-medium pt-3 text-red-600 mb-2">Missing Documents</h4>
                          <ul className="list-disc list-inside text-gray-600">
                            {analysis.documentAnalysis.missingDocuments.map((doc, index) => (
                              <li key={index}>{doc}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Filing Strategy Section */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing Strategy</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Recommended Jurisdiction Order</h4>
                        <ul className="list-decimal list-inside text-gray-600">
                          {analysis.filingStrategy.jurisdictionOrder.map((jurisdiction, index) => (
                            <li key={index}>{jurisdiction}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Filing Date</p>
                            <p className="font-medium text-gray-900">{analysis.filingStrategy.timeline.filingDate}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">First Office Action</p>
                            <p className="font-medium text-gray-900">{analysis.filingStrategy.timeline.firstOfficeAction}</p>
                          </div>
                          <div className="p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">Estimated Registration</p>
                            <p className="font-medium text-gray-900">{analysis.filingStrategy.timeline.estimatedRegistration}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div className="p-4 bg-white border border-gray-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
                    <div className="space-y-4">
                      {analysis.recommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900">{rec.title}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                              rec.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {rec.priority} priority
                            </span>
                          </div>
                          <p className="mt-2 text-gray-600">{rec.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rerun Analysis Button */}
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={handleAIAnalysis}
                      disabled={isLoading}
                      className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors duration-200 ${
                        isLoading
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary/90'
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Re-running Analysis...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                          </svg>
                          <span>Re-run AI Analysis</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FilingPrep; 