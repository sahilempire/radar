import React, { useState } from 'react';

const documentCategories = [
  'Technical Drawings',
  'Prior Art References',
  'Inventor Declarations',
  'Other Supporting Documents'
];

const UploadManager = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    'Technical Drawings': [],
    'Prior Art References': [],
    'Inventor Declarations': [],
    'Other Supporting Documents': []
  });

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (!selectedCategory) {
      alert('Please select a document category first');
      return;
    }

    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }));

    setUploadedFiles(prev => ({
      ...prev,
      [selectedCategory]: [...prev[selectedCategory], ...newFiles]
    }));
  };

  const getMissingDocuments = () => {
    const required = ['Technical Drawings', 'Prior Art References', 'Inventor Declarations'];
    return required.filter(category => uploadedFiles[category].length === 0);
  };

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-primary/20 mt-8 mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-light">Upload Manager</h2>
        <p className="text-accent/80 mt-2">Upload and manage supporting documents for your patent application</p>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-light mb-4">Upload Documents</h3>
          <p className="text-accent/80 mb-4">Select a category and upload supporting files</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-accent">Select document category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-primary/30 text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
              >
                <option value="">Select a category</option>
                {documentCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center ${
                isDragging ? 'border-primary bg-primary/10' : 'border-primary/30'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="space-y-2">
                <p className="text-light">Drag and drop files here, or click to select files</p>
                <p className="text-accent/60 text-sm">
                  Supported formats: PDF, DOCX, JPEG, PNG, TIFF (Max 10MB)
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 mt-2 rounded-lg font-medium bg-primary/20 text-primary hover:bg-primary/30 transition-all cursor-pointer"
                >
                  Select Files
                </label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-light mb-4">Required Documents</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-light/90">Technical drawings showing the invention</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-light/90">Information about any known prior art</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm">✓</span>
              </div>
              <p className="text-light/90">Properly signed inventor declarations</p>
            </div>
          </div>
        </div>

        {getMissingDocuments().length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-light mb-4">Missing Required Documents</h3>
            <div className="space-y-2">
              {getMissingDocuments().map(doc => (
                <div key={doc} className="flex items-center gap-2 text-accent/80">
                  <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                  {doc}
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.entries(uploadedFiles).map(([category, files]) => (
          files.length > 0 && (
            <div key={category}>
              <h3 className="text-lg font-semibold text-light mb-4">{category}</h3>
              <div className="space-y-2">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-primary/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-primary">📄</span>
                      <div>
                        <p className="text-light">{file.name}</p>
                        <p className="text-accent/60 text-sm">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button className="text-accent/60 hover:text-accent">
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default UploadManager; 