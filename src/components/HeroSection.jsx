import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import logoHorizontal from '../assests/logo-horizontal.png';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-background">
      {/* Navbar */}
      <nav className="absolute top-0 left-0 w-full flex items-center justify-between px-8 py-6 z-20 bg-transparent border-b border-primary/10">
        <div className="flex items-center gap-4 min-w-0">
          <img src={logoHorizontal} alt="Radar Logo" className="h-10 w-auto" />
        </div>
        <div className="flex items-center gap-2">
          <Link to="/signin" className="text-light/80 hover:text-light font-medium px-4 py-2 rounded transition whitespace-nowrap">Sign In</Link>
          <Link to="/signup">
            <button className="px-6 py-2 rounded-lg font-semibold bg-primary text-light shadow hover:shadow-primary/30 transition-all duration-200 whitespace-nowrap">Get Started</button>
          </Link>
        </div>
      </nav>
      {/* Hero Background */}
      <div className="absolute inset-0">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-black to-primary/40" />
        {/* Soft blurred copper highlight behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/30 rounded-full blur-3xl opacity-70 pointer-events-none" />
        {/* Optional: very subtle grid overlay for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#b4846510_1px,transparent_1px),linear-gradient(to_bottom,#b4846510_1px,transparent_1px)] bg-[size:32px_32px] opacity-30" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          {/* Animated Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-light mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
                Protect Your Ideas
              </span>
              <br />
              <span className="text-light">With AI-Powered IP Solutions</span>
            </h1>
          </motion.div>

          {/* Animated Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg md:text-xl text-accent mb-12 max-w-2xl mx-auto"
          >
            Streamline your trademark, patent, and copyright filings with our intelligent platform.
            Get higher accuracy and faster approvals with AI assistance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold bg-primary text-light shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                Get Started Free
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-12 flex flex-wrap justify-center gap-8 text-accent"
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>AI-Powered Accuracy</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Secure & Compliant</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 text-primary mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 