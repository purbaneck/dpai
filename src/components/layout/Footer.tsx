import React from 'react';
import { Shield } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="ml-2 text-lg font-semibold text-gray-900">DPIA Tool</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:space-x-8 text-center md:text-left">
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 mb-2 md:mb-0">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 mb-2 md:mb-0">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-blue-600 mb-2 md:mb-0">
              Contact Us
            </a>
          </div>
          
          <div className="text-sm text-gray-500 mt-4 md:mt-0">
            &copy; {new Date().getFullYear()} DPIA Tool. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
