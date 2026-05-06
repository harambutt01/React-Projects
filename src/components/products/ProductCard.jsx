import { useNavigate } from "react-router-dom";
import { useTheme } from "../ThemeContext";

// 'props' object pass kiya hai (Parameters ki jagah)
function ProductCard(props) {
  const { product } = props; // Props se data nikalna
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Destructuring
  const { id, thumbnail, title, category, price } = product;

  // 1. Navigation Function
  const handleProductNavigation = () => {
    navigate(`/products/${id}`);
  };

  // 2. Styling Logic
  const getCardTheme = () => {
    return isDark 
      ? "bg-[#1e1e1e] border-[#333] hover:border-white text-white" 
      : "bg-white border-gray-100 hover:shadow-xl text-black";
  };

  const getBadgeTheme = () => {
    return isDark ? "bg-white text-black" : "bg-black text-white";
  };

  return (
    <div 
      onClick={handleProductNavigation}
      className={`group cursor-pointer rounded-2xl p-4 transition-all duration-300 border ${getCardTheme()}`}
    >
      {/* Product Image Section */}
      <div className={`relative aspect-square rounded-xl overflow-hidden mb-4 ${isDark ? "bg-white/5" : "bg-[#f9f9f9]"}`}>
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500"
        />
        
        <div className="absolute top-2 left-2">
          <p className="font-black text-[10px] uppercase tracking-widest opacity-50">
            {category}
          </p>
        </div>
      </div>

      {/* Product Info Section */}
      <div className="space-y-2">
        <div className={`inline-block px-2 py-0.5 rounded text-xs font-black ${getBadgeTheme()}`}>
          ${price}
        </div>

        <h3 className="font-bold text-sm truncate">
          {title}
        </h3>
        
        <button className={`w-full mt-2 py-2 text-[11px] font-bold border rounded-lg transition-colors ${
          isDark 
            ? "border-white hover:bg-white hover:text-black" 
            : "border-black hover:bg-black hover:text-white"
        }`}>
          VIEW DETAILS
        </button>
      </div>
    </div>
  );
}

export default ProductCard;