import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between py-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/">
            <div className="flex items-center">
              <span className="text-[#C67B49] text-3xl font-bold">R</span>
              <span className="text-2xl font-medium ml-2">Radar</span>
            </div>
          </Link>
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

      {/* Privacy Policy Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link to="/" className="inline-flex items-center text-[#C67B49] mb-6 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="mb-8">
          <p className="text-gray-600 mb-1">Effective Date: January 1, 2025</p>
          <p className="text-gray-600">Last Updated: December 15, 2024</p>
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            NeuralArc Radar ("Company", "we", "us", or "our") operates the website https://radar.neuralarc.ai ("Site") 
            and is committed to protecting the privacy and security of our users' personal data. This Privacy Policy 
            outlines the types of information we collect, how it is used, shared, stored, and your rights regarding your data.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Information We Collect</h2>
          <h3 className="text-lg font-medium mt-6 mb-3">1.1 Personal Information</h3>
          <p>
            We collect personally identifiable information that you voluntarily provide when you:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Register for an account</li>
            <li>Subscribe to updates or newsletters</li>
            <li>Interact with AI tools or dashboards</li>
            <li>Contact our support team</li>
          </ul>
          <p>This may include:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Full name</li>
            <li>Email address</li>
            <li>Organization name</li>
            <li>Job title</li>
            <li>Uploaded documents and user prompts</li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-3">1.2 Automatically Collected Information</h3>
          <p>
            When you visit the Site, we automatically collect data including:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>IP address</li>
            <li>Device identifiers</li>
            <li>Browser type and version</li>
            <li>Time zone and location</li>
            <li>Access times and referring URLs</li>
            <li>Page views and site navigation paths</li>
          </ul>

          <h3 className="text-lg font-medium mt-6 mb-3">1.3 AI Interaction Data</h3>
          <p>
            We may store prompts, generated outputs, feedback, and usage patterns for the following purposes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Improving AI model accuracy and relevance</li>
            <li>Monitoring for abuse or harmful content</li>
            <li>Conducting internal audits or diagnostics</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. Use of Information</h2>
          <p>Your data is used to:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide and maintain our services</li>
            <li>Enable account access and user authentication</li>
            <li>Deliver personalized content and suggestions</li>
            <li>Enhance, improve, and debug platform functionality</li>
            <li>Monitor compliance with our Terms of Use</li>
            <li>Communicate with you (transactional and marketing emails)</li>
            <li>Comply with legal obligations and enforce rights</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Legal Basis for Processing (EU/UK Users)</h2>
          <p>We process your data on the following legal bases:</p>
          <ul className="list-disc pl-6 mb-4">
            <li><strong>Consent:</strong> When you provide us information voluntarily.</li>
            <li><strong>Contract:</strong> When processing is necessary to provide the services you've signed up for.</li>
            <li><strong>Legitimate Interest:</strong> For purposes such as analytics, platform improvement, or fraud prevention.</li>
            <li><strong>Legal Obligation:</strong> When required to comply with applicable laws.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Sharing and Disclosure</h2>
          <p>
            We do not sell or rent personal information. We may share information with:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Service providers (e.g., hosting, analytics, cloud AI services) under confidentiality agreements</li>
            <li>Legal authorities in compliance with legal processes or to enforce our rights</li>
            <li>Corporate affiliates or acquirers in the context of a business transaction, such as a merger or acquisition</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Data Retention</h2>
          <p>
            We retain your personal data only for as long as necessary to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Provide services to you</li>
            <li>Comply with our legal obligations</li>
            <li>Resolve disputes</li>
            <li>Enforce our agreements</li>
          </ul>
          <p>
            AI interaction logs may be retained in anonymized form for performance improvements, unless deletion is requested.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Your Rights and Choices</h2>
          <p>
            Depending on your jurisdiction, you may have rights to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Access your personal data</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of data</li>
            <li>Object to or restrict processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent (where applicable)</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at legal@neuralarc.ai.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Cookies and Tracking</h2>
          <p>
            We use cookies and similar technologies to:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Enhance user experience</li>
            <li>Analyze site usage</li>
            <li>Store user preferences</li>
          </ul>
          <p>
            You can control cookie preferences via your browser settings.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">8. Data Security</h2>
          <p>
            We implement administrative, technical, and physical safeguards to protect your data. These include:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>End-to-end encryption</li>
            <li>Secure access controls</li>
            <li>Regular audits and monitoring</li>
          </ul>
          <p>
            No system is 100% secure, so we encourage users to use strong passwords and report any suspicious activity.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">9. International Data Transfers</h2>
          <p>
            Your information may be transferred to and stored on servers outside your country. Where required, we implement 
            standard contractual clauses or other legal safeguards for international data transfers.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">10. Changes to this Policy</h2>
          <p>
            We may update this Privacy Policy periodically. Updates will be posted on this page with a revised "Effective Date." 
            We encourage you to review the policy regularly.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">11. Contact Us</h2>
          <p>
            If you have any questions or requests regarding this Privacy Policy:
          </p>
          <ul className="list-none mb-4">
            <li><strong>Email:</strong> legal@neuralarc.ai</li>
            <li><strong>Address:</strong> 123 Innovation Way, Tech City, CA 94101</li>
            <li><strong>Data Protection Officer:</strong> privacy@neuralarc.ai</li>
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

export default Privacy; 