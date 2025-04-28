import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateDocuments } from '../services/documentservicepatent';

const DocumentGenerator = ({ formData, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratedDocs, setShowGeneratedDocs] = useState(false);
  const [documents, setDocuments] = useState([
    { name: 'Provisional Patent Application', type: 'USPTO Form', status: 'Pending', required: true },
    { name: 'Patent Specification', type: 'Technical Document', status: 'Pending', required: true },
    { name: 'Patent Claims', type: 'Legal Document', status: 'Pending', required: true },
    { name: 'Inventor Declaration', type: 'USPTO Form', status: 'Pending', required: true },
    { name: 'Information Disclosure Statement', type: 'USPTO Form', status: 'Pending', required: false }
  ]);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get form data from localStorage
      const savedFormData = JSON.parse(localStorage.getItem('patentApplicationData'));
      if (!savedFormData) {
        throw new Error('No patent application data found. Please complete the application form first.');
      }

      // Generate documents using the service
      const generatedDocs = await generateDocuments(savedFormData);

      // Update documents state with generated content
      setDocuments(documents.map(doc => {
        const generatedDoc = generatedDocs.find(g => g.type === doc.name);
        return generatedDoc ? { ...doc, status: 'Generated', content: generatedDoc.content } : doc;
      }));

      setShowGeneratedDocs(true);
    } catch (error) {
      console.error('Error generating documents:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Get form data from localStorage
      const savedFormData = JSON.parse(localStorage.getItem('patentApplicationData'));
      if (!savedFormData) {
        throw new Error('No patent application data found. Please complete the application form first.');
      }

      // Regenerate documents using the service
      const generatedDocs = await generateDocuments(savedFormData);

      // Update documents state with regenerated content
      setDocuments(documents.map(doc => {
        const generatedDoc = generatedDocs.find(g => g.type === doc.name);
        return generatedDoc ? { ...doc, status: 'Generated', content: generatedDoc.content } : doc;
      }));
    } catch (error) {
      console.error('Error regenerating documents:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAnalyze = () => {
    console.log('Analyzing application...');
    // Add analysis logic here
  };

  const handleValidate = () => {
    console.log('Validating documents...');
    // Add validation logic here
  };

  const handleDownload = (document) => {
    if (document.content) {
      const blob = new Blob([document.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${document.name}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-primary/20 mt-8 mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-light">Document Generator</h2>
        <p className="text-accent/80 mt-2">Generate and manage filing-ready documents for your patent application</p>
      </div>

      <div className="space-y-6">
        {!showGeneratedDocs ? (
          <>
            <div className="p-6 bg-primary/10 rounded-lg">
              <h3 className="text-lg font-semibold text-light mb-4">Generate Your Documents</h3>
              <p className="text-accent/80 mb-6">Our AI will analyze your application data and generate all required documents</p>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-light/90">Documents will be tailored based on your application details</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-light/90">All required USPTO/IP office forms will be prepared</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-light/90">You can download, review, and modify as needed</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">✓</span>
                  </div>
                  <p className="text-light/90">AI-powered validation ensures compliance with filing requirements</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="px-6 py-2 rounded-lg font-semibold bg-primary text-light shadow hover:shadow-primary/30 transition-all disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Filing Documents'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-light">Generated Documents</h3>
                <div className="flex items-center gap-2">
                  <span className="text-accent/80 text-sm">100% Ready</span>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              </div>
              <p className="text-accent/80 mb-4">Review and download your filing-ready documents</p>

              {error && (
                <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-red-500">{error}</p>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-primary/20">
                      <th className="text-left py-3 px-4 text-accent/80 font-medium">Document Name</th>
                      <th className="text-left py-3 px-4 text-accent/80 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-accent/80 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-accent/80 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, index) => (
                      <tr key={index} className="border-b border-primary/20">
                        <td className="py-3 px-4 text-light">
                          {doc.name}
                          {doc.required && <span className="ml-2 text-xs text-accent/60">Required</span>}
                        </td>
                        <td className="py-3 px-4 text-light/80">{doc.type}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            doc.status === 'Generated' ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {doc.status === 'Generated' ? (
                            <button 
                              onClick={() => handleDownload(doc)}
                              className="text-primary hover:text-primary/80 text-sm font-medium"
                            >
                              Download PDF
                            </button>
                          ) : (
                            <span className="text-accent/60 text-sm">Not ready</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button 
                  onClick={handleRegenerate}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-lg font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-all disabled:opacity-50"
                >
                  {isGenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
                <button 
                  onClick={handleAnalyze}
                  className="px-4 py-2 rounded-lg font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-all"
                >
                  Analyze Application
                </button>
                <button 
                  onClick={handleValidate}
                  className="px-4 py-2 rounded-lg font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-all"
                >
                  Validate Documents
                </button>
                <Link 
                  to="/dashboard/upload"
                  className="px-4 py-2 rounded-lg font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-all"
                >
                  Upload Documents
                </Link>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <h3 className="text-lg font-semibold text-light">Next Steps</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-light font-medium">Review Documents</h4>
                    <p className="text-accent/80 text-sm">Download and carefully review all generated documents for accuracy</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-light font-medium">Validate Compliance</h4>
                    <p className="text-accent/80 text-sm">Run our compliance checker to ensure all filing requirements are met</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                    <span className="text-primary text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-light font-medium">Submit Application</h4>
                    <p className="text-accent/80 text-sm">Use the documents to file your application with the appropriate IP office</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DocumentGenerator; 