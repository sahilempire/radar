import React from 'react';
import { Link } from 'react-router-dom';
import logoHorizontal from '../assests/logo-horizontal.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src={logoHorizontal} alt="Radar Logo" className="h-8 w-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-4">IP Protection Made Simple</h3>
            <p className="mb-4">
              Streamline your trademark, patent, and copyright filings with our AI-powered platform.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} IP Protection Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const MinimalFooter = () => (
  <footer className="bg-white border-t border-[#f2e6dd] py-6 text-center text-xs w-full">
    <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-center">
      <Link to="/terms" className="hover:text-[#C67B49] text-[#C67B49] transition-colors">Terms of Use</Link>
      <span className="text-[#C67B49]">•</span>
      <Link to="/privacy" className="hover:text-[#C67B49] text-[#C67B49] transition-colors">Privacy Policy</Link>
      <span className="text-[#C67B49]">•</span>
      <Link to="/responsible-ai" className="hover:text-[#C67B49] text-[#C67B49] transition-colors">Responsible AI</Link>
      <span className="text-[#C67B49]">•</span>
      <span className="text-gray-500 text-sm">
  Copyright {new Date().getFullYear()}. All rights reserved.
  <span className="font-semibold text-[#C67B49]"> Radar</span>, A thing by <a href='https://www.neuralarc.ai/'>
  <span className="font-semibold text-[#000000]"> NeuralArc</span>
  <svg
    width="25"
    height="15"
    viewBox="0 0 82 40"
    className="inline-block ml-1 align-middle"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fillRule="evenodd" clipRule="evenodd" d="M15.342 15.5017C15.9509 14.9039 15.5529 13.8653 14.7016 13.8306L0.932487 13.2706C0.41149 13.2494 2.15803e-06 12.8195 2.05852e-06 12.2964L0 1.47501C-1.02433e-07 0.93653 0.435114 0.500008 0.971853 0.500007L37.9022 0.5C38.439 0.5 38.8741 0.936524 38.8741 1.475L38.8741 38.525C38.8741 39.0635 38.439 39.5 37.9022 39.5H27.387C26.8578 39.5 26.4259 39.0753 26.4153 38.5445L26.1527 25.3895C26.1356 24.5314 25.1015 24.1125 24.4953 24.7181L15.2565 33.947C14.8801 34.323 14.2724 34.3261 13.8922 33.9539L5.91804 26.1492C5.52754 25.767 5.52706 25.1373 5.91699 24.7545L15.342 15.5017Z" fill="#8F877B" />
    <path d="M69.226 22.3866L69.2249 22.3855V19.4552C69.2249 16.0186 66.3289 13.2327 62.7566 13.2327C59.1843 13.2327 56.2884 16.0186 56.2884 19.4552V38.525C56.2884 39.0635 55.8533 39.5 55.3165 39.5H44.0978C43.561 39.5 43.1259 39.0635 43.1259 38.525V1.475C43.1259 0.936524 43.561 0.5 44.0978 0.5H68.2264C68.7631 0.5 69.1982 0.936522 69.1982 1.475V5.4327C69.1982 9.74052 72.6791 13.2327 76.973 13.2327H81.0281C81.5649 13.2327 82 13.6692 82 14.2077V38.525C82 39.0635 81.5649 39.5 81.0281 39.5H70.1989C69.6622 39.5 69.2271 39.0635 69.2271 38.525V22.3877L69.226 22.3866Z" fill="#2F2C28" />
  </svg>
  </a>
</span>


    </div>
  </footer>
);

export { Footer, MinimalFooter }; 