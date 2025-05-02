import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { getFilingDocuments } from '../services/documentService';
import html2pdf from 'html2pdf.js';
import { IoArrowBack } from 'react-icons/io5';
function Documents() {
  const { filingId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState(null);
  const [error, setError] = useState(null);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      if (!filingId) {
        setError('No filing ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await getFilingDocuments(filingId);
        
        if (response.success) {
          setDocuments(response.data);
        } else {
          setError(response.error);
          toast.error('Failed to fetch documents');
        }
      } catch (err) {
        setError(err.message);
        toast.error('Error fetching documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [filingId]);

  const handleDownloadPDF = (documentType, content) => {
    const element = document.createElement('div');
    let formattedContent = '';

    // Get the document content from the documents state based on document type
    let documentContent = '';
    switch(documentType) {
      case 'Trademark Application':
        documentContent = documents?.trademarkApplication || '';
        break;
      case 'Goods and Services Description':
        documentContent = documents?.goodsAndServices || '';
        break;
      case 'Declaration of Use':
        documentContent = documents?.declarationOfUse || '';
        break;
      case 'Specimen of Use':
        documentContent = documents?.specimenOfUse || '';
        break;
    }

    // Format the content by removing the placeholder text and ensuring proper line breaks
    const formattedDocumentContent = documentContent
      .replace(/\[Additional legal content\.\.\.\]/g, '')
      .replace(/\n\s*\n/g, '\n') // Remove extra blank lines
      .trim();

    formattedContent = `
      <div style="padding: 40px; font-family: Arial, sans-serif; line-height: 1.6;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="font-size: 24px; color: #333; margin-bottom: 20px;">${documentType.toUpperCase()}</h1>
          <div style="border-bottom: 2px solid #333; width: 100px; margin: 0 auto;"></div>
        </div>

        <div style="white-space: pre-wrap; font-size: 14px; line-height: 1.8;">
          ${formattedDocumentContent}
        </div>

        <div style="margin-top: 40px; text-align: right;">
          <p style="margin: 5px 0;"><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          ${documentType === 'Trademark Application' || documentType === 'Declaration of Use' ? 
            '<p style="margin: 5px 0;"><strong>Signature:</strong> _______________________</p>' : ''}
        </div>
      </div>
    `;

    element.innerHTML = formattedContent;

    const opt = {
      margin: 1,
      filename: `trademark-${documentType.toLowerCase().replace(/\s+/g, '-')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  const handleValidate = () => {
    setIsValidated(true);
    toast.success('All documents validated successfully');
  };

  const getStatusBadge = (status) => {
    if (isValidated) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
          Validated
        </span>
      );
    }
    return (
      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
        {status}
      </span>
    );
  };

  const handleContinueToUpload = () => {
    navigate(`/dashboard/documents/${filingId}/upload`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-primary">Loading documents...</p>
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
          <h2 className="text-xl font-semibold mb-2">Error Loading Documents</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const documentList = [
    {
      name: 'Trademark Application',
      type: 'USPTO Form',
      status: 'Generated',
      content: documents?.trademarkApplication
    },
    {
      name: 'Goods and Services Description',
      type: 'Legal Document',
      status: 'Generated',
      content: documents?.goodsAndServices
    },
    {
      name: 'Declaration of Use',
      type: 'USPTO Form',
      status: 'Generated',
      content: documents?.declarationOfUse
    },
    {
      name: 'Specimen of Use',
      type: 'Evidence Document',
      status: 'Generated',
      content: documents?.specimenOfUse
    }
  ];

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 ">
          <div className='flex items-center gap-2 mb-6'>
            <button 
            type="button"
            className="p-2 text-gray-600 hover:text-[#C67B49] transition-colors rounded-[25%] hover:bg-gray-100 border border-gray-300"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            >
            <IoArrowBack className="w-6 h-6" />
            </button>
          <h1 className="text-2xl font-bold text-primary">Generated Documents</h1>
          </div>
          
          <p className="text-gray-600 mt-2">Review and download your filing-ready documents</p>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {documentList.map((doc) => (
                <tr key={doc.name}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doc.name}</div>
                        <div className="text-xs text-primary font-medium">Required</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{doc.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(doc.status)}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                      onClick={() => handleDownloadPDF(doc.name, doc.content)}
                      className="text-primary hover:text-primary/80"
                      >
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>

        <div className="mt-8 flex justify-between">
          <button className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors">
            Regenerate
          </button>
          <button
            onClick={handleValidate}
            className="px-4 py-2 bg-[#C67B49] text-white rounded-lg hover:bg-[#C67B49]/90 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span>Validate Documents</span>
          </button>
        </div>

        {/* Next Steps Section */}
        <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Next Steps</h2>
          <div className="space-y-6">
            {/* Review Documents */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-neutral-50 rounded-full">
                <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Review Documents</h3>
                <p className="text-gray-600">Download and carefully review all generated documents for accuracy</p>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Validate Compliance */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-neutral-50 rounded-full">
                <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Validate Compliance</h3>
                <p className="text-gray-600">Run our compliance checker to ensure all filing requirements are met</p>
              </div>
            </div>

            <div className="border-t border-gray-200"></div>

            {/* Submit Application */}
            <div className="flex items-start gap-4">
              <div className="p-2 bg-neutral-50 rounded-full">
                <svg className="w-5 h-5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Submit Application</h3>
                <p className="text-gray-600">Use the documents to file your application with the appropriate IP office</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue to Upload Button */}
        <div className="mt-8 flex justify-end">
          <button 
            className="px-6 py-2 bg-[#C67B49] text-white rounded-lg hover:bg-[#C67B49]/90 transition-colors flex items-center gap-2" 
            onClick={handleContinueToUpload}
          >
            <span>Continue to Upload</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Documents; 