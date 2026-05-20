import React, { useState } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DataModal = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', orderId: '', issueType: 'Return Request', details: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. EmailJS call (Notification ke liye)
      await emailjs.send(
        'service_t3iioit', 
        'template_0jxtwwl', 
        {
          name: form.name,
          email: form.email,
          orderId: form.orderId,
          issueType: form.issueType,
          details: form.details
        },
        'DhTTFdtTNnLJ1_KPQ'
      );

      // 2. Database API call (Trendora backend ke liye)
      const response = await fetch('http://localhost:4000/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!response.ok) throw new Error("Database save failed");

      setSubmitted(true);
      toast.success("Request submitted and saved to database!");
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to process request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#0f1a1a] border border-[#00bcd4]/30 rounded-2xl p-6 shadow-2xl">
        
        <div className="mb-5">
          <h2 className="text-xl font-bold text-white">Support Request</h2>
          <p className="text-[9px] uppercase tracking-widest text-[#00bcd4]/60">Get help with your order</p>
        </div>

        <button onClick={onClose} className="absolute top-6 right-6 text-white/50 hover:text-white transition-all">✕</button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase text-[#00bcd4] mb-1">Full Name</label>
                <input name="name" required onChange={handleChange} className="w-full bg-[#162222] border border-[#2a3a3a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00bcd4] outline-none" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-[#00bcd4] mb-1">Email</label>
                <input name="email" type="email" required onChange={handleChange} className="w-full bg-[#162222] border border-[#2a3a3a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00bcd4] outline-none" placeholder="john@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold uppercase text-[#00bcd4] mb-1">Order ID</label>
                <input name="orderId" required onChange={handleChange} className="w-full bg-[#162222] border border-[#2a3a3a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00bcd4] outline-none" placeholder="#TRD-0000" />
              </div>
              <div>
                <label className="block text-[9px] font-bold uppercase text-[#00bcd4] mb-1">Category</label>
                <select name="issueType" onChange={handleChange} className="w-full bg-[#162222] border border-[#2a3a3a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00bcd4] outline-none">
                  <option>Return Request</option>
                  <option>Refund Status</option>
                  <option>Damaged Item</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold uppercase text-[#00bcd4] mb-1">Description</label>
              <textarea name="details" rows="2" required onChange={handleChange} className="w-full bg-[#162222] border border-[#2a3a3a] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00bcd4] outline-none resize-none" placeholder="Brief details..." />
            </div>

            <button disabled={loading} type="submit" className="w-full bg-[#00bcd4] hover:bg-[#0097a7] text-black font-bold uppercase text-xs py-3 rounded-lg transition-all shadow-[0_0_10px_rgba(0,188,212,0.3)]">
              {loading ? "Sending..." : "Submit Request"}
            </button>
          </form>
        ) : (
          <div className="text-center py-8">
            <div className="text-4xl mb-2">✅</div>
            <h3 className="text-lg font-bold text-white">Ticket Submitted!</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataModal;