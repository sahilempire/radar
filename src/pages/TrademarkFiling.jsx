import React, { useState } from 'react';
import { submitTrademarkForm, getAIDescription, getAIClassRecommendation } from '../services/trademarkService';
import { validateTrademarkForm } from '../services/validationService';
import { toast } from 'react-hot-toast';

const steps = [
  'Mark & Owner Details',
  'Filing & Usage',
  'Priority & Declaration',
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
  'Sound Mark',
  'Color Mark',
  'Scent Mark',
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

function TrademarkFiling() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [aiLoading, setAiLoading] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

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

  // Placeholder AI suggestion
  const handleAISuggest = async (field) => {
    setAiLoading(field);
    try {
      let suggestion = '';
      if (field === 'trademarkName') {
        suggestion = await getAIDescription(form.trademarkName || '');
      } else if (field === 'businessDescription') {
        suggestion = await getAIDescription(form.businessDescription || '');
      } else if (field === 'goodsServices') {
        suggestion = await getAIClassRecommendation(form.goodsServices || '');
      }
      if (suggestion) {
        setForm((f) => ({ ...f, [field]: suggestion }));
      } else {
        toast.error('No suggestion available.');
      }
    } catch (err) {
      toast.error('Failed to get AI suggestion.');
    } finally {
      setAiLoading(null);
    }
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
      if (!form.ownerAddress?.trim()) {
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
    
    // Final validation
    const { isValid, errors } = validateTrademarkForm(form);
    if (!isValid) {
      setValidationErrors(errors);
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const result = await submitTrademarkForm(form);
      
      if (result.success) {
        toast.success('Trademark application submitted successfully!');
        setForm(initialForm);
        setStep(0);
        setValidationErrors({});
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
    <div className="min-h-screen bg-white px-4 py-10">
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-primary/10">
        {/* Stepper Tabs (now the only progress indicator) */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((label, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            return (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                      ${isActive ? 'bg-primary text-white border-primary shadow-lg' : isCompleted ? 'bg-primary/90 text-white border-primary/80' : 'bg-white text-primary/60 border-primary/20'}
                    `}
                    onClick={() => i <= step ? setStep(i) : null}
                    disabled={i > step}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      i + 1
                    )}
                  </button>
                  <span className={`mt-2 text-xs font-medium ${isActive ? 'text-primary' : isCompleted ? 'text-primary/80' : 'text-primary/60'}`}>{label}</span>
                </div>
                {/* Render connector line except after the last step */}
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 transition-all duration-300 ${step > i ? 'bg-primary' : 'bg-primary/20'}`}></div>
                )}
              </React.Fragment>
            );
          })}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Mark & Owner Details */}
          {step === 0 && (
            <>
              <div>
                <label className="block font-medium mb-1 text-background">Trademark Name <span className="text-primary">*</span></label>
                <div className="flex gap-2 items-center">
                  <input 
                    name="trademarkName" 
                    value={form.trademarkName} 
                    onChange={handleChange} 
                    className={`w-full px-4 py-3 rounded-lg border ${validationErrors.trademarkName ? 'border-red-500' : 'border-primary/20'} bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background`} 
                    placeholder="Enter trademark name" 
                  />
                  <button type="button" className="px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all" onClick={() => handleAISuggest('trademarkName')} disabled={aiLoading === 'trademarkName'}>{aiLoading === 'trademarkName' ? 'Suggesting...' : 'AI Suggest'}</button>
                </div>
                {validationErrors.trademarkName && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.trademarkName}</p>
                )}
                <p className="text-xs text-primary/70 mt-1">Enter the exact text of your trademark. AI can suggest enhancements.</p>
              </div>
              <div>
                <label className="block font-medium mb-1 text-background">Mark Type <span className="text-primary">*</span></label>
                <select name="markType" value={form.markType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" required>
                  <option value="">Select mark type</option>
                  {markTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <p className="text-xs text-primary/70 mt-1">If unsure, AI can help you choose.</p>
              </div>
              {['Design Mark (logo or stylized text)', 'Color Mark'].includes(form.markType) && (
                <>
                  <div>
                    <label className="block font-medium mb-1 text-background">Mark Image Upload <span className="text-primary">*</span></label>
                    <input 
                      name="logo" 
                      type="file" 
                      accept="image/jpeg,image/png,image/svg+xml" 
                      onChange={handleChange} 
                      className={`block w-full text-background ${validationErrors.logo ? 'border-red-500' : ''}`} 
                    />
                    {validationErrors.logo && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.logo}</p>
                    )}
                    <p className="text-xs text-primary/70 mt-1">Upload your mark image (JPEG, PNG, SVG). Max 10MB.</p>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Mark Description <span className="text-primary">*</span></label>
                    <textarea 
                      name="logoDescription" 
                      value={form.logoDescription} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 rounded-lg border ${validationErrors.logoDescription ? 'border-red-500' : 'border-primary/20'} bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background`} 
                      placeholder="Describe mark elements (color, shape, stylization)" 
                    />
                    {validationErrors.logoDescription && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.logoDescription}</p>
                    )}
                  </div>
                </>
              )}
              <div>
                <label className="block font-medium mb-1 text-background">Owner Name <span className="text-primary">*</span></label>
                <input name="ownerName" value={form.ownerName} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" placeholder="Full legal name" required />
              </div>
              <div>
                <label className="block font-medium mb-1 text-background">Owner Type <span className="text-primary">*</span></label>
                <select name="ownerType" value={form.ownerType} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" required>
                  <option value="">Select owner type</option>
                  {ownerTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-background">Owner Address <span className="text-primary">*</span></label>
                <input name="ownerAddress" value={form.ownerAddress} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" placeholder="Full mailing address" required />
              </div>
              <div className="border-t border-primary/10 pt-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <input 
                    name="hasAttorney" 
                    type="checkbox" 
                    checked={form.hasAttorney} 
                    onChange={handleChange} 
                  />
                  <label className="font-medium text-background">I have an attorney representing me</label>
                </div>

                {form.hasAttorney && (
                  <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                    <div>
                      <label className="block font-medium mb-1 text-background">Attorney Name</label>
                      <input 
                        name="attorneyName" 
                        value={form.attorneyName} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" 
                        placeholder="Attorney's full name" 
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 text-background">Attorney Address</label>
                      <input 
                        name="attorneyAddress" 
                        value={form.attorneyAddress} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" 
                        placeholder="Attorney's address" 
                      />
                    </div>
                    <div>
                      <label className="block font-medium mb-1 text-background">Attorney Email</label>
                      <input 
                        name="attorneyEmail" 
                        type="email"
                        value={form.attorneyEmail} 
                        onChange={handleChange} 
                        className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" 
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
                <label className="block font-medium mb-1 text-background">Filing Basis <span className="text-primary">*</span></label>
                <select name="filingBasis" value={form.filingBasis} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" required>
                  <option value="">Select basis</option>
                  {filingBases.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-medium mb-1 text-background">Business Description <span className="text-primary">*</span></label>
                <div className="flex gap-2 items-center">
                  <textarea name="businessDescription" value={form.businessDescription} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" placeholder="Describe your business, products, or services" required />
                  <button type="button" className="px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all" onClick={() => handleAISuggest('businessDescription')} disabled={aiLoading === 'businessDescription'}>{aiLoading === 'businessDescription' ? 'Suggesting...' : 'AI Suggest'}</button>
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1 text-background">Trademark Class <span className="text-primary">*</span></label>
                <select name="trademarkClass" multiple value={form.trademarkClass} onChange={handleClassChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" required>
                  {classOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <p className="text-xs text-primary/70 mt-1">Select all applicable classes. AI can suggest the best class.</p>
              </div>
              <div>
                <label className="block font-medium mb-1 text-background">Goods/Services Description <span className="text-primary">*</span></label>
                <div className="flex gap-2 items-center">
                  <textarea name="goodsServices" value={form.goodsServices} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" placeholder="Describe goods/services for each class" required />
                  <button type="button" className="px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all" onClick={() => handleAISuggest('goodsServices')} disabled={aiLoading === 'goodsServices'}>{aiLoading === 'goodsServices' ? 'Suggesting...' : 'AI Suggest'}</button>
                </div>
              </div>
              {isUseInCommerce && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-medium mb-1 text-background">Date of First Use Anywhere <span className="text-primary">*</span></label>
                    <input 
                      name="firstUseAnywhere" 
                      type="date" 
                      value={form.firstUseAnywhere} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 rounded-lg border ${validationErrors.firstUseAnywhere ? 'border-red-500' : 'border-primary/20'} bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background`} 
                    />
                    {validationErrors.firstUseAnywhere && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.firstUseAnywhere}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Date of First Use in Commerce <span className="text-primary">*</span></label>
                    <input 
                      name="firstUseCommerce" 
                      type="date" 
                      value={form.firstUseCommerce} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 rounded-lg border ${validationErrors.firstUseCommerce ? 'border-red-500' : 'border-primary/20'} bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background`} 
                    />
                    {validationErrors.firstUseCommerce && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.firstUseCommerce}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Type of Commerce <span className="text-primary">*</span></label>
                    <select 
                      name="typeOfCommerce" 
                      value={form.typeOfCommerce} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 rounded-lg border ${validationErrors.typeOfCommerce ? 'border-red-500' : 'border-primary/20'} bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background`}
                    >
                      <option value="">Select type</option>
                      {commerceTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {validationErrors.typeOfCommerce && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.typeOfCommerce}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Describe How Mark is Used <span className="text-primary">*</span></label>
                    <textarea 
                      name="markUsage" 
                      value={form.markUsage} 
                      onChange={handleChange} 
                      className={`w-full px-4 py-3 rounded-lg border ${validationErrors.markUsage ? 'border-red-500' : 'border-primary/20'} bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background`} 
                      placeholder="How the mark appears on goods, services, advertising, etc." 
                    />
                    {validationErrors.markUsage && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.markUsage}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Specimen of Use <span className="text-primary">*</span></label>
                    <input 
                      name="specimen" 
                      type="file" 
                      accept="image/jpeg,image/png,application/pdf" 
                      onChange={handleChange} 
                      className={`block w-full text-background ${validationErrors.specimen ? 'border-red-500' : ''}`} 
                    />
                    {validationErrors.specimen && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.specimen}</p>
                    )}
                    <p className="text-xs text-primary/70 mt-1">Upload marketing materials, website screenshots, product packaging, etc. (JPEG, PNG, PDF). Max 10MB.</p>
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
                <label className="font-medium text-background">Priority Claim (if previously filed abroad)</label>
              </div>
              {form.priorityClaim && (
                <div className="space-y-3 pl-6 border-l-2 border-primary/20">
                  <div>
                    <label className="block font-medium mb-1 text-background">Priority Filing Country</label>
                    <select name="priorityCountry" value={form.priorityCountry} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background">
                      <option value="">Select country</option>
                      {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Priority Application Number</label>
                    <input name="priorityAppNumber" value={form.priorityAppNumber} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" placeholder="Application number" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Priority Filing Date</label>
                    <input name="priorityFilingDate" type="date" value={form.priorityFilingDate} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" />
                  </div>
                  <div>
                    <label className="block font-medium mb-1 text-background">Certified Copy of Priority Document</label>
                    <input 
                      name="certifiedCopy" 
                      type="file" 
                      accept="application/pdf" 
                      onChange={handleChange} 
                      className={`block w-full text-background ${validationErrors.certifiedCopy ? 'border-red-500' : ''}`} 
                    />
                    {validationErrors.certifiedCopy && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.certifiedCopy}</p>
                    )}
                    <p className="text-xs text-primary/70 mt-1">Upload certified copy of priority document (PDF). Max 10MB.</p>
                  </div>
                </div>
              )}
              <div>
                <label className="block font-medium mb-1 text-background">Additional Notes</label>
                <textarea name="additionalNotes" value={form.additionalNotes} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" placeholder="Any special instructions, background info, etc." />
              </div>
              <div className="mb-4 p-4 bg-primary/10 rounded">
                <p className="text-background text-sm">
                  <strong>Declaration:</strong> "I declare that all statements made of my own knowledge are true and that all statements made on information and belief are believed to be true. I understand that willful false statements may result in penalties and jeopardize the validity of the application or any resulting registration."
                </p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input name="declaration" type="checkbox" checked={form.declaration} onChange={handleChange} required />
                <label className="font-medium text-background">I agree to the above declaration</label>
              </div>
              <div>
                <label className="block font-medium mb-1 text-background">Digital Signature <span className="text-primary">*</span></label>
                <input name="signature" value={form.signature} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border border-primary/20 bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 text-background" placeholder="Type your full name as signature" required />
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
              className="px-6 py-2 rounded-lg font-semibold bg-white border border-primary/20 text-primary hover:bg-primary/10 transition-all disabled:opacity-50"
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button 
                type="button" 
                onClick={handleNext}
                className="px-6 py-2 rounded-lg font-semibold bg-primary text-light shadow hover:shadow-primary/30 transition-all"
              >
                Next
              </button>
            ) : (
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="px-6 py-2 rounded-lg font-semibold bg-primary text-light shadow hover:shadow-primary/30 transition-all disabled:opacity-70"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Filing'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default TrademarkFiling; 