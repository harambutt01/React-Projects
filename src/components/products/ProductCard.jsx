import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

function ProductCard({ product }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/products/${product.id}`)}
      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${
        isDark ? "bg-[#1e1e1e] border-[#333] hover:border-white" : "bg-white border-gray-100 hover:shadow-xl"
      }`}
    >
      <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
        <img 
          src={product.thumbnail} 
          alt={product.title} 
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute top-2 left-2">
          <p className={`font-black text-[10px] uppercase tracking-widest ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            {product.category}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <div className={`inline-block px-2 py-0.5 rounded text-xs font-black ${
          isDark ? "bg-white text-black" : "bg-black text-white"
        }`}>
          ${product.price}
        </div>

        <h3 className={`font-bold text-sm truncate ${isDark ? "text-white" : "text-black"}`}>
          {product.title}
        </h3>
        
        <button className={`w-full mt-2 py-2 text-[11px] font-bold border rounded-lg transition-colors ${
          isDark ? "border-white text-white hover:bg-white hover:text-black" : "border-black text-black hover:bg-black hover:text-white"
        }`}>
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
}

export default ProductCard;