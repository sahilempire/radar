import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background to-gray-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Simplifying IP Protection for Everyone
            </h2>
            <p className="text-gray-300 mb-8">
              Our platform revolutionizes the way you protect your intellectual property. 
              With AI-powered assistance, we make trademark, patent, and copyright filings 
              accessible, affordable, and efficient for businesses of all sizes.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-gray-300">Reduce filing errors with AI assistance</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-gray-300">Save time with automated document analysis</span>
              </div>
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <span className="text-gray-300">Track your filings in real-time</span>
              </div>
            </div>
            <Link to="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-3 rounded-lg font-semibold bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-primary/30 transition-all duration-300"
              >
                Start Protecting Your IP
              </motion.button>
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl transform rotate-3"></div>
            <div className="relative bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="w-24 h-24 bg-primary/20 rounded-xl"></div>
                  <div className="w-24 h-24 bg-accent/20 rounded-xl"></div>
                </div>
                <div className="h-32 bg-gray-700/50 rounded-xl"></div>
                <div className="flex items-center justify-between">
                  <div className="w-32 h-8 bg-primary/20 rounded-lg"></div>
                  <div className="w-16 h-8 bg-accent/20 rounded-lg"></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection; 