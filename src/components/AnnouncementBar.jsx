import React from 'react';

const AnnouncementBar = () => {
  return (
    <div className="bg-[#00bcd4] h-[35px] flex items-center overflow-hidden border-b border-black/10 relative z-[1002]">
      {/* Moving Text Container */}
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Is block ko 2-3 baar repeat kiya hai taake loop seamless lage */}
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-black font-black italic uppercase text-[10px] tracking-[3px] mx-10">
              ✨ 15% OFF ON ALL FRAGRANCES — USE CODE: TREND15
            </span>
            <span className="text-black font-black italic uppercase text-[10px] tracking-[3px] mx-10">
              🚚 FREE WORLDWIDE SHIPPING ON ORDERS OVER $100
            </span>
            <span className="text-black font-black italic uppercase text-[10px] tracking-[3px] mx-10">
              🔥 NEW DROP: GADGETS & APPAREL OUT NOW
            </span>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused; /* User mouse laye toh ruk jaye */
        }
      `}} />
    </div>
  );
};

export default AnnouncementBar;