import React, { useState, useEffect } from 'react';
import DocumentGenerator from './DocumentGenerator';

const steps = [
  'Basic Info',
  'Detailed Description',
  'Prior Art',
  'Claims',
];

const initialForm = {
  // Step 1: Basic Info
  inventionTitle: '',
  inventorNames: '',
  patentType: '',
  briefSummary: '',
  
  // Step 2: Detailed Description
  technicalField: '',
  backgroundArt: '',
  detailedDescription: '',
  advantageousEffects: '',
  drawing1: '',
  drawing2: '',
  
  // Step 3: Prior Art
  knownPriorArt: '',
  priorArtReferences: [],
  
  // Step 4: Claims
  claims: [],
};

const patentTypes = ['Utility', 'Design', 'Plant'];

const PatentWizard = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [aiLoading, setAiLoading] = useState(null);
  const [currentClaim, setCurrentClaim] = useState('');
  const [currentPriorArt, setCurrentPriorArt] = useState({ reference: '', type: '', relevance: '' });
  const [errors, setErrors] = useState({});
  const [showDocumentGenerator, setShowDocumentGenerator] = useState(false);

  // Load saved data from localStorage when component mounts
  useEffect(() => {
    const savedData = localStorage.getItem('patentApplicationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setForm(parsedData);
        console.log('Loaded saved patent application data:', parsedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('patentApplicationData', JSON.stringify(form));
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleAISuggest = async (field) => {
    setAiLoading(field);
    try {
      // Simulate AI suggestion delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      setForm(prev => ({ 
        ...prev, 
        [field]: `AI Suggested ${field.replace(/([A-Z])/g, ' $1')}` 
      }));
    } catch (error) {
      console.error('AI suggestion failed:', error);
    } finally {
      setAiLoading(null);
    }
  };

  const handleAddClaim = () => {
    if (currentClaim.trim()) {
      setForm(prev => ({ 
        ...prev, 
        claims: [...prev.claims, { text: currentClaim }] 
      }));
      setCurrentClaim('');
    }
  };

  const handleAddPriorArt = () => {
    if (currentPriorArt.reference.trim()) {
      setForm(prev => ({ 
        ...prev, 
        priorArtReferences: [...prev.priorArtReferences, currentPriorArt] 
      }));
      setCurrentPriorArt({ reference: '', type: '', relevance: '' });
    }
  };

  const validateStep = () => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!form.inventionTitle) newErrors.inventionTitle = 'Invention title is required';
        if (!form.inventorNames) newErrors.inventorNames = 'Inventor names are required';
        if (!form.patentType) newErrors.patentType = 'Patent type is required';
        if (!form.briefSummary) newErrors.briefSummary = 'Brief summary is required';
        break;
      case 1:
        if (!form.technicalField) newErrors.technicalField = 'Technical field is required';
        if (!form.backgroundArt) newErrors.backgroundArt = 'Background art is required';
        if (!form.detailedDescription) newErrors.detailedDescription = 'Detailed description is required';
        if (!form.advantageousEffects) newErrors.advantageousEffects = 'Advantageous effects are required';
        break;
      case 2:
        if (!form.knownPriorArt) newErrors.knownPriorArt = 'Known prior art is required';
        break;
      case 3:
        if (form.claims.length === 0) newErrors.claims = 'At least one claim is required';
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      console.log('Moving to next step:', step + 1);
      console.log('Current step data:', {
        step: step + 1,
        stepName: steps[step],
        formData: form
      });
      setStep(s => Math.min(s + 1, steps.length - 1));
    } else {
      console.log('Validation failed for step:', step + 1);
      console.log('Validation errors:', errors);
    }
  };

  const handlePrev = () => {
    console.log('Moving to previous step:', step - 1);
    setStep(s => Math.max(s - 1, 0));
  };

  const handleFinish = (e) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form submitted successfully!');
      console.log('Final patent application data:', {
        basicInfo: {
          inventionTitle: form.inventionTitle,
          inventorNames: form.inventorNames,
          patentType: form.patentType,
          briefSummary: form.briefSummary
        },
        detailedDescription: {
          technicalField: form.technicalField,
          backgroundArt: form.backgroundArt,
          detailedDescription: form.detailedDescription,
          advantageousEffects: form.advantageousEffects,
          drawings: {
            drawing1: form.drawing1,
            drawing2: form.drawing2
          }
        },
        priorArt: {
          knownPriorArt: form.knownPriorArt,
          priorArtReferences: form.priorArtReferences
        },
        claims: form.claims
      });

      // Save final data to localStorage
      try {
        localStorage.setItem('patentApplicationData', JSON.stringify(form));
        console.log('Saved patent application data to localStorage');
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }

      // Show document generator instead of alert
      setShowDocumentGenerator(true);
    } else {
      console.log('Form submission failed due to validation errors:', errors);
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Invention Title</label>
        <input 
          name="inventionTitle" 
          value={form.inventionTitle} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.inventionTitle ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition`} 
          placeholder="Enter a clear, concise title for your invention" 
        />
        {errors.inventionTitle && <p className="text-red-500 text-sm mt-1">{errors.inventionTitle}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Inventor Name(s)</label>
        <input 
          name="inventorNames" 
          value={form.inventorNames} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.inventorNames ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition`} 
          placeholder="Full names of all inventors, separated by commas" 
        />
        {errors.inventorNames && <p className="text-red-500 text-sm mt-1">{errors.inventorNames}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Type of Patent</label>
        <select 
          name="patentType" 
          value={form.patentType} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.patentType ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition`}
        >
          <option value="">Select patent type</option>
          {patentTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.patentType && <p className="text-red-500 text-sm mt-1">{errors.patentType}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Brief Summary</label>
        <textarea 
          name="briefSummary" 
          value={form.briefSummary} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.briefSummary ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[120px]`} 
          placeholder="Provide a brief summary of your invention (1-2 paragraphs)" 
        />
        {errors.briefSummary && <p className="text-red-500 text-sm mt-1">{errors.briefSummary}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">AI Suggestion</label>
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm font-medium text-accent mb-1">Based on your summary, consider these improvements:</div>
          <textarea 
            className="w-full px-4 py-3 rounded-lg bg-background border border-primary/30 text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[80px]" 
            placeholder="Enter a summary to receive AI suggestions" 
            readOnly 
          />
        </div>
      </div>
    </div>
  );

  const renderDetailedDescription = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Technical Field</label>
        <textarea 
          name="technicalField" 
          value={form.technicalField} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.technicalField ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[80px]`} 
          placeholder="Describe the technical field to which the invention relates" 
        />
        {errors.technicalField && <p className="text-red-500 text-sm mt-1">{errors.technicalField}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Background Art</label>
        <textarea 
          name="backgroundArt" 
          value={form.backgroundArt} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.backgroundArt ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[80px]`} 
          placeholder="Describe the existing art, problems, and limitations that your invention addresses" 
        />
        {errors.backgroundArt && <p className="text-red-500 text-sm mt-1">{errors.backgroundArt}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Detailed Description</label>
        <textarea 
          name="detailedDescription" 
          value={form.detailedDescription} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.detailedDescription ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[120px]`} 
          placeholder="Provide a detailed description of your invention, including all components, how they interact, and alternative embodiments" 
        />
        {errors.detailedDescription && <p className="text-red-500 text-sm mt-1">{errors.detailedDescription}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Advantageous Effects</label>
        <textarea 
          name="advantageousEffects" 
          value={form.advantageousEffects} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.advantageousEffects ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[80px]`} 
          placeholder="Describe the advantages and improvements your invention provides over existing solutions" 
        />
        {errors.advantageousEffects && <p className="text-red-500 text-sm mt-1">{errors.advantageousEffects}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Drawing References</label>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Fig. 1</label>
              <textarea 
                name="drawing1" 
                value={form.drawing1 || ''} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.drawing1 ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[60px]`} 
                placeholder="Description of Figure 1" 
              />
              {errors.drawing1 && <p className="text-red-500 text-sm mt-1">{errors.drawing1}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-accent">Fig. 2</label>
              <textarea 
                name="drawing2" 
                value={form.drawing2 || ''} 
                onChange={handleChange} 
                className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.drawing2 ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[60px]`} 
                placeholder="Description of Figure 2" 
              />
              {errors.drawing2 && <p className="text-red-500 text-sm mt-1">{errors.drawing2}</p>}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">AI Suggestion</label>
        <div className="p-3 bg-primary/10 rounded-lg">
          <div className="text-sm font-medium text-accent mb-1">Improvement opportunities for your description:</div>
          <textarea 
            className="w-full px-4 py-3 rounded-lg bg-background border border-primary/30 text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[80px]" 
            placeholder="Enter a detailed description to receive AI suggestions" 
            readOnly 
          />
        </div>
      </div>
    </div>
  );

  const renderPriorArt = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Known Prior Art</label>
        <textarea 
          name="knownPriorArt" 
          value={form.knownPriorArt} 
          onChange={handleChange} 
          className={`w-full px-4 py-3 rounded-lg bg-background border ${errors.knownPriorArt ? 'border-red-500' : 'border-primary/30'} text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[80px]`} 
          placeholder="Describe any known existing solutions or technologies related to your invention" 
        />
        {errors.knownPriorArt && <p className="text-red-500 text-sm mt-1">{errors.knownPriorArt}</p>}
      </div>

      <div>
        <h3 className="font-semibold text-accent mb-2">Prior Art References</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
          <div>
            <label className="block text-sm font-medium mb-1 text-accent">Reference</label>
            <input 
              name="reference" 
              value={currentPriorArt.reference} 
              onChange={e => setCurrentPriorArt({ ...currentPriorArt, reference: e.target.value })} 
              className="w-full px-2 py-2 rounded bg-background border border-primary/30 text-light" 
              placeholder="Patent number or article title" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-accent">Type</label>
            <input 
              name="type" 
              value={currentPriorArt.type} 
              onChange={e => setCurrentPriorArt({ ...currentPriorArt, type: e.target.value })} 
              className="w-full px-2 py-2 rounded bg-background border border-primary/30 text-light" 
              placeholder="Patent, Article, etc." 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-accent">Relevance</label>
            <input 
              name="relevance" 
              value={currentPriorArt.relevance} 
              onChange={e => setCurrentPriorArt({ ...currentPriorArt, relevance: e.target.value })} 
              className="w-full px-2 py-2 rounded bg-background border border-primary/30 text-light" 
              placeholder="How it relates to your invention" 
            />
          </div>
        </div>
        <button 
          type="button" 
          onClick={handleAddPriorArt} 
          className="w-full mt-2 px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all"
        >
          Add Reference
        </button>
        <ul className="text-light text-sm space-y-1 mt-2">
          {form.priorArtReferences.length === 0 && <li className="italic text-accent/70">No prior art references added yet</li>}
          {form.priorArtReferences.map((ref, idx) => (
            <li key={idx} className="flex gap-2 items-center">
              <span className="font-semibold">{ref.reference}</span> <span className="text-xs">({ref.type}, {ref.relevance})</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Search for Prior Art</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 px-2 py-2 rounded bg-background border border-primary/30 text-light" 
            placeholder="Enter keywords related to your invention" 
          />
          <button 
            type="button" 
            className="px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );

  const renderClaims = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1 text-accent">Patent Claims</label>
        <div className="flex justify-end mb-2">
          <button 
            type="button" 
            onClick={() => handleAISuggest('claims')} 
            className="px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all" 
            disabled={aiLoading === 'claims'}
          >
            {aiLoading === 'claims' ? 'Generating...' : 'Generate AI Suggestions'}
          </button>
        </div>
        <div className="p-3 bg-primary/10 rounded-lg mb-4">
          <div className="text-sm font-medium text-accent mb-1">Claim Writing Tips</div>
          <ul className="list-disc ml-5 text-sm text-light/80">
            <li>Independent claims should be broad but clear</li>
            <li>Dependent claims should reference parent claims and add specific features</li>
            <li>Each claim should be a single sentence</li>
            <li>Use precise language to describe your invention</li>
          </ul>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-accent">Enter a new claim for your patent application</label>
            <textarea 
              value={currentClaim} 
              onChange={e => setCurrentClaim(e.target.value)} 
              className="w-full px-4 py-3 rounded-lg bg-background border border-primary/30 text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[100px]" 
              placeholder="Enter a new claim to define your invention" 
            />
          </div>
          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={handleAddClaim} 
              className="px-4 py-2 rounded bg-primary text-light text-sm font-semibold shadow hover:bg-primary/80 transition-all"
            >
              Add Claim
            </button>
          </div>
        </div>
        <div className="mt-6">
          <div className="text-sm font-medium text-accent mb-2">Current Claims ({form.claims.length})</div>
          <ul className="text-light text-sm space-y-2">
            {form.claims.length === 0 && (
              <li className="italic text-accent/70 p-3 bg-primary/5 rounded-lg">
                No claims added yet. Add at least one independent claim to define your invention.
              </li>
            )}
            {form.claims.map((c, idx) => (
              <li key={idx} className="p-3 bg-primary/5 rounded-lg">
                <div className="font-semibold mb-1">Claim {idx + 1}:</div>
                <div className="text-light/90">{c.text}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  if (showDocumentGenerator) {
    return (
      <DocumentGenerator 
        formData={form}
        onClose={() => setShowDocumentGenerator(false)}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-primary/20 mt-8 mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-light">Patent Application Wizard</h2>
      </div>
      
      <div className="mb-6">
        <div className="text-sm text-accent mb-2">Completion Progress</div>
        <div className="flex items-center">
          {steps.map((label, idx) => (
            <React.Fragment key={label}>
              <div className={`flex items-center ${idx < step ? 'text-primary' : 'text-accent'} font-semibold`}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${idx <= step ? 'border-primary bg-primary text-light' : 'border-accent bg-background text-accent'}`}>{idx + 1}</div>
                <span className="ml-2 text-sm hidden sm:inline">{label}</span>
              </div>
              {idx < steps.length - 1 && <div className="flex-1 h-1 mx-2 bg-primary/30 rounded" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <form onSubmit={handleFinish} className="space-y-6">
        {step === 0 && renderBasicInfo()}
        {step === 1 && renderDetailedDescription()}
        {step === 2 && renderPriorArt()}
        {step === 3 && renderClaims()}

        <div className="flex justify-between pt-4">
          <button 
            type="button" 
            onClick={handlePrev} 
            disabled={step === 0} 
            className="px-6 py-2 rounded-lg font-semibold bg-white/10 text-light border border-primary/20 hover:bg-primary/10 transition-all disabled:opacity-50"
          >
            Previous
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
              className="px-6 py-2 rounded-lg font-semibold bg-primary text-light shadow hover:shadow-primary/30 transition-all"
            >
              Finish
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default PatentWizard; 