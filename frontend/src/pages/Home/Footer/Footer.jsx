import React from 'react';

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-[#1a1a1a] to-[#2c3e50] text-white py-8 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">

          {/* Brand / Copyright */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold mb-2">DalBhaat</h3>
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} DalBhaat. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-8">
            <a
              href="/contact"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              Contact Us
            </a>
            <a
              href="/faq"
              className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
            >
              FAQ
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
