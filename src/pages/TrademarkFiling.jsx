import React, { useState, useEffect } from 'react';
import { submitTrademarkForm, getAIDescription, getAIClassRecommendation, getAITrademarkName, getAIMarkDescription } from '../services/trademarkService';
import { validateTrademarkForm } from '../services/validationService';
import { toast } from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';
import AddressInput from '../components/AddressInput';
import { IoArrowBack } from 'react-icons/io5';
import { IoInformationCircleOutline, IoBagHandleOutline, IoDocumentTextOutline, IoSparkles } from 'react-icons/io5';

const steps = [
  'Basic Info',
  'Goods & Services',
  'Usage Evidence',
];

const initialForm = {
  trademarkName: '',
  markType: '',
  logo: null,
  logoDescription: '',
  ownerName: '',
  ownerType: '',
  ownerAddress: '',
  filingBasis: '',
  businessDescription: '',
  trademarkClass: [],
  goodsServices: '',
  firstUseAnywhere: '',
  firstUseCommerce: '',
  typeOfCommerce: '',
  markUsage: '',
  specimen: null,
  priorityClaim: false,
  priorityCountry: '',
  priorityAppNumber: '',
  priorityFilingDate: '',
  additionalNotes: '',
  declaration: false,
  signature: '',
  certifiedCopy: null,
  hasAttorney: false,
  attorneyName: '',
  attorneyAddress: '',
  attorneyEmail: '',
};

const classOptions = Array.from({ length: 45 }, (_, i) => `Class ${i + 1}`);
const markTypes = [
  'Standard Character Mark (text only)',
  'Design Mark (logo or stylized text)',
  'Sound Mark'
];
const ownerTypes = ['Individual', 'Corporation', 'LLC', 'Partnership', 'Trust', 'Other'];
const filingBases = [
  'Use in Commerce (Section 1(a))',
  'Intent to Use (Section 1(b))',
  'Foreign Registration (Section 44(e))',
  'Foreign Application (Section 44(d))',
  'Madrid Protocol (Section 66(a))',
];
const commerceTypes = [
  'Interstate commerce (U.S.)',
  'International commerce',
  'Commerce within a state or U.S. territory',
  'Commerce between U.S. and foreign country',
];
const countries = ['United States', 'India', 'United Kingdom', 'Canada', 'Australia', 'Other'];

const TrademarkFiling = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [submissionData, setSubmissionData] = useState(null);
  const [aiLoading, setAiLoading] = useState(null);
  const [aiClassRecommendation, setAiClassRecommendation] = useState(null);

  // Add logging for route changes
  useEffect(() => {
    console.log('TrademarkFiling mounted');
    console.log('Current path:', window.location.pathname);
  }, []);

  // Add useEffect to handle returned form data
  useEffect(() => {
    if (location.state?.isReturning && location.state?.formData) {
      console.log('Received form data from GenerateDocuments:', location.state.formData);
      setForm(location.state.formData);
      // Set the step to the last step since we're returning from GenerateDocuments
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

  const handleClassChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setForm((f) => ({ ...f, trademarkClass: selected }));
  };

  const handleAISuggest = async (field) => {
    try {
      setAiLoading(field);
      console.log('Starting AI suggestion for field:', field);
      let suggestion = '';
      
      if (field === 'trademarkName') {
        console.log('Getting AI suggestion for trademark name');
        suggestion = await getAITrademarkName(form.trademarkName || '');
      } else if (field === 'businessDescription') {
        console.log('Getting AI description for business description');
        const currentDescription = form.businessDescription || '';
        if (!currentDescription.trim()) {
          toast.error('Please provide at least a brief description of your business');
          return;
        }
        const response = await getAIDescription(currentDescription);
        console.log('Received suggestion:', response);
        suggestion = response.description;
      } else if (field === 'goodsServices') {
        console.log('Getting AI class recommendation');
        const recommendation = await getAIClassRecommendation(form.goodsServices || '');
        setAiClassRecommendation(recommendation);
        
        // Update the form with the suggested classes
        if (recommendation && recommendation.classes) {
          const suggestedClasses = recommendation.classes.map(c => c.number);
          setForm(f => ({ ...f, trademarkClass: suggestedClasses }));
        }
        return; // Don't set suggestion as we're handling it differently
      } else if (field === 'logoDescription') {
        console.log('Getting AI mark description suggestion');
        if (!form.markType) {
          toast.error('Please select a mark type first');
          return;
        }
        
        // For Standard Character Mark, we don't need a file upload
        if (form.markType === 'Standard Character Mark (text only)') {
          suggestion = await getAIMarkDescription(form.logoDescription || '', null, form.markType);
        } else {
          // For other mark types, check if a file is uploaded
          if (!form.logo) {
            toast.error(`Please upload a ${form.markType.toLowerCase()} first`);
            return;
          }
          suggestion = await getAIMarkDescription(form.logoDescription || '', form.logo, form.markType);
        }
      }
      
      console.log('Received suggestion:', suggestion);
      
      if (suggestion) {
        setForm((f) => ({ ...f, [field]: suggestion }));
        toast.success('AI suggestion applied successfully');
      } else {
        toast.error('No suggestion available. Please try again.');
      }
    } catch (err) {
      console.error('Error in handleAISuggest:', err);
      toast.error(`Failed to get AI suggestion: ${err.message}`);
    } finally {
      setAiLoading(null);
    }
  };

  const handleClassSelect = (classNumber) => {
    setForm(f => {
      const currentClasses = f.trademarkClass || [];
      const newClasses = currentClasses.includes(classNumber)
        ? currentClasses.filter(c => c !== classNumber)
        : [...currentClasses, classNumber];
      return { ...f, trademarkClass: newClasses };
    });
  };

  const getClassDescription = (classNumber) => {
    if (!aiClassRecommendation?.classes) return '';
    const classInfo = aiClassRecommendation.classes.find(c => c.number === classNumber);
    return classInfo ? classInfo.description : '';
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const validateCurrentStep = () => {
    const errors = {};
    
    // Step 1: Mark & Owner Details
    if (step === 0) {
      if (!form.trademarkName?.trim()) {
        errors.trademarkName = 'Trademark name is required';
      }
      if (!form.markType) {
        errors.markType = 'Mark type is required';
      }
      if (form.markType === 'Design Mark (logo or stylized text)') {
        if (!form.logo) {
          errors.logo = 'Logo is required for design marks';
        }
        if (!form.logoDescription?.trim()) {
          errors.logoDescription = 'Logo description is required for design marks';
        }
      }
      if (!form.ownerName?.trim()) {
        errors.ownerName = 'Owner name is required';
      }
      if (!form.ownerType) {
        errors.ownerType = 'Owner type is required';
      }
      if (!form.ownerAddress?.trim() || form.ownerAddress === '') {
        errors.ownerAddress = 'Owner address is required';
      }
    }
    
    // Step 2: Filing & Usage
    if (step === 1) {
      if (!form.filingBasis) {
        errors.filingBasis = 'Filing basis is required';
      }
      if (!form.businessDescription?.trim()) {
        errors.businessDescription = 'Business description is required';
      }
      if (!form.trademarkClass?.length) {
        errors.trademarkClass = 'At least one trademark class is required';
      }
      if (!form.goodsServices?.trim()) {
        errors.goodsServices = 'Goods/services description is required';
      }
      if (form.filingBasis === 'Use in Commerce (Section 1(a))') {
        if (!form.firstUseAnywhere) {
          errors.firstUseAnywhere = 'Date of first use anywhere is required';
        }
        if (!form.firstUseCommerce) {
          errors.firstUseCommerce = 'Date of first use in commerce is required';
        }
        if (!form.typeOfCommerce) {
          errors.typeOfCommerce = 'Type of commerce is required';
        }
        if (!form.markUsage?.trim()) {
          errors.markUsage = 'Mark usage description is required';
        }
        if (!form.specimen) {
          errors.specimen = 'Specimen of use is required';
        }
      }
    }
    
    // Step 3: Priority & Declaration
    if (step === 2) {
      if (form.priorityClaim) {
        if (!form.priorityCountry) {
          errors.priorityCountry = 'Priority country is required';
        }
        if (!form.priorityAppNumber?.trim()) {
          errors.priorityAppNumber = 'Priority application number is required';
        }
        if (!form.priorityFilingDate) {
          errors.priorityFilingDate = 'Priority filing date is required';
        }
      }
      if (!form.declaration) {
        errors.declaration = 'You must agree to the declaration';
      }
      if (!form.signature?.trim()) {
        errors.signature = 'Digital signature is required';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submit button clicked');
    
    // Final validation
    const { isValid, errors } = validateTrademarkForm(form);
    if (!isValid) {
      console.log('Validation errors:', errors);
      setValidationErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      console.log('Submitting form data:', form);
      const result = await submitTrademarkForm(form);
      console.log('Submission result:', result);
      
      if (result.success) {
        setSubmissionData(result.data);
        console.log('Stored submission data:', result.data);
        toast.success('Trademark application submitted successfully!');
        
        // Navigate to Generate Documents page with the submission data
        console.log('Navigating to Generate Documents with data:', result.data);
        navigate('/dashboard/generate-documents', { 
          state: { submissionData: result.data }
        });
      } else {
        console.error('Submission failed:', result.error);
        setSubmissionError(result.error || 'Failed to submit application');
        toast.error(result.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setSubmissionError(error.message);
      toast.error('Failed to submit trademark application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isUseInCommerce = form.filingBasis === 'Use in Commerce (Section 1(a))';
  const isIntentToUse = form.filingBasis === 'Intent to Use (Section 1(b))';

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
          <h1 className="text-2xl font-bold text-gray-800">Trademark Application Wizard</h1>
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
            <IoBagHandleOutline className="w-5 h-5" />,
            <IoDocumentTextOutline className="w-5 h-5" />
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
              {/* Render connector line except after the last step */}
              {i < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${step > i ? 'bg-[#0080ff]' : 'bg-[#0080ff]/20'}`}></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Mark & Owner Details */}
        {step === 0 && (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Trademark Name *
              </label>
              <input
                type="text"
                name="trademarkName"
                value={form.trademarkName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0080ff] focus:border-[#0080ff]"
                placeholder="Enter your trademark name"
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Mark Type <span className="text-[#0080ff]">*</span></label>
              <div className="space-y-2">
                {markTypes.map((type) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="markType"
                      value={type}
                      checked={form.markType === type}
                      onChange={handleChange}
                      className="text-[#0080ff] focus:ring-[#0080ff]"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
              {validationErrors.markType && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.markType}</p>
              )}
            </div>
            {['Design Mark (logo or stylized text)', 'Color Mark'].includes(form.markType) && (
              <>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Mark Image Upload <span className="text-[#0080ff]">*</span></label>
                  <input 
                    name="logo" 
                    type="file" 
                    accept="image/jpeg,image/png,image/svg+xml" 
                    onChange={handleChange} 
                    className={`block w-full text-gray-700 ${validationErrors.logo ? 'border-red-500' : ''}`} 
                  />
                  {validationErrors.logo && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.logo}</p>
                  )}
                  <p className="text-xs text-[#0080ff]/70 mt-1">Upload your mark image (JPEG, PNG, SVG). Max 10MB.</p>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Mark Description <span className="text-[#0080ff]">*</span></label>
                  <div className="flex gap-2 items-center">
                    <textarea 
                      name="logoDescription" 
                      value={form.logoDescription} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 rounded-lg border ${validationErrors.logoDescription ? 'border-red-500' : 'border-[#0080ff]/20'} bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700`} 
                      placeholder="Describe mark elements (color, shape, stylization)" 
                    />
                    <button 
                      type="button" 
                      className="px-3 py-1 rounded bg-[#0080ff] text-white text-xs font-semibold shadow hover:bg-[#0080ff]/80 transition-all" 
                      onClick={() => handleAISuggest('logoDescription')} 
                      disabled={aiLoading === 'logoDescription'}
                    >
                      {aiLoading === 'logoDescription' ? 'Suggesting...' : 'AI Suggest'}
                    </button>
                  </div>
                  {validationErrors.logoDescription && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.logoDescription}</p>
                  )}
                </div>
              </>
            )}
            <div>
              <label className="block font-medium mb-1 text-gray-700">Owner Name <span className="text-[#0080ff]">*</span></label>
              <input name="ownerName" value={form.ownerName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" placeholder="Full legal name" required />
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Owner Type <span className="text-[#0080ff]">*</span></label>
              <select name="ownerType" value={form.ownerType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" required>
                <option value="">Select owner type</option>
                {ownerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Owner Address <span className="text-[#0080ff]">*</span></label>
              <AddressInput 
                name="ownerAddress" 
                value={form.ownerAddress} 
                onChange={handleChange} 
                error={validationErrors.ownerAddress}
                placeholder="Full mailing address"
              />
            </div>
            <div className="border-t border-[#0080ff]/10 pt-6 mt-6">
              <div className="flex items-center gap-2 mb-4">
                <input 
                  name="hasAttorney" 
                  type="checkbox" 
                  checked={form.hasAttorney} 
                  onChange={handleChange} 
                />
                <label className="font-medium text-gray-700">I have an attorney representing me</label>
              </div>

              {form.hasAttorney && (
                <div className="space-y-4 pl-6 border-l-2 border-[#0080ff]/20">
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Attorney Name</label>
                    <input 
                      name="attorneyName" 
                      value={form.attorneyName} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" 
                      placeholder="Attorney's full name" 
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Attorney Address</label>
                    <input 
                      name="attorneyAddress" 
                      value={form.attorneyAddress} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" 
                      placeholder="Attorney's address" 
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-gray-700">Attorney Email</label>
                    <input 
                      name="attorneyEmail" 
                      type="email"
                      value={form.attorneyEmail} 
                      onChange={handleChange} 
                      className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" 
                      placeholder="Attorney's email address" 
                    />
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* Step 2: Filing & Usage */}
        {step === 1 && (
          <>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Filing Basis <span className="text-[#0080ff]">*</span></label>
              <select name="filingBasis" value={form.filingBasis} onChange={handleChange} className="w-[80%] px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" required>
                <option value="">Select basis</option>
                {filingBases.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Business Description <span className="text-[#0080ff]">*</span></label>
              <div className="flex gap-2 items-center">
                <textarea 
                  name="businessDescription" 
                  value={form.businessDescription} 
                  onChange={handleChange} 
                  className="w-[80%] px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" 
                  placeholder="Describe your business, products, or services" 
                  required 
                />
                <button 
                  type="button" 
                  className="px-3 py-3 ml-4 rounded bg-[#0080ff] text-white text-xs font-semibold shadow hover:bg-[#0080ff]/80 transition-all flex items-center gap-1"
                  onClick={() => handleAISuggest('businessDescription')} 
                  disabled={aiLoading === 'businessDescription'}
                >
                  <IoSparkles className="w-4 h-4" />
                  {aiLoading === 'businessDescription' ? 'Suggesting...' : 'AI Suggest'}
                </button>
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Trademark Class <span className="text-[#0080ff]">*</span></label>
              <div className="flex gap-2 items-center mb-2">
                <textarea 
                  name="goodsServices" 
                  value={form.goodsServices} 
                  onChange={handleChange} 
                  className="w-[80%] px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" 
                  placeholder="Describe your goods/services in detail" 
                />
                <button 
                  type="button" 
                  className="px-3 py-3 ml-4 rounded bg-[#0080ff] text-white text-xs font-semibold shadow hover:bg-[#0080ff]/80 transition-all flex items-center gap-1"
                  onClick={() => handleAISuggest('goodsServices')} 
                  disabled={aiLoading === 'goodsServices'}
                >
                  <IoSparkles className="w-4 h-4" />
                  {aiLoading === 'goodsServices' ? 'Analyzing...' : 'AI Classes'}
                </button>
              </div>
              
              {aiClassRecommendation && (
                <div className="space-y-4 p-4 bg-[#0080ff]/5 rounded-lg">
                  <p className="text-sm text-[#0080ff]/80">{aiClassRecommendation.summary}</p>
                  
                  <div className="space-y-2">
                    {aiClassRecommendation.classes.map((classInfo) => (
                      <div key={classInfo.number} className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id={`class-${classInfo.number}`}
                          checked={form.trademarkClass?.includes(classInfo.number)}
                          onChange={() => handleClassSelect(classInfo.number)}
                          className="mt-1"
                        />
                        <label htmlFor={`class-${classInfo.number}`} className="flex-1">
                          <div className="font-medium">Class {classInfo.number}</div>
                          <div className="text-sm text-[#0080ff]/70">{classInfo.explanation}</div>
                          <div className="text-sm mt-1">{classInfo.description}</div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {validationErrors.trademarkClass && (
                <p className="text-red-500 text-xs mt-1">{validationErrors.trademarkClass}</p>
              )}
            </div>
            {isUseInCommerce && (
              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Date of First Use Anywhere <span className="text-[#0080ff]">*</span></label>
                  <input 
                    name="firstUseAnywhere" 
                    type="date" 
                    value={form.firstUseAnywhere} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 rounded-lg border ${validationErrors.firstUseAnywhere ? 'border-red-500' : 'border-[#0080ff]/20'} bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700`} 
                  />
                  {validationErrors.firstUseAnywhere && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.firstUseAnywhere}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Date of First Use in Commerce <span className="text-[#0080ff]">*</span></label>
                  <input 
                    name="firstUseCommerce" 
                    type="date" 
                    value={form.firstUseCommerce} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 rounded-lg border ${validationErrors.firstUseCommerce ? 'border-red-500' : 'border-[#0080ff]/20'} bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700`} 
                  />
                  {validationErrors.firstUseCommerce && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.firstUseCommerce}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Type of Commerce <span className="text-[#0080ff]">*</span></label>
                  <select 
                    name="typeOfCommerce" 
                    value={form.typeOfCommerce} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 rounded-lg border ${validationErrors.typeOfCommerce ? 'border-red-500' : 'border-[#0080ff]/20'} bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700`}
                  >
                    <option value="">Select type</option>
                    {commerceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {validationErrors.typeOfCommerce && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.typeOfCommerce}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Describe How Mark is Used <span className="text-[#0080ff]">*</span></label>
                  <textarea 
                    name="markUsage" 
                    value={form.markUsage} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 rounded-lg border ${validationErrors.markUsage ? 'border-red-500' : 'border-[#0080ff]/20'} bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700`} 
                    placeholder="How the mark appears on goods, services, advertising, etc." 
                  />
                  {validationErrors.markUsage && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.markUsage}</p>
                  )}
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Specimen of Use <span className="text-[#0080ff]">*</span></label>
                  <input 
                    name="specimen" 
                    type="file" 
                    accept="image/jpeg,image/png,application/pdf" 
                    onChange={handleChange} 
                    className={`block w-full text-gray-700 ${validationErrors.specimen ? 'border-red-500' : ''}`} 
                  />
                  {validationErrors.specimen && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.specimen}</p>
                  )}
                  <p className="text-xs text-[#0080ff]/70 mt-1">Upload marketing materials, website screenshots, product packaging, etc. (JPEG, PNG, PDF). Max 10MB.</p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 3: Priority & Declaration */}
        {step === 2 && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <input 
                name="priorityClaim" 
                type="checkbox" 
                checked={form.priorityClaim} 
                onChange={handleChange} 
              />
              <label className="font-medium text-gray-700">Priority Claim (if previously filed abroad)</label>
            </div>
            {form.priorityClaim && (
              <div className="space-y-3 pl-6 border-l-2 border-[#0080ff]/20">
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Priority Filing Country</label>
                  <select name="priorityCountry" value={form.priorityCountry} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700">
                    <option value="">Select country</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Priority Application Number</label>
                  <input name="priorityAppNumber" value={form.priorityAppNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" placeholder="Application number" />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Priority Filing Date</label>
                  <input name="priorityFilingDate" type="date" value={form.priorityFilingDate} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">Certified Copy of Priority Document</label>
                  <input 
                    name="certifiedCopy" 
                    type="file" 
                    accept="application/pdf" 
                    onChange={handleChange} 
                    className={`block w-full text-gray-700 ${validationErrors.certifiedCopy ? 'border-red-500' : ''}`} 
                  />
                  {validationErrors.certifiedCopy && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.certifiedCopy}</p>
                  )}
                  <p className="text-xs text-[#0080ff]/70 mt-1">Upload certified copy of priority document (PDF). Max 10MB.</p>
                </div>
              </div>
            )}
            <div>
              <label className="block font-medium mb-1 text-gray-700">Additional Notes</label>
              <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" placeholder="Any special instructions, background info, etc." />
            </div>
            <div className="mb-4 p-4 bg-[#0080ff]/10 rounded">
              <p className="text-gray-700 text-sm">
                <strong>Declaration:</strong> "I declare that all statements made of my own knowledge are true and that all statements made on information and belief are believed to be true. I understand that willful false statements may result in penalties and jeopardize the validity of the application or any resulting registration."
              </p>
            </div>
            <div className="flex items-center gap-2 mb-4">
              <input name="declaration" type="checkbox" checked={form.declaration} onChange={handleChange} required />
              <label className="font-medium text-gray-700">I agree to the above declaration</label>
            </div>
            <div>
              <label className="block font-medium mb-1 text-gray-700">Digital Signature <span className="text-[#0080ff]">*</span></label>
              <input name="signature" value={form.signature} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-[#0080ff]/20 bg-white focus:outline-none focus:ring-2 focus:ring-[#0080ff]/40 text-gray-700" placeholder="Type your full name as signature" required />
            </div>
          </>
        )}

        {/* Submission Status */}
        {submissionError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{submissionError}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <button 
            type="button" 
            onClick={prevStep} 
            disabled={step === 0 || isSubmitting} 
            className="px-6 py-2 rounded-lg font-semibold bg-white border border-[#0080ff]/20 text-[#0080ff] hover:bg-[#0080ff]/10 transition-all disabled:opacity-50"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <button 
              type="button" 
              onClick={handleNext}
              className="px-6 py-2 rounded-lg font-semibold bg-[#0080ff] text-white shadow hover:shadow-[#0080ff]/30 transition-all"
            >
              Next
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg font-semibold bg-[#0080ff] text-white shadow hover:shadow-[#0080ff]/30 transition-all disabled:opacity-70"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Filing'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default TrademarkFiling; 