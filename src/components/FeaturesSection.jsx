import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, DocumentTextIcon, CreditCardIcon } from '@heroicons/react/24/outline';

const features = [
  {
    title: 'AI-Powered Compliance Check',
    description: 'Our advanced AI system ensures your filings meet all legal requirements, reducing rejection risks.',
    icon: CheckCircleIcon,
  },
  {
    title: 'Easy Document Management',
    description: 'Upload and analyze documents with our intuitive drag-and-drop interface. Get instant feedback on your submissions.',
    icon: DocumentTextIcon,
  },
  {
    title: 'Secure Payment Processing',
    description: 'Safe and seamless payment processing for all your filing submissions with multiple payment options.',
    icon: CreditCardIcon,
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Powerful Features for Your IP Protection
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Streamline your intellectual property filings with our comprehensive suite of tools and AI assistance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700 hover:border-primary transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 