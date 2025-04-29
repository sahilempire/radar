import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { uploadSupportingFile, deleteSupportingFile, initializeStorage, getFiling } from '../services';
import ProgressSidebar from '../components/ProgressSidebar';
function UploadDocuments() {
  const { filingId } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isStorageReady, setIsStorageReady] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filingExists, setFilingExists] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const documentCategories = [
    { id: 'logo', name: 'Logo/Mark Image', required: true },
    { id: 'specimen', name: 'Specimens of Use', required: true },
    { id: 'declaration', name: 'Signed Declaration', required: true },
    { id: 'consent', name: 'Consent Documents', required: false }
  ];

  useEffect(() => {
    const verifyFiling = async () => {
      if (!filingId) {
        toast.error('No filing ID provided');
        navigate('/dashboard');
        return;
      }

      try {
        const result = await getFiling(filingId);
        if (!result.success) {
          toast.error('Filing not found. Please create a filing first.');
          setFilingExists(false);
          return;
        }
        setFilingExists(true);
      } catch (error) {
        console.error('Error verifying filing:', error);
        toast.error('Error verifying filing. Please try again.');
        setFilingExists(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyFiling();
  }, [filingId, navigate]);

  useEffect(() => {
    const initStorage = async () => {
      try {
        console.log('Initializing storage...');
        const ready = await initializeStorage();
        setIsStorageReady(ready);
        if (!ready) {
          toast.error('Failed to initialize storage. Please try again later.');
        }
      } catch (error) {
        console.error('Storage initialization error:', error);
        toast.error('Failed to initialize storage. Please try again later.');
      }
    };

    initStorage();
  }, []);

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      const isValidType = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/tiff'].includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

      if (!isValidType) {
        toast.error(`Unsupported file type: ${file.name}`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File too large: ${file.name} (max 10MB)`);
        return false;
      }
      return true;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const handleFileUpload = async (files) => {
    if (!selectedCategory) {
      toast.error('Please select a document category first');
      return;
    }

    if (!filingExists) {
      toast.error('Filing not found. Please create a filing first.');
      return;
    }

    if (isLoading) {
      toast.error('Please wait while we verify your filing');
      return;
    }

    if (!isStorageReady) {
      toast.error('Storage is not ready. Please try again in a moment.');
      return;
    }

    try {
      setIsUploading(true);
      console.log('Starting file upload process...');
      console.log('Filing ID:', filingId);
      console.log('Selected category:', selectedCategory);
      console.log('Files to upload:', files);

      // Upload each file
      for (const file of files) {
        console.log('Processing file:', file.name);
        console.log('File details:', {
          name: file.name,
          type: file.type,
          size: file.size
        });

        const result = await uploadSupportingFile(filingId, file, selectedCategory);
        console.log('Upload result:', result);
        
        if (result.success) {
          console.log('File uploaded successfully:', file.name);
          // Add to uploaded files state
          setUploadedFiles(prev => [...prev, {
            id: result.data.id,
            name: file.name,
            category: selectedCategory,
            size: file.size,
            type: file.type
          }]);
          
          toast.success(`Successfully uploaded ${file.name}`);
        } else {
          console.error('Upload failed:', result.error);
          throw new Error(result.error || 'Failed to upload file');
        }
      }
    } catch (error) {
      console.error('Error in handleFileUpload:', error);
      toast.error(`Error uploading file: ${error.message}`);
    } finally {
      console.log('Upload process completed');
      setIsUploading(false);
      setFiles([]); // Clear the selected files after upload attempt
    }
  };

  const handleRemoveFile = async (fileId) => {
    try {
      await deleteSupportingFile(fileId);
      setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
      toast.success('File removed successfully');
    } catch (error) {
      console.error('Error removing file:', error);
      toast.error('Error removing file');
    }
  };

  return (
    <div className="min-h-screen bg-white px-4 py-10">
      <ProgressSidebar/>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Upload Manager</h1>
          <p className="text-gray-600 mt-2">Upload and manage supporting documents for your application</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
          <p className="text-gray-600 mb-6">Select a category and upload supporting files</p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select document category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
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

          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-4">Selected Files</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
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

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Required Documents</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Clear image of the trademark/logo
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Specimens showing the mark in use in commerce
              </li>
              <li className="flex items-center text-gray-600">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                Signed declaration of use or intent to use
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Missing Required Documents</h3>
            <ul className="space-y-2">
              {documentCategories.filter(cat => cat.required).map(category => (
                <li key={category.id} className="flex items-center text-red-500">
                  <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {category.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex justify-between">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Back
            </button>
            <div className="space-x-4">
              <button
                onClick={() => navigate(`/dashboard/compliance/${filingId}`)}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Check Compliance
              </button>
              <button
                onClick={() => handleFileUpload(files)}
                disabled={isUploading || !selectedCategory || files.length === 0}
                className={`px-6 py-2 bg-primary text-white rounded-lg ${
                  isUploading || !selectedCategory || files.length === 0
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-primary/90'
                }`}
              >
                {isUploading ? 'Uploading...' : 'Upload Files'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadDocuments; 