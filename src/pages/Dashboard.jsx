import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';

const filingTypes = [
  {
    key: 'trademark',
    label: 'Trademark Filing',
    desc: 'Protect your brand identity.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m-7-7a9 9 0 1114 0v7H5v-7z" /></svg>
    ),
  },
  {
    key: 'patent',
    label: 'Patent Filing',
    desc: 'Safeguard your inventions.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} /></svg>
    ),
  },
  {
    key: 'copyright',
    label: 'Copyright Filing',
    desc: 'Secure your creative works.',
    icon: (
      <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2} /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 9a3 3 0 00-6 0v6a3 3 0 006 0V9z" /></svg>
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
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle background effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-2xl" />
      </div>
      <div className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 py-10">
        <div className="w-full max-w-3xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-10 border border-primary/10">
          <h1 className="text-3xl font-bold mb-2 text-background">Welcome{user ? `, ${user.user_metadata?.name || user.email}` : ''}!</h1>
          <p className="text-primary mb-8">What would you like to file today?</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filingTypes.map((type) => (
              <button
                key={type.key}
                onClick={() => navigate(`/dashboard/${type.key}`)}
                className="group rounded-2xl p-8 bg-white border border-primary/10 shadow-lg hover:bg-primary/10 hover:border-primary transition-all flex flex-col items-center gap-4 text-center focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="mb-2 group-hover:scale-110 transition-transform">{type.icon}</div>
                <span className="text-lg font-semibold text-background group-hover:text-primary transition-colors">{type.label}</span>
                <span className="text-sm text-primary">{type.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 