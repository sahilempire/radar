import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { IoArrowBack } from 'react-icons/io5';
import { IoInformationCircleOutline, IoDocumentTextOutline, IoSearchOutline, IoListOutline } from 'react-icons/io5';

const steps = [
  'Basic Info',
  'Detailed Description',
  'Prior Art',
  'Claims'
];

const initialForm = {
  // Basic Info
  patentTitle: '',
  patentType: '',
  inventors: [],
  applicantName: '',
  applicantType: '',
  applicantAddress: '',
  priorityClaim: false,
  priorityCountry: '',
  priorityAppNumber: '',
  priorityFilingDate: '',

  // Detailed Description
  technicalField: '',
  backgroundArt: '',
  detailedDescription: '',
  advantageousEffects: '',
  drawings: [],

  // Prior Art
  knownPriorArt: '',
  priorArtReferences: [],

  // Claims
  claims: []
};

const patentTypes = [
  'Utility Patent',
  'Design Patent',
  'Provisional Patent',
  'Plant Patent'
];

const applicantTypes = ['Individual', 'Corporation', 'University', 'Government', 'Other'];

const countries = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Other'];

const PatentFiling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [aiLoading, setAiLoading] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (location.state?.isReturning && location.state?.formData) {
      setForm(location.state.formData);
      setStep(steps.length - 1);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: checked }));
    } else if (type === 'file') {
      setForm((f) => ({ ...f, [name]: files[0] }));
    } else {
      setForm((f) => ({ ...f, [name]: value }));
    }
  };

  const handleAddDrawing = () => {
    setForm(f => ({
      ...f,
      drawings: [...f.drawings, { figure: `Fig. ${f.drawings.length + 1}`, description: '' }]
    }));
  };

  const handleDrawingChange = (index, field, value) => {
    setForm(f => ({
      ...f,
      drawings: f.drawings.map((drawing, i) => 
        i === index ? { ...drawing, [field]: value } : drawing
      )
    }));
  };

  const handleAddPriorArt = () => {
    setForm(f => ({
      ...f,
      priorArtReferences: [...f.priorArtReferences, { reference: '', type: '', relevance: '' }]
    }));
  };

  const handlePriorArtChange = (index, field, value) => {
    setForm(f => ({
      ...f,
      priorArtReferences: f.priorArtReferences.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const handleSearchPriorArt = () => {
    // TODO: Implement prior art search
    toast.success('Searching for prior art...');
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      // TODO: Implement patent submission logic
      setSubmissionData(form);
      navigate('/dashboard/patent/generate-documents', { 
        state: { 
          submissionData: form,
          isReturning: false
        } 
      });
    } catch (error) {
      setSubmissionError(error.message);
      toast.error('Failed to submit patent application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Progress calculation
  const progressPercent = ((step + 1) / steps.length) * 100;

  return (
    <div className="w-full p-8 outline outline-1 outline-gray-200 rounded-lg">
      {/* Progress Bar Section */}
      <div className="mb-8">
        <div className='flex items-center gap-4 mb-6'> 
          <button 
            type="button"
            className="p-2 text-gray-600 hover:text-[#0080ff] transition-colors rounded-[25%] hover:bg-gray-100 border border-gray-300"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <IoArrowBack className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Patent Application Wizard</h1>
        </div>
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Completion Progress</span>
          <span>In Progress</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#0080ff] h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stepper Tabs */}
      <div className="flex items-center justify-between mb-10">
        {steps.map((label, i) => {
          const isActive = i === step;
          const isCompleted = i < step;
          const icons = [
            <IoInformationCircleOutline className="w-5 h-5" />,
            <IoDocumentTextOutline className="w-5 h-5" />,
            <IoSearchOutline className="w-5 h-5" />,
            <IoListOutline className="w-5 h-5" />
          ];
          return (
            <React.Fragment key={label}>
              <div className="flex flex-col items-center">
                <button
                  type="button"
                  className={`w-full px-4 py-2 rounded-lg border-2 transition-all duration-200 flex items-center gap-2
                    ${isActive ? 'bg-[#0080ff] text-white border-[#0080ff] shadow-lg' : isCompleted ? 'bg-[#0080ff]/90 text-white border-[#0080ff]/80' : 'bg-white text-[#0080ff]/60 border-[#0080ff]/20'}
                  `}
                  onClick={() => i <= step ? setStep(i) : null}
                  disabled={i > step}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {icons[i]}
                  {label}
                </button>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${step > i ? 'bg-[#0080ff]' : 'bg-[#0080ff]/20'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Form Steps */}
      {step === 0 && (
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Patent Title <span className="text-[#0080ff]">*</span></label>
            <input
              type="text"
              name="patentTitle"
              value={form.patentTitle}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              placeholder="Enter patent title"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Patent Type <span className="text-[#0080ff]">*</span></label>
            <select
              name="patentType"
              value={form.patentType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              required
            >
              <option value="">Select patent type</option>
              {patentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Applicant Type <span className="text-[#0080ff]">*</span></label>
            <select
              name="applicantType"
              value={form.applicantType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              required
            >
              <option value="">Select applicant type</option>
              {applicantTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Technical Field <span className="text-[#0080ff]">*</span></label>
            <textarea
              name="technicalField"
              value={form.technicalField}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              placeholder="Describe the technical field to which the invention relates"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Background Art <span className="text-[#0080ff]">*</span></label>
            <textarea
              name="backgroundArt"
              value={form.backgroundArt}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              placeholder="Describe the existing art, problems, and limitations that your invention addresses"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Detailed Description <span className="text-[#0080ff]">*</span></label>
            <textarea
              name="detailedDescription"
              value={form.detailedDescription}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              placeholder="Provide a detailed description of your invention, including all components, how they interact, and alternative embodiments"
              rows="6"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Advantageous Effects <span className="text-[#0080ff]">*</span></label>
            <textarea
              name="advantageousEffects"
              value={form.advantageousEffects}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              placeholder="Describe the advantages and improvements your invention provides over existing solutions"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Drawings</label>
            <div className="space-y-4">
              {form.drawings.map((drawing, index) => (
                <div key={index} className="flex gap-4">
                  <input
                    type="text"
                    value={drawing.figure}
                    onChange={(e) => handleDrawingChange(index, 'figure', e.target.value)}
                    className="w-24 px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
                    placeholder="Fig. X"
                  />
                  <input
                    type="text"
                    value={drawing.description}
                    onChange={(e) => handleDrawingChange(index, 'description', e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
                    placeholder="Description of Figure"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddDrawing}
                className="px-4 py-2 text-[#0080ff] hover:text-[#0080ff]/80 transition-colors"
              >
                + Add Drawing
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Known Prior Art <span className="text-[#0080ff]">*</span></label>
            <textarea
              name="knownPriorArt"
              value={form.knownPriorArt}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              placeholder="Describe any known existing solutions or technologies related to your invention"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Prior Art References</label>
            <div className="space-y-4">
              {form.priorArtReferences.map((ref, index) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <input
                    type="text"
                    value={ref.reference}
                    onChange={(e) => handlePriorArtChange(index, 'reference', e.target.value)}
                    className="px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
                    placeholder="Patent number or article title"
                  />
                  <input
                    type="text"
                    value={ref.type}
                    onChange={(e) => handlePriorArtChange(index, 'type', e.target.value)}
                    className="px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
                    placeholder="Patent, Article, etc."
                  />
                  <input
                    type="text"
                    value={ref.relevance}
                    onChange={(e) => handlePriorArtChange(index, 'relevance', e.target.value)}
                    className="px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
                    placeholder="How it relates to your invention"
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddPriorArt}
                className="px-4 py-2 text-[#0080ff] hover:text-[#0080ff]/80 transition-colors"
              >
                + Add Reference
              </button>
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1 text-gray-700">Search for Prior Art</label>
            <div className="flex gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
                placeholder="Enter keywords related to your invention"
              />
              <button
                type="button"
                onClick={handleSearchPriorArt}
                className="px-6 py-3 bg-[#0080ff] text-white rounded-lg hover:bg-[#0080ff]/90 transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block font-medium mb-1 text-gray-700">Claims <span className="text-[#0080ff]">*</span></label>
            <textarea
              name="claims"
              value={form.claims.join('\n')}
              onChange={(e) => setForm(f => ({ ...f, claims: e.target.value.split('\n') }))}
              className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700"
              placeholder="Enter patent claims (one per line)"
              rows="6"
              required
            />
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          disabled={step === 0}
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            if (step === steps.length - 1) {
              handleSubmit();
            } else {
              setStep(s => Math.min(steps.length - 1, s + 1));
            }
          }}
          className="px-6 py-2 bg-[#0080ff] text-white rounded-lg hover:bg-[#0080ff]/90 transition-colors"
          disabled={isSubmitting}
        >
          {step === steps.length - 1 ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default PatentFiling; 