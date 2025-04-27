import React, { useState } from 'react';

const filingFields = {
  trademark: [
    { name: 'markName', label: 'Mark Name', type: 'text', ai: false },
    { name: 'classification', label: 'Classification Code', type: 'text', ai: true },
    { name: 'description', label: 'Description', type: 'textarea', ai: true },
    { name: 'owner', label: 'Owner Name', type: 'text', ai: false },
  ],
  patent: [
    { name: 'title', label: 'Title', type: 'text', ai: true },
    { name: 'abstract', label: 'Abstract', type: 'textarea', ai: true },
    { name: 'inventor', label: 'Inventor Name', type: 'text', ai: false },
  ],
  copyright: [
    { name: 'workTitle', label: 'Work Title', type: 'text', ai: true },
    { name: 'author', label: 'Author Name', type: 'text', ai: false },
    { name: 'workType', label: 'Type of Work', type: 'select', ai: false, options: ['Literary', 'Musical', 'Artistic', 'Other'] },
  ],
};

const FilingForm = ({ type, onClose }) => {
  const [form, setForm] = useState({});
  const [aiLoading, setAiLoading] = useState(null);

  const fields = filingFields[type] || [];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Placeholder AI suggestion function
  const handleAISuggest = async (field) => {
    setAiLoading(field.name);
    // Simulate AI suggestion delay
    setTimeout(() => {
      setForm((prev) => ({ ...prev, [field.name]: `AI Suggested ${field.label}` }));
      setAiLoading(null);
    }, 1200);
  };

  return (
    <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-primary/20 mt-8 mx-auto">
      <h2 className="text-xl font-bold mb-6 text-light capitalize">{type} Filing Application</h2>
      <form className="space-y-5">
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1 text-accent">{field.label}</label>
            {field.type === 'textarea' ? (
              <div className="relative">
                <textarea
                  name={field.name}
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-24 rounded-lg bg-background border border-primary/30 text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition min-h-[80px]"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                {field.ai && (
                  <button
                    type="button"
                    onClick={() => handleAISuggest(field)}
                    className="absolute right-3 top-3 px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all"
                    disabled={aiLoading === field.name}
                  >
                    {aiLoading === field.name ? 'Suggesting...' : 'AI Suggest'}
                  </button>
                )}
              </div>
            ) : field.type === 'select' ? (
              <select
                name={field.name}
                value={form[field.name] || ''}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-background border border-primary/30 text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
              >
                <option value="">Select {field.label}</option>
                {field.options.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            ) : (
              <div className="relative">
                <input
                  name={field.name}
                  type="text"
                  value={form[field.name] || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-24 rounded-lg bg-background border border-primary/30 text-light focus:outline-none focus:ring-2 focus:ring-primary/60 transition"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
                {field.ai && (
                  <button
                    type="button"
                    onClick={() => handleAISuggest(field)}
                    className="absolute right-3 top-2 px-3 py-1 rounded bg-primary text-light text-xs font-semibold shadow hover:bg-primary/80 transition-all"
                    disabled={aiLoading === field.name}
                  >
                    {aiLoading === field.name ? 'Suggesting...' : 'AI Suggest'}
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg font-semibold bg-white/10 text-light border border-primary/20 hover:bg-primary/10 transition-all">Cancel</button>
          <button type="submit" className="px-6 py-2 rounded-lg font-semibold bg-primary text-light shadow hover:shadow-primary/30 transition-all">Submit Filing</button>
        </div>
      </form>
    </div>
  );
};

export default FilingForm; 