import { useTheme } from "../ThemeContext";
import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/products/${product.id}`)}
      className={`rounded-xl overflow-hidden transition-transform duration-200 hover:-translate-y-1 hover:shadow-lg cursor-pointer
        ${isDark
          ? "bg-[#1e1e1e] border border-[#333] shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
          : "bg-white border border-[#e0e0e0] shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
        }`}>

      <img
        src={product.image}
        alt={product.name}
        className="w-full h-[160px] object-cover sm:h-[300px]"
      />

      <div className="p-3">
        <span className={`text-[0.7rem] font-bold uppercase tracking-[0.05em]
          ${isDark ? "text-[#888]" : "text-[#999]"}`}>
          {product.category}
        </span>

        <h3 className={`my-[6px] text-[0.95rem]
          ${isDark ? "text-[#e0e0e0]" : "text-[#111]"}`}>
          {product.name}
        </h3>

        <p className={`text-[1.1rem] font-bold
          ${isDark ? "text-[#6b8cff]" : "text-[#4f6ef7]"}`}>
          ${product.price.toFixed(2)}
        </p>

        <p className={`text-[0.8rem] my-[4px] mb-2 leading-[1.5]
          ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
          {product.description}
        </p>
      </div>

    </div>
  );
}

export default ProductCard;