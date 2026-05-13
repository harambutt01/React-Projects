const ANNOUNCEMENTS = [
  "✨ 15% OFF ON ALL FRAGRANCES — USE CODE: TREND15",
  "🚚 FREE WORLDWIDE SHIPPING ON ORDERS OVER $100",
  "🔥 NEW DROP: GADGETS & APPAREL OUT NOW",
];

function AnnouncementBar() {
  return (
    <div className="bg-[#00bcd4] h-[35px] flex items-center overflow-hidden border-b border-black/10 relative z-[1002]">
      
      <div className="flex whitespace-nowrap animate-marquee">
        {[1, 2, 3].map((_, i) => (
          <div key={i} className="flex items-center">
            {ANNOUNCEMENTS.map((text, j) => (
              <span key={j} className="text-black font-black italic uppercase text-[10px] tracking-[3px] mx-10">
                {text}
              </span>
            ))}
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
          animation-play-state: paused;
        }
      `}} />
    </div>
  );
}

export default AnnouncementBar;