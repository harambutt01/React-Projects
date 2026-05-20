import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DataModal from './DataModal';
import { useTheme } from "./ThemeContext";

const Returns = () => {
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const { isDark } = useTheme();

  // Theme-aware dynamic styles
  const bgColor = isDark ? "bg-[#111]" : "bg-gray-50";
  const cardBg = isDark ? "bg-[#1a1a1a]" : "bg-white";
  const textColor = isDark ? "text-gray-300" : "text-gray-600";
  const headingColor = isDark ? "text-white" : "text-black";
  const borderColor = isDark ? "border-gray-800" : "border-gray-200";

  return (
    <div className={`${bgColor} ${isDark ? "text-gray-100" : "text-black"} min-h-screen font-sans transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto p-8 pt-20 pb-20">
        
        {/* Header Section */}
        <div className={`text-center mb-16 border-b ${borderColor} pb-10 relative`}>
          <h1 className={`text-5xl font-extrabold tracking-tight ${headingColor} mb-4`}>Returns & Refunds</h1>
          <p className={`text-xl ${isDark ? "text-gray-400" : "text-gray-500"} max-w-2xl mx-auto`}>
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
          
          {/* Card 1 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>30-Day Policy</h3>
            <p className={`${textColor} leading-relaxed`}>
              We offer a <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>30-day return window</span> from the date of delivery. If 30 days have passed, unfortunately, we cannot offer a refund or exchange.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>Condition of Items</h3>
            <p className={`${textColor} leading-relaxed`}>
              To be eligible for a return, your item must be <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>unused and in the same condition</span> that you received it, including the original packaging.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>Refund Process</h3>
            <p className={`${textColor} leading-relaxed`}>
              Once your return is received and inspected, we will notify you. Your refund will be processed and applied to your <span className={`font-bold ${isDark ? "text-white" : "text-black"}`}>original payment method</span> within 5-7 business days.
            </p>
          </div>

          {/* Card 4 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>Shipping Returns</h3>
            <p className={`${textColor} leading-relaxed`}>
              You will be responsible for paying your own shipping costs for returning your item. Shipping costs are <span className="font-bold text-red-400">non-refundable</span>.
            </p>
          </div>
          
        </div>

        {/* Contact Support */}
        <div className={`mt-20 text-center border-t ${borderColor} pt-10`}>
          <p className="text-gray-500">Ready to initiate a return? Reach out to our <Link to="/contact" className="text-[#00bcd4] hover:underline">Support Team</Link> to get started.</p>
        </div>

      </div>

      {/* ✅ DataModal */}
      <DataModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </div>
  );
};

export default Returns;