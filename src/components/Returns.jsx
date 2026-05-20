import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataModal from './DataModal';

const Returns = () => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  return (
    <div className="bg-[#111] text-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto p-8 pt-20 pb-20">
        
        {/* Header Section */}
        <div className="text-center mb-16 border-b border-gray-800 pb-10 relative">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-4">Returns & Refunds</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Not happy with your order? No worries. We make the returns process smooth and transparent for you.
          </p>

          <button
            onClick={() => setIsSupportOpen(true)}
            className="absolute top-0 right-0 bg-gradient-to-r from-[#00bcd4] to-[#0097a7] text-white px-7 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(0,188,212,0.4)] hover:shadow-[0_0_25px_rgba(0,188,212,0.7)] hover:scale-105 transition-all duration-300"
        >
         Support
       </button>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-10">
          
          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 hover:border-[#00bcd4] transition-all shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-3">30-Day Policy</h3>
            <p className="text-gray-300 leading-relaxed">
              We offer a <span className="font-bold">30-day return window</span> from the date of delivery. If 30 days have passed, unfortunately, we cannot offer a refund or exchange.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 hover:border-[#00bcd4] transition-all shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-3">Condition of Items</h3>
            <p className="text-gray-300 leading-relaxed">
              To be eligible for a return, your item must be <span className="font-bold">unused and in the same condition</span> that you received it, including the original packaging.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 hover:border-[#00bcd4] transition-all shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-3">Refund Process</h3>
            <p className="text-gray-300 leading-relaxed">
              Once your return is received and inspected, we will notify you. Your refund will be processed and applied to your <span className="font-bold">original payment method</span> within 5-7 business days.
            </p>
          </div>

          <div className="bg-[#1a1a1a] p-8 rounded-2xl border border-gray-800 hover:border-[#00bcd4] transition-all shadow-xl">
            <h3 className="text-2xl font-semibold text-white mb-3">Shipping Returns</h3>
            <p className="text-gray-300 leading-relaxed">
              You will be responsible for paying your own shipping costs for returning your item. Shipping costs are <span className="font-bold text-red-400">non-refundable</span>.
            </p>
          </div>
          
        </div>

        {/* Contact Support */}
        <div className="mt-20 text-center border-t border-gray-800 pt-10">
          <p className="text-gray-500">Ready to initiate a return? Reach out to our <Link to="/contact" className="text-[#00bcd4] hover:underline">Support Team</Link> to get started.</p>
        </div>

      </div>

      {/* ✅ DataModal */}
      <DataModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
};

export default Returns;