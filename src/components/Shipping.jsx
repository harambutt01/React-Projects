import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from "./ThemeContext";

const Shipping = () => {
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
        <div className={`text-center mb-16 border-b ${borderColor} pb-10`}>
          <h1 className={`text-5xl font-extrabold tracking-tight ${headingColor} mb-4`}>Shipping Policy</h1>
          <p className={`text-xl ${isDark ? "text-gray-400" : "text-gray-500"} max-w-2xl mx-auto`}>
            Everything you need to know about our swift and secure delivery process for your <span className="text-[#00bcd4]">Trendora</span> orders.
          </p>
        </div>

        {/* Content Section */}
        <div className="grid md:grid-cols-2 gap-10">
          
          {/* Card 1 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <div className="text-[#00bcd4] mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>Order Processing</h3>
            <p className={`${textColor} leading-relaxed`}>
              All orders are processed within <span className="font-bold">24-48 hours</span>. You will receive a confirmation email once your order has been placed successfully.
            </p>
          </div>

          {/* Card 2 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <div className="text-[#00bcd4] mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>Delivery Timeline</h3>
            <p className={`${textColor} leading-relaxed`}>
              Standard shipping takes <span className="font-bold">3-5 business days</span> for major cities and 5-7 days for remote locations. Express options are available at checkout.
            </p>
          </div>

          {/* Card 3 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <div className="text-[#00bcd4] mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14v1" />
              </svg>
            </div>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>Flat Shipping Rates</h3>
            <p className={`${textColor} leading-relaxed`}>
              We offer <span className="font-bold text-[#00bcd4]">FREE Shipping</span> on all orders over $75. For orders below $75, a flat rate of $7 applies nationwide.
            </p>
          </div>

          {/* Card 4 */}
          <div className={`${cardBg} p-8 rounded-2xl border ${borderColor} hover:border-[#00bcd4] transition-all shadow-xl`}>
            <div className="text-[#00bcd4] mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-semibold ${headingColor} mb-3`}>Live Order Tracking</h3>
            <p className={`${textColor} leading-relaxed`}>
              Keep an eye on your shipment! As soon as your order leaves our warehouse, you'll receive a tracking number via email to follow its journey.
            </p>
          </div>
          
        </div>

        {/* Footer Support Message */}
        <div className={`mt-20 text-center border-t ${borderColor} pt-10`}>
          <p className="text-gray-500">Need immediate help? Contact our <Link to="/contact" className="text-[#00bcd4] hover:underline">Support Team</Link>.</p>
        </div>

      </div>
    </div>
  );
};

export default Shipping;