import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'react-feather';
import logoHorizontal from '../assests/logo-horizontal.png';

const ResponsibleAI = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between py-6 px-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link to="/">
            <img src={logoHorizontal} alt="Radar Logo" className="h-14 w-auto" />
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

      {/* Responsible AI Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
          <span className="inline-flex items-center">
            <span className="text-[#C67B49] mr-2"></span> Responsible AI Disclaimer
          </span>
        </h1>

        <div className="prose prose-lg max-w-none">
          <p>
            NeuralArc Radar incorporates artificial intelligence technologies designed to assist users in generating, 
            analyzing, and synthesizing information. While we are committed to building transparent, fair, and secure AI, 
            we acknowledge the limitations and risks associated with AI use.
          </p>

          <h2 className="text-xl font-semibold mt-8 mb-4">1. Nature of AI Outputs</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              The content generated through NeuralArc Radar is machine-produced and may include factual errors, 
              outdated information, or algorithmic bias.
            </li>
            <li>
              AI-generated outputs do not constitute legal, medical, financial, or other professional advice.
            </li>
            <li>
              Users must independently verify critical information and assume responsibility for its application.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">2. User Obligations</h2>
          <p>By using the platform, you agree:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Not to rely solely on AI outputs for high-stakes decisions.</li>
            <li>Not to input or request generation of unlawful, discriminatory, hateful, or harmful content.</li>
            <li>To use the system ethically, in line with applicable laws and company policies.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">3. Transparency and Fairness</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Our AI models are trained on a combination of licensed and publicly available datasets.</li>
            <li>We continuously monitor system behavior to mitigate harmful biases and unfair outputs.</li>
            <li>Despite safeguards, we cannot guarantee complete objectivity or neutrality in results.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">4. Data Usage and Model Training</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>
              AI prompt data may be reviewed in aggregate and in anonymized form to improve functionality and performance.
            </li>
            <li>
              We do not use your private business documents or identifiable personal data to train publicly available 
              models without consent.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">5. Limitations and Human Oversight</h2>
          <ul className="list-disc pl-6 mb-4">
            <li>NeuralArc Radar is an assistive tool, not a replacement for human judgment.</li>
            <li>
              Users must ensure outputs comply with applicable laws, industry regulations, and internal company 
              policies before acting on them.
            </li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">6. Disclaimer of Liability</h2>
          <p>NeuralArc Radar and its parent company disclaim all liability arising from:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Reliance on AI-generated content for decision-making</li>
            <li>Errors or omissions in outputs</li>
            <li>Consequences of misuse of the platform or violation of ethical AI principles</li>
          </ul>

          <h2 className="text-xl font-semibold mt-8 mb-4">7. Feedback and Ethical Concerns</h2>
          <p>We welcome feedback on AI behavior, including reporting:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Harmful or biased outputs</li>
            <li>Inaccurate or hallucinated information</li>
            <li>Violations of responsible AI use</li>
          </ul>
          <p>
            Contact us at <a href="mailto:ethics@neuralarc.ai" className="text-[#C67B49] hover:underline">ethics@neuralarc.ai</a> for any responsible AI-related concerns.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#222222] text-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start mb-10">
            <div className="flex flex-col items-start mb-6 md:mb-0">
              <div className="flex items-center">
                <img src={logoHorizontal} alt="Radar Logo" className="h-14 w-auto" />
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
                <span className="ml-1 opacity-70">NEURALARC</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ResponsibleAI; 