import React from 'react';
import { Link } from 'react-router-dom'; // Ye lazmi check karein

const About = () => {
  return (
    <div className="bg-white min-h-screen pt-[100px]">
      
      {/* --- HERO SECTION --- */}
      <section className="px-6 py-16 md:py-24 max-w-7xl mx-auto text-center border-b border-gray-100 mb-20">
        <span className="uppercase tracking-[6px] text-[10px] font-black text-gray-400 block mb-3">Established 2018</span>
        <h1 className="text-4xl md:text-6xl font-light tracking-tight text-gray-900 uppercase">
          Redefining <span className="font-bold italic">Automation</span> <br /> 
          & Modern Lifestyle
        </h1>
      </section>

      <section className="max-w-[1400px] mx-auto px-6 mb-28 grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
        
        {/* IMAGE SIDE */}
        <div className="md:col-span-5 aspect-[3/4] bg-[#f9f9f9] overflow-hidden rounded-sm group shadow-xl border border-gray-100 flex items-center justify-center p-6">
          <img 
            src="https://img.freepik.com/free-vector/add-cart-concept-illustration_114360-1435.jpg" 
            alt="Trendora Brand Identity"
            className="w-full h-full object-contain transition-transform duration-1000 group-hover:scale-110"
          />
        </div>

        {/* Eye-Catch Paragraph */}
        <div className="md:col-span-7 space-y-12 md:pr-10">
          <div className="relative">
            <p className="text-2xl md:text-2xl font-light leading-relaxed italic text-gray-900 p-8 md:p-12 bg-gray-50 rounded-sm border-l-8 border-black shadow-sm">
              Founded in 2018, we started with a simple mission: to bring quality products to customers worldwide while creating a shopping experience that feels personal and trustworthy.
              What began as a small team with big dreams has grown into a thriving community of passionate individuals dedicated to excellence in every aspect of our business.
              Today, we're proud to serve hundreds of thousands of customers across the globe, but we've never forgotten our roots or the values that got us here.
            </p>
          </div>

          <div className="max-w-xl text-gray-600 space-y-8">
            <div>
              <h2 className="text-xs font-black uppercase tracking-[4px] text-black mb-4">Our Evolution</h2>
              <p className="text-sm md:text-base leading-relaxed tracking-wide">
                TRENDORA stands at the intersection of innovation and elegance. We utilize advanced AI-driven systems to curate the latest global trends, ensuring that speed and quality are never compromised.
              </p>
            </div>
            
            <div>
              <h2 className="text-xs font-black uppercase tracking-[4px] text-black mb-4">The Standard</h2>
              <p className="text-sm md:text-base leading-relaxed tracking-wide font-medium text-gray-800">
                Every detail in our catalog is meticulously managed through automated efficiency, reflecting our deep-rooted commitment to the future of retail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CORE VALUES --- */}
      <section className="max-w-7xl mx-auto py-20 px-6 border-t border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          <AboutCard 
            number="01"
            title="Intelligent Sourcing"
            desc="We leverage smart algorithms to identify premium materials and the latest global trends ahead of the curve."
          />
          <AboutCard 
            number="02"
            title="Uncompromising Quality"
            desc="Our automated quality checks ensure that every product meets our luxury standards before it reaches you."
          />
          <AboutCard 
            number="03"
            title="Agile Delivery"
            desc="Integrated fulfillment systems allow us to process and ship your orders with unprecedented efficiency."
          />
        </div>
      </section>

      {/* --- CALL TO ACTION (Ab ye button Products page pr le jaye ga) --- */}
      <section className="bg-black text-white py-24 px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-light uppercase tracking-[8px] mb-10">
          Join the <span className="font-bold">Evolution</span>
        </h2>
        
        {/* React Router Link used here */}
        <Link to="/products">
          <button className="border border-white text-white px-14 py-4 text-[10px] font-bold uppercase tracking-[4px] hover:bg-white hover:text-black transition-all duration-500">
            Explore Collection
          </button>
        </Link>
      </section>
    </div>
  );
};

const AboutCard = ({ number, title, desc }) => {
  return (
    <div className="group border-t border-gray-200 pt-8 hover:border-black transition-all duration-500">
      <span className="text-[10px] font-bold text-gray-300 group-hover:text-black transition-colors tracking-widest">{number}</span>
      <h3 className="text-sm font-bold uppercase tracking-widest mt-4 mb-4 text-gray-900">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed font-light group-hover:text-gray-800 transition-colors">
        {desc}
      </p>
    </div>
  );
};

export default About;