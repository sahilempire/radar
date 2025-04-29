import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFiling, getSupportingFiles } from '../services';
import { checkCompliance } from '../services/complianceService';

function ComplianceChecker() {
  const { filingId } = useParams();
  const navigate = useNavigate();
  const [complianceData, setComplianceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('USPTO');

  useEffect(() => {
    const analyzeCompliance = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const result = await checkCompliance(filingId);
        setComplianceData(result);
      } catch (error) {
        console.error('Error analyzing compliance:', error);
        setError(error.message || 'Failed to analyze compliance');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeCompliance();
  }, [filingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing compliance requirements...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!complianceData || !complianceData.jurisdictions) {
    return null;
  }

  const jurisdictions = complianceData.jurisdictions || {};

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Compliance Checker</h1>
          <p className="text-gray-600 mt-2">Verify your application against official filing requirements</p>
        </div>

        {/* Overall Compliance Score */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
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
                  stroke="#3B82F6"
                  strokeWidth="3"
                  strokeDasharray={`${complianceData.overallCompliance || 0}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">{complianceData.overallCompliance || 0}%</span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Compliance Report</h2>
          </div>
        </div>

        {/* Jurisdiction Tabs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {Object.entries(jurisdictions).map(([key, jurisdiction]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                    activeTab === key
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {key}
                </button>
              ))}
            </nav>
          </div>

          {/* Requirements List for Active Tab */}
          <div className="p-6">
            {jurisdictions[activeTab] && (
              <>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {activeTab} Requirements
                </h3>
                <div className="space-y-4">
                  {jurisdictions[activeTab].requirements.map((req, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          req.status === 'met' ? 'bg-green-100 text-green-800' :
                          req.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {req.status}
                        </span>
                        <h4 className="font-medium">{req.requirement}</h4>
                      </div>
                      <p className="mt-2 text-gray-600">{req.details}</p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate(`/dashboard/filing-prep/${filingId}`)}
            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Continue to Filing Prep
          </button>
        </div>
      </div>
    </div>
  );
}

export default ComplianceChecker; 