import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const PatentConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [submissionData, setSubmissionData] = useState(null);
  const [filingSummary, setFilingSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.state?.submissionData && location.state?.filingSummary) {
      setSubmissionData(location.state.submissionData);
      setFilingSummary(location.state.filingSummary);
      setIsLoading(false);
    } else {
      setError('No submission data found');
      setIsLoading(false);
    }
  }, [location.state]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/dashboard/patent')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/dashboard/patent')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon className="h-5 w-5 mr-2" />
          Back to Dashboard
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center mb-8">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Patent Application Submitted Successfully</h1>
          <p className="text-gray-600">Your patent application has been submitted and is being processed.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">Application Number</p>
            <p className="font-medium">{filingSummary?.applicationNumber}</p>
          </div>
          <div>
            <p className="text-gray-600">Filing Date</p>
            <p className="font-medium">{filingSummary?.filingDate}</p>
          </div>
          <div>
            <p className="text-gray-600">Patent Title</p>
            <p className="font-medium">{submissionData?.patentTitle}</p>
          </div>
          <div>
            <p className="text-gray-600">Type of Patent</p>
            <p className="font-medium">{submissionData?.patentType}</p>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
                  1
                </div>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 font-medium">Application Review</p>
                <p className="text-gray-600">Your application will be reviewed by the patent office.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
                  2
                </div>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 font-medium">Examination</p>
                <p className="text-gray-600">A patent examiner will review your application in detail.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">
                  3
                </div>
              </div>
              <div className="ml-3">
                <p className="text-gray-900 font-medium">Office Actions</p>
                <p className="text-gray-600">You may receive office actions that require your response.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Filing Fees</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Filing Fee</span>
            <span>${filingSummary?.fees.filingFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Search Fee</span>
            <span>${filingSummary?.fees.searchFee}</span>
          </div>
          <div className="flex justify-between">
            <span>Examination Fee</span>
            <span>${filingSummary?.fees.examinationFee}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>${filingSummary?.fees.total}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatentConfirmation; 