import React, { useState } from 'react';
import logoStacked from '../assests/logo-stacked.png';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';

const SignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  // const navigate = useNavigate(); // No redirect on sign up

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError('All fields are required.');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: { data: { name: form.name } },
    });
    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true); // Show confirmation message
    }
  };

  const handleOAuth = async (provider) => {
    setLoading(true);
    setError('');
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    });
    setLoading(false);
    if (oauthError) setError(oauthError.message);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-gray-800 px-4">
      <img src={logoStacked} alt="Radar Logo" className="h-20 w-auto mb-8" />
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-[#C67B49]/20">
        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Radar Account</h1>
        {success ? (
          <div className="text-green-500 text-center mb-4">
            Account created! Please check your email to confirm your account before logging in.
          </div>
        ) : (
          <>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Full Name</label>
                <input name="name" type="text" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-[#C67B49]/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C67B49]/60 transition" placeholder="Your Name" value={form.name} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Email</label>
                <input name="email" type="email" className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-[#C67B49]/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C67B49]/60 transition" placeholder="you@email.com" value={form.email} onChange={handleChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Password</label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-[#C67B49]/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C67B49]/60 transition"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      // Eye-off SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.338 7.24 19.5 12 19.5c1.658 0 3.237-.336 4.646-.94m3.374-2.14A10.45 10.45 0 0022.066 12c-1.292-4.337-5.306-7.5-10.066-7.5-1.272 0-2.496.192-3.646.547m7.646 6.953a3 3 0 11-4.242-4.242m4.242 4.242L3 3" />
                      </svg>
                    ) : (
                      // Eye SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.226 7.662 7.24 4.5 12 4.5c4.76 0 8.774 3.162 9.964 7.183.07.234.07.486 0 .72C20.774 16.338 16.76 19.5 12 19.5c-4.76 0-8.774-3.162-9.964-7.183z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-600">Confirm Password</label>
                <div className="relative">
                  <input
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className="w-full px-4 py-3 pr-12 rounded-lg bg-gray-50 border border-[#C67B49]/30 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C67B49]/60 transition"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? (
                      // Eye-off SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12.001C3.226 16.338 7.24 19.5 12 19.5c1.658 0 3.237-.336 4.646-.94m3.374-2.14A10.45 10.45 0 0022.066 12c-1.292-4.337-5.306-7.5-10.066-7.5-1.272 0-2.496.192-3.646.547m7.646 6.953a3 3 0 11-4.242-4.242m4.242 4.242L3 3" />
                      </svg>
                    ) : (
                      // Eye SVG
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.226 7.662 7.24 4.5 12 4.5c4.76 0 8.774 3.162 9.964 7.183.07.234.07.486 0 .72C20.774 16.338 16.76 19.5 12 19.5c-4.76 0-8.774-3.162-9.964-7.183z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error && <div className="text-red-500 text-sm text-center">{error}</div>}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg font-semibold bg-[#C67B49] text-white shadow hover:shadow-[#C67B49]/30 transition-all duration-200 mt-2 disabled:opacity-60">{loading ? 'Creating Account...' : 'Create Account'}</button>
            </form>
            <div className="my-6 flex items-center gap-2">
              <div className="flex-1 h-px bg-[#C67B49]/30" />
              <span className="text-xs text-gray-500">or sign up with</span>
              <div className="flex-1 h-px bg-[#C67B49]/30" />
            </div>
            <div className="flex justify-center mb-4">
              <button
                onClick={() => handleOAuth('google')}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-gray-50 border border-[#C67B49]/40 text-gray-800 font-semibold shadow hover:bg-[#C67B49]/10 hover:text-[#C67B49] hover:border-[#C67B49] transition-all duration-200 text-base"
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48' className="w-5 h-5"><g><path fill="#4285F4" d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.87-6.87C35.64 2.39 30.18 0 24 0 14.82 0 6.73 5.48 2.69 13.44l8.01 6.22C12.33 13.13 17.68 9.5 24 9.5z"/><path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.65 7.01l7.19 5.6C43.98 37.13 46.1 31.36 46.1 24.55z"/><path fill="#FBBC05" d="M10.7 28.66c-1.01-2.99-1.01-6.23 0-9.22l-8.01-6.22C.68 17.82 0 20.81 0 24c0 3.19.68 6.18 1.89 8.78l8.81-6.89z"/><path fill="#EA4335" d="M24 48c6.18 0 11.36-2.05 15.15-5.57l-7.19-5.6c-2.01 1.35-4.59 2.15-7.96 2.15-6.32 0-11.67-3.63-13.3-8.66l-8.81 6.89C6.73 42.52 14.82 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></g></svg>
                <span>Sign up with Google</span>
              </button>
            </div>
            <div className="flex justify-between items-center text-sm">
              <Link to="/signin" className="text-[#C67B49] hover:underline">Already have an account?</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SignUp; 