import React from 'react';
import { toast } from 'react-toastify';
import { useTheme } from "./ThemeContext";

const Contact = () => {
  const { isDark } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We will get back to you soon.");
  };

  return (
    <div className={`min-h-screen pt-[100px] pb-20 transition-colors duration-500 ${isDark ? "bg-[#121212] text-white" : "bg-white text-gray-900"}`}>
      
      {/* --- HEADER --- */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-16">
        <h1 className={`text-3xl md:text-5xl font-light uppercase tracking-[6px] mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
          Contact <span className="font-bold">Us</span>
        </h1>
        <div className={`w-16 h-1 mx-auto mb-6 ${isDark ? "bg-white" : "bg-black"}`}></div>
        <p className={`text-sm md:text-base leading-relaxed italic ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Have a question or need assistance? Our team is always here to help you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- left side support card --- */}
        <div className="lg:col-span-4 space-y-6">
          <SupportCard title="Order Support" desc="Looking to track your package? Click the link below." btnText="Track My Order" isDark={isDark} />
          
          <div className={`p-8 border-l-4 transition-all hover:shadow-md ${isDark ? "bg-[#1e1e1e] border-white" : "bg-[#f9f9f9] border-black"}`}>
            <h3 className="font-bold uppercase text-xs tracking-widest mb-2">Customer Care</h3>
            <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>Monday - Saturday <br /> <span className={`font-bold ${isDark ? "text-white" : "text-gray-900"}`}>09:00 AM - 06:00 PM</span></p>
          </div>

          <div className={`p-8 border-l-4 transition-all hover:shadow-md ${isDark ? "bg-[#1e1e1e] border-white" : "bg-[#f9f9f9] border-black"}`}>
            <h3 className="font-bold uppercase text-xs tracking-widest mb-2">Visit Our Store</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-600"}`}>
              123 Fashion Street, Gulberg III,<br />
              Lahore, Pakistan.
            </p>
          </div>
        </div>

        {/* --- right side form --- */}
        <div className={`lg:col-span-8 border p-8 md:p-12 shadow-2xl ${isDark ? "bg-[#1e1e1e] border-gray-800 shadow-none" : "bg-white border-gray-100 shadow-gray-100"}`}>
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <InputField id="name" label="Full Name" isDark={isDark} />
              <InputField id="email" label="Email Address" type="email" isDark={isDark} />
            </div>

            <div className="relative pt-2">
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Subject</label>
              <select className={`w-full border-b-2 py-2 outline-none transition-colors bg-transparent text-sm cursor-pointer ${isDark ? "border-gray-700 focus:border-white" : "border-gray-200 focus:border-black"}`}>
                <option>General Inquiry</option>
                <option>Order Tracking</option>
                <option>Return & Exchange</option>
                <option>Complaint</option>
              </select>
            </div>

            <div className="relative pt-4">
              <textarea rows="4" id="msg" required className={`peer w-full border-b-2 py-2 outline-none transition-colors placeholder-transparent resize-none bg-transparent ${isDark ? "border-gray-700 focus:border-white" : "border-gray-200 focus:border-black"}`} placeholder="Message"></textarea>
              <label htmlFor="msg" className="absolute left-0 -top-2 text-xs font-bold uppercase text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-2 peer-focus:text-xs transition-all cursor-text">How can we help?</label>
            </div>

            <button type="submit" className={`w-full md:w-auto px-14 py-4 text-xs font-bold uppercase tracking-[4px] transition-all ${isDark ? "bg-white text-black hover:bg-gray-200" : "bg-black text-white hover:bg-[#333]"}`}>
              Submit Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Helper Components for clean code
const SupportCard = ({ title, desc, btnText, isDark }) => (
  <div className={`p-8 border-l-4 transition-all hover:shadow-md ${isDark ? "bg-[#1e1e1e] border-white" : "bg-[#f9f9f9] border-black"}`}>
    <h3 className="font-bold uppercase text-xs tracking-widest mb-2">{title}</h3>
    <p className={`text-sm mb-4 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{desc}</p>
    <button className="text-xs font-bold underline uppercase hover:opacity-70 transition-opacity">{btnText}</button>
  </div>
);

const InputField = ({ id, label, type = "text", isDark }) => (
  <div className="relative">
    <input type={type} id={id} required className={`peer w-full border-b-2 py-2 outline-none transition-colors placeholder-transparent bg-transparent ${isDark ? "border-gray-700 focus:border-white" : "border-gray-200 focus:border-black"}`} placeholder={label} />
    <label htmlFor={id} className="absolute left-0 -top-4 text-xs font-bold uppercase text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs transition-all cursor-text">{label}</label>
  </div>
);

export default Contact;