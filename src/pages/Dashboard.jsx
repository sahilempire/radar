import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const filingTypes = [
  {
    key: 'patent',
    label: 'Patent Filing',
    desc: 'Protect your inventions, processes, or unique technological solutions',
    features: [
      'Utility Patents',
      'Design Patents',
      'Provisional Applications',
      'International PCT Filings'
    ],
    icon: (
      <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M12 15l-3-3m0 0l3-3m-3 3h12m-2-3v6m5-4v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7" />
        <circle cx="18" cy="6" r="3" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M18 3v6M15 6h6" />
      </svg>
    ),
  },
  {
    key: 'trademark',
    label: 'Trademark Filing',
    desc: 'Protect your brand names, logos, slogans, and other business identifiers',
    features: [
      'Word Marks',
      'Logo Marks',
      'Service Marks',
      'International Madrid Protocol'
    ],
    icon: (
      <svg className="w-12 h-12 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M7 7h10M7 11h10M7 15h6" />
        <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
          d="M16 15h2m-1-1.5v3" />
        <path strokeLinecap="round" strokeWidth="2" 
          d="M19.5 13.5c-.5 0-1 .5-1 1s.5 1 1 1" />
      </svg>
    ),
  },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-2xl" />
      </div>

      {/* Main content */}
      <div className="relative container mx-auto px-4 py-12 md:py-16">
        {/* Header section */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
            Welcome to Radar
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Your AI-powered assistant for intellectual property filings
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-4xl mx-auto">
          {filingTypes.map((type) => (
            <div
              key={type.key}
              className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 transition-all duration-300"
            >
              {/* Card header */}
              <div className="mb-2">
                <h2 className="text-xl font-semibold text-gray-900">{type.label}</h2>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-500 mb-6">{type.desc}</p>

              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary/10 rounded-full">
                  {type.icon}
                </div>
              </div>

              {/* Features list */}
              <ul className="space-y-2 mb-6">
                {type.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-gray-600">
                    <svg className="w-2 h-2 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="4" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Action button */}
              <button
                onClick={() => navigate(`/dashboard/${type.key}`)}
                className={`w-full py-2 px-4 text-sm rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                  type.key === 'trademark'
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'bg-primary text-white hover:bg-primary/90'
                }`}
              >
                Start {type.label} Process
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 