import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFiling } from '../services/filingService';
import { analyzeApprovalChances, analyzeFilingDates } from '../services/aiService';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
function FilingPrep() {
  const { filingId } = useParams();
  const navigate = useNavigate();
  const [filingData, setFilingData] = useState(null);
  const [approvalChances, setApprovalChances] = useState(null);
  const [filingDates, setFilingDates] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const analyzeFiling = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get filing data
        const filing = await getFiling(filingId);
        if (!filing) {
          throw new Error('Filing data not found');
        }
        setFilingData(filing);

        // Analyze approval chances
        const approvalPrompt = `Analyze the following trademark filing data and predict the chances of approval:

Filing Data:
${JSON.stringify(filing, null, 2)}

Please provide a detailed analysis in the following JSON format:
{
  "approvalChance": number,
  "analysis": {
    "strengths": string[],
    "weaknesses": string[],
    "recommendations": string[]
  }
}

IMPORTANT: Respond ONLY with the JSON object, no additional text or explanation.`;

        const approvalResponse = await analyzeApprovalChances(approvalPrompt);
        const approvalData = JSON.parse(approvalResponse.content[0].text);
        setApprovalChances(approvalData);

        // Analyze filing dates
        const datesPrompt = `Analyze the following trademark filing data and provide detailed timeline estimates:

Filing Data:
${JSON.stringify(filing, null, 2)}

Please provide a comprehensive timeline analysis in the following JSON format:
{
  "estimatedFilingDate": {
    "date": "MM/DD/YYYY",
    "explanation": "string explaining the estimated filing date"
  },
  "estimatedFirstOfficeAction": {
    "timeline": "X-Y months",
    "explanation": "string explaining the first office action timeline"
  },
  "estimatedRegistrationTime": {
    "timeline": "X-Y months",
    "explanation": "string explaining the total registration timeline"
  }
}

Consider the following factors in your analysis:
1. Current USPTO processing times
2. Type of trademark application
3. Completeness of the application
4. Potential issues that might cause delays
5. Historical processing times for similar applications

IMPORTANT: Respond ONLY with the JSON object, no additional text or explanation.`;

        const datesResponse = await analyzeFilingDates(datesPrompt);
        const datesData = JSON.parse(datesResponse.content[0].text);
        setFilingDates(datesData);
      } catch (error) {
        setError(error.message || 'Failed to analyze filing');
      } finally {
        setIsLoading(false);
      }
    };

    analyzeFiling();
  }, [filingId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">Analyzing filing readiness...</p>
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

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-[#0080ff] transition-colors rounded-full hover:bg-gray-100"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <IoArrowBack className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-primary">
              Filing Preparation
            </h1>
          </div>
          <p className="text-gray-600 mt-2">Prepare your trademark application for final submission</p>
        </div>

        {/* Approval Chances */}
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
                  strokeDasharray={`${approvalChances.approvalChance * 100}, 100`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-primary">
                  {Math.round(approvalChances.approvalChance )}%
                </span>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Filing Readiness</h2>
          </div>
        </div>

        {/* Filing Calendar */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing Calendar</h3>
          <p className="text-gray-600 mb-6">Important dates for your trademark application</p>
          
          <div className="space-y-6">
            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Estimated Filing Date</h4>
              <p className="text-gray-600 text-sm mb-2">When your application will be submitted</p>
              <p className="text-primary font-medium text-xl mb-2">
                {filingDates?.estimatedFilingDate?.date || 'Calculating...'}
              </p>
              <p className="text-gray-600 text-sm">
                {filingDates?.estimatedFilingDate?.explanation || 'Analyzing filing timeline...'}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Estimated First Office Action</h4>
              <p className="text-gray-600 text-sm mb-2">Initial review by the patent office</p>
              <p className="text-primary font-medium text-xl mb-2">
                {filingDates?.estimatedFirstOfficeAction?.timeline || 'Calculating...'}
              </p>
              <p className="text-gray-600 text-sm">
                {filingDates?.estimatedFirstOfficeAction?.explanation || 'Analyzing review timeline...'}
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900">Estimated Registration Time</h4>
              <p className="text-gray-600 text-sm mb-2">Total time for application approval</p>
              <p className="text-primary font-medium text-xl mb-2">
                {filingDates?.estimatedRegistrationTime?.timeline || 'Calculating...'}
              </p>
              <p className="text-gray-600 text-sm">
                {filingDates?.estimatedRegistrationTime?.explanation || 'Analyzing registration timeline...'}
              </p>
            </div>
          </div>
        </div>

        {/* AI Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-green-600 mb-2">Strengths</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {approvalChances?.analysis?.strengths?.map((strength, index) => (
                  <li key={index}>{strength}</li>
                )) || <li className="text-gray-400">Analyzing strengths...</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 mb-2">Weaknesses</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {approvalChances?.analysis?.weaknesses?.map((weakness, index) => (
                  <li key={index}>{weakness}</li>
                )) || <li className="text-gray-400">Analyzing weaknesses...</li>}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 mb-2">Recommendations</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {approvalChances?.analysis?.recommendations?.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                )) || <li className="text-gray-400">Analyzing recommendations...</li>}
              </ul>
            </div>
          </div>
        </div>

        {/* Filing Checklist */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filing Checklist</h3>
          <p className="text-gray-600 mb-6">Complete all required steps before submitting your trademark application</p>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">Complete Application Form</span>
              </div>
              <span className="text-green-600 font-medium">Complete</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">Generate Official Documents</span>
              </div>
              <span className="text-green-600 font-medium">Complete</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">Upload Supporting Materials</span>
              </div>
              <span className="text-green-600 font-medium">Complete</span>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">Complete Compliance Check</span>
              </div>
              <span className="text-green-600 font-medium">Complete</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilingPrep; 