import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
// You may need to implement or adjust these imports for patent uploads:
// import { uploadPatentSupportingFile, deletePatentSupportingFile, initializePatentStorage, getPatentFiling } from '../services/patentDocumentService';
import { IoArrowBack } from 'react-icons/io5';

function PatentUploadDocuments() {
  const { id: filingId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(true); // Assume ready for now
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Define patent document categories
  const documentCategories = [
    { id: 'patentApplication', name: 'Patent Application Form', required: true },
    { id: 'specification', name: 'Specification Document', required: true },
    { id: 'claims', name: 'Claims Document', required: true },
    { id: 'abstract', name: 'Abstract', required: true },
    { id: 'drawings', name: 'Drawings', required: false },
    { id: 'declaration', name: 'Declaration', required: false }
  ];

  // TODO: Implement file upload logic for patents
  const handleFiles = async (newFiles) => {
    if (!selectedCategory) {
      toast.error('Please select a document category first');
      return;
    }
    // For now, just add to uploadedFiles for demo
    setUploadedFiles(prev => [
      ...prev,
      ...newFiles.map(file => ({
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        category: selectedCategory,
        size: file.size,
        type: file.type
      }))
    ]);
    toast.success('Files uploaded (demo)');
    setSelectedCategory('');
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleRemoveFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
    toast.success('File removed');
  };

  const handleCheckCompliance = () => {
    // Pass along submissionData and uploadedFiles if needed
    navigate('/dashboard/patent/compliance', {
      state: {
        submissionData: location.state?.submissionData,
        documents: location.state?.documents,
        uploadedFiles
      }
    });
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className='flex items-center gap-2 mb-6'>
            <button 
              type="button"
              className="p-2 text-gray-600 hover:text-[#C67B49] transition-colors rounded-[25%] hover:bg-gray-100 border border-gray-300"
              onClick={() => navigate(-1)}
              aria-label="Go back"
            >
              <IoArrowBack className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold text-primary">Patent Document Upload</h1>
          </div>
          <p className="text-gray-600 mt-2">Upload and manage supporting documents for your patent application</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
          <p className="text-gray-600 mb-6">Select a category and upload supporting files</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select document category
            </label>
            <select
              name="documentCategory"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-[#C67B49]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#C67B49]/40 text-gray-700"
            >
              <option value="">Select a category</option>
              {documentCategories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} {category.required ? '(Required)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#C67B49] transition-colors"
            onDrop={handleFileDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => document.getElementById('file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <div className="space-y-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-gray-600">Drag and drop files here, or click to select files</p>
              <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, JPEG, PNG, TIFF (Max 10MB)</p>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Uploaded Files</h3>
              <div className="space-y-2">
                {uploadedFiles.map((file, index) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-sm">{file.name}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex justify-between">
            <button
              className="px-6 py-2 border border-[#000000] text-[#000000] rounded-lg hover:bg-[#C67B49]/10 transition-colors flex items-center gap-2"
              onClick={() => navigate(-1)}
            >
              <span>Back</span>
            </button>
            <button
              className="px-6 py-2 bg-[#C67B49] text-white rounded-lg hover:bg-[#C67B49]/90 transition-colors flex items-center gap-2"
              onClick={handleCheckCompliance}
            >
              <span>Check Compliance</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatentUploadDocuments; 