import React, { useState } from "react"; 
import { Link } from "react-router-dom";
import { FaInstagram, FaTwitter, FaLinkedinIn, FaFacebookF } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();

    const templateParams = {
      user_email: email, 
    };

    emailjs.send(
      "service_t3iioit", 
      "template_0jxtwwl", 
      templateParams, 
      "DhTTFdtTNnLJ1_KPQ"
    )
    .then((response) => {
      toast.success("Subscribed successfully!");
      setEmail(""); 
    }, (error) => {
      toast.error("Failed to subscribe.");
    });
  };

  return (
    <footer className="bg-[#0a0a0a] text-white pt-20 pb-10 px-8 md:px-[100px] border-t border-white/5">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-10">
            <div>
              <h2 className="text-3xl font-black italic tracking-tighter uppercase mb-6">Trendora</h2>
              <p className="text-gray-300 text-[13px] leading-[1.8] max-w-[320px] font-light">
                Redefining the digital shopping experience through minimal design and intelligent automation.
              </p>
            </div>
            
            <div className="flex gap-4">
              {[FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn].map((Icon, idx) => (
                <a key={idx} href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:bg-white hover:text-black transition-all duration-300">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[5px] text-white">Explore</h4>
            <ul className="space-y-4 text-[13px] text-gray-300 font-light">
              <li><Link to="/" className="hover:text-[#00bcd4] transition-all">Homepage</Link></li>
              <li><Link to="/products" className="hover:text-[#00bcd4] transition-all">Collection</Link></li>
              <li><Link to="/about" className="hover:text-[#00bcd4] transition-all">Our Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#00bcd4] transition-all">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[5px] text-white">Support</h4>
            <ul className="space-y-4 text-[13px] text-gray-300 font-light">
              <li><Link to="/shipping" className="hover:text-[#00bcd4] transition-all">Shipping</Link></li>
              <li><Link to="/returns" className="hover:text-[#00bcd4] transition-all">Returns</Link></li>
              <li><Link to="/privacy" className="hover:text-[#00bcd4] transition-all">Privacy</Link></li>
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="lg:col-span-4 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[5px] text-white">Join the Club</h4>
            <p className="text-gray-300 text-[13px]">Subscribe for early access and exclusive drops.</p>
            
            <form onSubmit={handleSubscribe} className="relative max-w-[350px]">
              <div className="flex border border-white/10 rounded-sm overflow-hidden bg-white/5">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="YOUR EMAIL" 
                  className="bg-transparent px-4 py-3 text-[11px] w-full outline-none text-white placeholder:text-gray-500 tracking-[1px]"
                />
                <button 
                  type="submit"
                  className="bg-white text-black px-6 text-[10px] font-black uppercase tracking-widest hover:bg-[#333] hover:text-white transition-all"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[9px] text-gray-500 tracking-[4px] uppercase">
            © 2026 Trendora. All rights reserved.
          </p>
          <div className="flex items-center gap-8 text-[10px] text-gray-600 font-bold tracking-widest uppercase">
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>PAYPAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;