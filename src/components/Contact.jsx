import React from 'react';
import { toast } from 'react-toastify';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Message sent successfully! We will get back to you soon.");
  };

  return (
    <div className="bg-white min-h-screen pt-[100px] pb-20">
      
      {/* --- HEADER --- */}
      <div className="max-w-4xl mx-auto text-center px-6 mb-16">
        <h1 className="text-3xl md:text-5xl font-light uppercase tracking-[6px] mb-4 text-gray-900">
          Contact <span className="font-bold">Us</span>
        </h1>
        <div className="w-16 h-1 bg-black mx-auto mb-6"></div>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed italic">
          Have a question or need assistance? Our team is always here to help you.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* --- left side support card --- */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#f9f9f9] p-8 border-l-4 border-black transition-all hover:shadow-md">
            <h3 className="font-bold uppercase text-xs tracking-widest mb-2">Order Support</h3>
            <p className="text-sm text-gray-600 mb-4">Looking to track your package? Click the link below.</p>
            <button className="text-xs font-bold underline uppercase hover:text-gray-500 transition-colors">
              Track My Order
            </button>
          </div>

          <div className="bg-[#f9f9f9] p-8 border-l-4 border-black transition-all hover:shadow-md">
            <h3 className="font-bold uppercase text-xs tracking-widest mb-2">Customer Care</h3>
            <p className="text-sm text-gray-600 mb-1">Monday - Saturday</p>
            <p className="text-sm text-gray-900 font-bold mb-3">09:00 AM - 06:00 PM</p>
            <p className="text-sm text-blue-600 font-medium">support@trendora.com</p>
          </div>

          <div className="bg-[#f9f9f9] p-8 border-l-4 border-black transition-all hover:shadow-md">
            <h3 className="font-bold uppercase text-xs tracking-widest mb-2">Visit Our Store</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              123 Fashion Street, Gulberg III,<br />
              Lahore, Pakistan.
            </p>
          </div>
        </div>

        {/* --- right side form --- */}
        <div className="lg:col-span-8 bg-white border border-gray-100 p-8 md:p-12 shadow-2xl shadow-gray-100">
          <h2 className="text-2xl font-bold uppercase tracking-tight mb-8">Send a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Name Input */}
              <div className="relative">
                <input 
                  type="text" 
                  id="name" 
                  required
                  className="peer w-full border-b-2 border-gray-200 py-2 outline-none focus:border-black transition-colors placeholder-transparent bg-transparent" 
                  placeholder="Name" 
                />
                <label 
                  htmlFor="name" 
                  className="absolute left-0 -top-4 text-xs font-bold uppercase text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs transition-all cursor-text"
                >
                  Full Name
                </label>
              </div>

              {/* Email Input */}
              <div className="relative">
                <input 
                  type="email" 
                  id="email" 
                  required
                  className="peer w-full border-b-2 border-gray-200 py-2 outline-none focus:border-black transition-colors placeholder-transparent bg-transparent" 
                  placeholder="Email" 
                />
                <label 
                  htmlFor="email" 
                  className="absolute left-0 -top-4 text-xs font-bold uppercase text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-4 peer-focus:text-xs transition-all cursor-text"
                >
                  Email Address
                </label>
              </div>
            </div>

            {/* Subject Select */}
            <div className="relative pt-2">
              <label className="text-xs font-bold uppercase text-gray-400 block mb-1">Subject</label>
              <select className="w-full border-b-2 border-gray-200 py-2 outline-none focus:border-black transition-colors bg-transparent text-sm cursor-pointer">
                <option>General Inquiry</option>
                <option>Order Tracking</option>
                <option>Return & Exchange</option>
                <option>Complaint</option>
              </select>
            </div>

            {/* Message Text area */}
            <div className="relative pt-4">
              <textarea 
                rows="4" 
                id="msg" 
                required
                className="peer w-full border-b-2 border-gray-200 py-2 outline-none focus:border-black transition-colors placeholder-transparent resize-none bg-transparent" 
                placeholder="Message"
              ></textarea>
              <label 
                htmlFor="msg" 
                className="absolute left-0 -top-2 text-xs font-bold uppercase text-gray-400 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-2 peer-focus:text-xs transition-all cursor-text"
              >
                How can we help?
              </label>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="group relative w-full md:w-auto bg-black text-white px-14 py-4 text-xs font-bold uppercase tracking-[4px] overflow-hidden transition-all active:scale-95"
            >
              <span className="relative z-10">Submit Now</span>
              <div className="absolute inset-0 bg-[#333] translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </form>
        </div>

      </div>

      
      </div>
    
  );
};

export default Contact;