import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { uploadSupportingFile, deleteSupportingFile, initializeStorage, getFiling } from '../services';
import ProgressSidebar from '../components/ProgressSidebar';
import CustomSelect from '../components/CustomSelect';
import { IoArrowBack } from 'react-icons/io5';
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
    { id: 'consent', name: 'Consent Documents', required: false },
    { id: 'foreign', name: 'Foreign Registration', required: false }
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

  const handleFiles = async (newFiles) => {
    if (!selectedCategory) {
      toast.error('Please select a document category first');
      return;
    }

    // File type and size validation
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/tiff'
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFiles = [];
    for (const file of newFiles) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`Unsupported file type: ${file.name}. Allowed: PDF, DOCX, JPEG, PNG, TIFF.`);
        continue;
      }
      if (file.size > maxSize) {
        toast.error(`File too large: ${file.name} (max 10MB)`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      try {
        setIsUploading(true);
        for (const file of validFiles) {
          const result = await uploadSupportingFile(filingId, file, selectedCategory);
          if (result.success) {
            setUploadedFiles(prev => [...prev, {
              id: result.data.id,
              name: file.name,
              category: selectedCategory,
              size: file.size,
              type: file.type
            }]);
            toast.success(`Successfully uploaded ${file.name}`);
          } else {
            throw new Error(result.error || 'Failed to upload file');
          }
        }
        // Clear the selected category after successful upload
        setSelectedCategory('');
      } catch (error) {
        console.error('Error in handleFiles:', error);
        toast.error(`Error uploading file: ${error.message}`);
      } finally {
        setIsUploading(false);
      }
    }
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
      <div className="max-w-6xl mx-auto">
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
            <h1 className="text-2xl font-bold text-primary">Upload Manager</h1>
          </div>
          <p className="text-gray-600 mt-2">Upload and manage supporting documents for your application</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Upload Documents */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Upload Documents</h2>
              <p className="text-gray-600 mb-6">Select a category and upload supporting files</p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select document category
                </label>
                <CustomSelect
                  name="documentCategory"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={documentCategories.map(category => `${category.name} ${category.required ? '(Required)' : ''}`)}
                  placeholder="Select a category"
                  className="w-full"
                />
              </div>

              <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-[#C67B49] transition-colors">
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="absolute opacity-0 w-full h-full top-0 left-0 cursor-pointer"
                  onChange={handleFileSelect}
                  style={{zIndex:2}}
                  tabIndex={-1}
                  aria-label="File upload"
                />
                <div
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => document.getElementById('file-input').click()}
                  className="relative z-1"
                >
                  <div className="space-y-2">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-600">Drag and drop files here, or click to select files</p>
                    <p className="text-sm text-gray-500">Supported formats: PDF, DOCX, JPEG, PNG, TIFF (Max 10MB)</p>
                  </div>
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
            </div>

            {/* Uploaded Documents Section */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold mb-6">Uploaded Documents</h2>
              {uploadedFiles.length > 0 ? (
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.category}</p>
                        </div>
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
              ) : (
                <p className="text-gray-500 text-center py-4">No documents uploaded yet</p>
              )}
            </div>

            {/* Check Compliance Button */}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Back
              </button>
              <button
                onClick={() => navigate(`/dashboard/compliance/${filingId}`)}
                className="px-6 py-2 bg-[#C67B49] text-white rounded-lg hover:bg-[#C67B49]/90 flex items-center gap-2"
              >
                Check Compliance
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Side - Required Documents */}
          {/* <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-6">Required Documents</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Document Checklist</h3>
                  <ul className="space-y-4">
                    {documentCategories.filter(cat => cat.required).map(category => {
                      const isUploaded = uploadedFiles.some(file => file.category === category.id);
                      return (
                        <li 
                          key={category.id} 
                          className={`flex items-center justify-between ${isUploaded ? 'text-green-600' : 'text-gray-600'}`}
                        >
                          <div className="flex items-center">
                            {isUploaded ? (
                              <svg className="h-5 w-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          {isUploaded ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2.5 py-1 rounded-full">
                              Uploaded
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2.5 py-1 rounded-full">
                              Pending
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Upload Progress</span>
                    <span className="text-sm text-gray-500">
                      {uploadedFiles.filter(file => documentCategories.find(cat => cat.id === file.category)?.required).length} of {documentCategories.filter(cat => cat.required).length} required
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#C67B49] h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${Math.min(100, (uploadedFiles.filter(file => documentCategories.find(cat => cat.id === file.category)?.required).length / documentCategories.filter(cat => cat.required).length) * 100)}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default UploadDocuments; 