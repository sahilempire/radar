import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';
import { getPatentFilingPrepAnalysis } from '../services/patentFilingService';

const PatentFilingPreparation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState('checklist');
  const [submissionData, setSubmissionData] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [complianceChecks, setComplianceChecks] = useState([]);

  // Calculate dates based on current date
  const currentDate = new Date();
  
  // Format date as MM/DD/YYYY
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  useEffect(() => {
    try {
      // First try to get data from location state
      if (location.state?.submissionData && location.state?.documents && location.state?.complianceChecks) {
        setSubmissionData(location.state.submissionData);
        setDocuments(location.state.documents);
        setComplianceChecks(location.state.complianceChecks);
        handleAIAnalysis();
      } else {
        // If no location state, try localStorage
        const storedData = JSON.parse(localStorage.getItem('patentSubmissionData'));
        const storedDocuments = JSON.parse(localStorage.getItem('patentGeneratedDocuments'));
        
        if (storedData && storedDocuments) {
          setSubmissionData(storedData);
          setDocuments(storedDocuments);
          handleAIAnalysis();
        } else {
          setError('No patent submission data found. Please complete the patent filing first.');
        }
      }
    } catch (error) {
      console.error('Error loading patent data:', error);
      setError('Failed to load patent data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [location.state]);

  const handleAIAnalysis = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await getPatentFilingPrepAnalysis();
      setAnalysis(result);
    } catch (error) {
      console.error('Error getting filing preparation analysis:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-primary">Loading analysis...</p>
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
          <h2 className="text-xl font-semibold mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard/patent')}
            className="px-6 py-2 bg-[#C67B49] text-white rounded-lg hover:bg-[#C67B49]/90 transition-colors"
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
              className="p-2 text-gray-600 hover:text-[#C67B49] transition-colors rounded-[25%] hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <IoArrowBack className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-primary">Patent Filing Preparation</h1>
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
                      <h3 className="font-medium text-gray-900">Patent Application</h3>
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
                      <h3 className="font-medium text-gray-900">Patent Documents</h3>
                      <p className="text-sm text-gray-600">All required documents generated</p>
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
                      <p className="text-sm text-gray-600">Verified against USPTO requirements</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filing Calendar */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Filing Calendar</h2>
                <p className="text-gray-600 mb-6">Important dates for your patent application</p>
                <div className="space-y-6">
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Estimated Filing Date</h3>
                    <p className="text-sm text-gray-600 mb-2">When your application will be submitted</p>
                    <p className="text-primary font-medium text-lg">{formatDate(currentDate)}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Estimated First Office Action</h3>
                    <p className="text-sm text-gray-600 mb-2">Initial review by USPTO</p>
                    <p className="text-primary font-medium text-lg">12-18 months</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">Estimated Grant Time</h3>
                    <p className="text-sm text-gray-600 mb-2">Total time for application approval</p>
                    <p className="text-primary font-medium text-lg">24-30 months</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'analysis' && analysis && (
            <div className="space-y-8">
              {/* Overview Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
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
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{analysis.overview.status}</h3>
                  <p className="text-gray-600 max-w-md">{analysis.overview.summary}</p>
                </div>
              </div>

              {/* Application Review */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Application Review</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-green-600 mb-2">Strengths</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {analysis.applicationReview.strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium text-red-600 mb-2">Areas for Improvement</h3>
                    <ul className="list-disc list-inside text-gray-600 space-y-2">
                      {analysis.applicationReview.weaknesses.map((weakness, index) => (
                        <li key={index}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Document Analysis */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Document Analysis</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Required Documents</h3>
                    <ul className="list-disc list-inside text-gray-600">
                      {analysis.documentAnalysis.requiredDocuments.map((doc, index) => (
                        <li key={index}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                  {analysis.documentAnalysis.missingDocuments.length > 0 && (
                    <div>
                      <h3 className="font-medium text-red-600 mb-2">Missing Documents</h3>
                      <ul className="list-disc list-inside text-gray-600">
                        {analysis.documentAnalysis.missingDocuments.map((doc, index) => (
                          <li key={index}>{doc}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Filing Strategy */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Filing Strategy</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Timeline</h3>
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
                        <p className="text-sm text-gray-600">Estimated Grant</p>
                        <p className="font-medium text-gray-900">{analysis.filingStrategy.timeline.estimatedRegistration}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Risks & Opportunities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-red-600 mb-2">Risks</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {analysis.filingStrategy.risks.map((risk, index) => (
                            <li key={index}>{risk}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-600 mb-2">Opportunities</h4>
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {analysis.filingStrategy.opportunities.map((opportunity, index) => (
                            <li key={index}>{opportunity}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommendations</h2>
                <div className="space-y-4">
                  {analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between">
                        <h3 className="font-medium text-gray-900">{rec.title}</h3>
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatentFilingPreparation; 