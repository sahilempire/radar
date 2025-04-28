import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

function Documents() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { submissionData, generatedDocuments } = location.state || {};

  const documents = [
    {
      name: 'Trademark Application',
      type: 'USPTO Form',
      status: 'Generated',
      required: true
    },
    {
      name: 'Goods and Services Description',
      type: 'Legal Document',
      status: 'Generated',
      required: true
    },
    {
      name: 'Declaration of Use',
      type: 'USPTO Form',
      status: 'Generated',
      required: true
    },
    {
      name: 'Specimen of Use',
      type: 'Evidence Document',
      status: 'Generated',
      required: true
    }
  ];

  const handleDownload = (documentName) => {
    // Simulate download
    toast.success(`Downloading ${documentName}...`);
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      // Simulate regeneration
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Documents regenerated successfully!');
    } catch (error) {
      toast.error('Failed to regenerate documents');
    } finally {
      setIsRegenerating(false);
    }
  };

  if (!submissionData) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-primary">No submission data found. Please complete the filing process first.</p>
          <button
            onClick={() => navigate('/dashboard/trademark')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Go to Filing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Document Generator</h1>
          <p className="text-gray-600">Generate and manage filing-ready documents for your application</p>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-primary mb-4">Generated Documents</h2>
          <p className="text-gray-600 mb-6">Review and download your filing-ready documents</p>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {documents.map((doc, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                        {doc.required && (
                          <span className="ml-2 px-2 py-1 text-xs font-semibold text-red-600 bg-red-100 rounded-full">Required</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{doc.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold text-green-600 bg-green-100 rounded-full">
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDownload(doc.name)}
                        className="text-primary hover:text-primary/80 font-medium"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard/generate-documents')}
            className="px-4 py-2 text-primary hover:text-primary/80"
          >
            Back to Generator
          </button>
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className={`px-6 py-2 rounded-lg font-semibold text-white shadow hover:shadow-primary/30 transition-all
              ${isRegenerating ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary'}`}
          >
            {isRegenerating ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Regenerating...</span>
              </div>
            ) : (
              'Regenerate'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Documents; 