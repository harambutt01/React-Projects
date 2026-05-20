import React from 'react';
import { Link } from 'react-router-dom';


const PrivacyPolicy = () => {
  return (
    <div className="bg-[#111] text-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto p-8 pt-20 pb-20">
        
        {/* Header Section */}
        <div className="text-center mb-16 border-b border-gray-800 pb-10">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            At <span className="text-[#00bcd4]">Trendora</span>, we respect your privacy. This policy details how we handle, use, and protect your valuable information.
          </p>
        </div>

        {/* Introduction */}
        <div className="bg-[#1a1a1a] p-10 rounded-2xl border border-gray-800 shadow-xl mb-10 leading-relaxed text-gray-300">
          <p>
            This Privacy Policy governs the manner in which Trendora collects, uses, maintains, and discloses information collected from users of the website. This policy applies to the site and all products and services offered by Trendora. We are committed to ensuring your privacy is protected.
          </p>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-10">
          
          <div className="border-l-4 border-[#00bcd4] pl-8 py-2">
            <h3 className="text-2xl font-bold text-white mb-3">1. Information Collection</h3>
            <p className="text-gray-300 leading-relaxed">
              We collect personal information <span className="font-medium text-white">(such as name, email address, shipping details)</span> only when voluntarily provided by users. For example, during account creation, newsletter subscription, or checkout.
            </p>
          </div>

          <div className="border-l-4 border-[#00bcd4] pl-8 py-2">
            <h3 className="text-2xl font-bold text-white mb-3">2. How We Use Your Data</h3>
            <p className="text-gray-300 leading-relaxed">
              Your information helps us to efficiently process transactions, provide personalized support, improve our services, and keep you updated on orders or promotional offers <span className="font-medium text-white">(only if you've subscribed)</span>.
            </p>
          </div>

          <div className="border-l-4 border-[#00bcd4] pl-8 py-2">
            <h3 className="text-2xl font-bold text-white mb-3">3. Data Protection</h3>
            <p className="text-gray-300 leading-relaxed">
              We implement industry-standard security measures, including <span className="font-medium text-white">SSL encryption</span>, to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is safe with us.
            </p>
          </div>

          <div className="border-l-4 border-[#00bcd4] pl-8 py-2">
            <h3 className="text-2xl font-bold text-white mb-3">4. Third-Party Services</h3>
            <p className="text-gray-300 leading-relaxed">
              We <span className="font-bold text-red-400">DO NOT</span> sell or trade your data. We only share essential information with trusted partners <span className="font-medium text-white">(e.g., shipping carriers, payment processors)</span> solely to fulfill your orders and services.
            </p>
          </div>
          
        </div>

        {/* Footer Support Message */}
        <div className="mt-20 text-center border-t border-gray-800 pt-10">
          <p className="text-gray-500">By using our site, you consent to our privacy policy. Questions? Contact our <Link to="/contact" className="text-[#00bcd4] hover:underline">Privacy Team</Link>.</p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicy;