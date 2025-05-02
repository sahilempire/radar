import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';

const Terms = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between py-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <span className="text-[#C67B49] text-3xl font-bold">R</span>
          <span className="text-2xl font-medium ml-2">Radar</span>
        </div>
        <div className="flex gap-4">
          <Link to="/signin">
            <button className="border border-[#C67B49] text-[#C67B49] hover:bg-[#C67B49]/5 px-4 py-2 rounded-lg font-medium transition-colors">
              Sign In
            </button>
          </Link>
          <Link to="/signup">
            <button className="bg-[#C67B49] hover:bg-[#C67B49]/90 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors">
              Get Started
            </button>
          </Link>
        </div>
      </nav>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-[#C67B49] mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Terms of Use</h1>
        <div className="mb-8">
          <p className="text-gray-600 mb-1">Effective Date: January 1, 2025</p>
          <p className="text-gray-600">Last Updated: December 15, 2024</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Please read these Terms of Use ("Terms") carefully before using the NeuralArc Radar website 
            and services operated by NeuralArc ("us", "we", or "our").
          </p>
          
          <p>
            Your access to and use of the service is conditioned on your acceptance of and compliance with 
            these Terms. These Terms apply to all visitors, users, and others who access or use the service.
          </p>
          
          <p>
            By accessing or using the service, you agree to be bound by these Terms. If you disagree 
            with any part of the terms, you may not access the service.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">1. Use of the Service</h2>
          <p>
            NeuralArc Radar provides an AI-powered platform for intellectual property management, 
            including trademark, patent, and copyright filings. By using our service, you agree to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide accurate and complete information when registering and using the service</li>
            <li>Maintain the security of your account credentials</li>
            <li>Use the service in compliance with all applicable laws and regulations</li>
            <li>Not attempt to interfere with or disrupt the service or servers</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">2. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are and will remain the 
            exclusive property of NeuralArc and its licensors. The service is protected by copyright, 
            trademark, and other laws of both the United States and foreign countries.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">3. User Content</h2>
          <p>
            You retain all rights to any content you submit, post, or display on or through the service. 
            By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, 
            reproduce, modify, and display such content on our service, subject to our Privacy Policy.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">4. Limitation of Liability</h2>
          <p>
            In no event shall NeuralArc, its directors, employees, partners, agents, suppliers, or affiliates 
            be liable for any indirect, incidental, special, consequential, or punitive damages, including 
            without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Your access to or use of or inability to access or use the service</li>
            <li>Any conduct or content of any third party on the service</li>
            <li>Any content obtained from the service</li>
            <li>Unauthorized access, use, or alteration of your transmissions or content</li>
          </ul>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">5. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
            We will provide notice of any changes by posting the new Terms on this page. You are advised 
            to review these Terms periodically for any changes.
          </p>
          
          <h2 className="text-xl font-semibold mt-8 mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at:
          </p>
          <ul className="list-none mb-4">
            <li><strong>Email:</strong> legal@neuralarc.ai</li>
            <li><strong>Address:</strong> 123 Innovation Way, Tech City, CA 94101</li>
          </ul>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#222222] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div className="flex flex-col items-start mb-6 md:mb-0">
              <div className="flex items-center">
                <span className="text-[#C67B49] text-3xl font-bold">R</span>
                <span className="text-2xl font-medium ml-2">Radar</span>
                <span className="ml-4 px-2 py-0.5 text-xs border border-white/30 rounded">BETA</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">IP Protection Made Simple</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-6 pb-4">
            <div className="flex flex-col md:flex-row justify-start items-start gap-2 md:gap-6 mb-8">
              <Link to="/terms" className="text-sm text-gray-400 hover:text-white">Terms of Use</Link>
              <span className="hidden md:inline text-gray-500">•</span>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">Privacy Policy</Link>
              <span className="hidden md:inline text-gray-500">•</span>
              <Link to="/responsible-ai" className="text-sm text-gray-400 hover:text-white">Responsible AI</Link>
            </div>
            <div>
              <p className="text-gray-400 text-sm">
                Copyright 2025. All rights reserved. Radar, A thing by 
                <span className="ml-1 opacity-70">NEURAL PATHS</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Terms; 