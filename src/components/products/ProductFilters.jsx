import { useTheme } from "../ThemeContext";

function ProductFilters({ 
  search, onSearchChange, 
  category, onCategoryChange, 
  sort, onSortChange, 
  categories, 
  isVisible // Ye naya prop hai jo show/hide control karega
}) {
  const { isDark } = useTheme();

  const inputClass = `py-2 px-2 sm:px-3 rounded-lg text-[11px] sm:text-[0.85rem] outline-none w-full box-border transition-all duration-200
    ${isDark
      ? "border border-[#444] bg-[#1e1e1e] text-[#e0e0e0] focus:border-white"
      : "border border-[#ddd] bg-white text-[#111] focus:border-black"
    }`;

  return (
    // Is wrapper div mein humne animation ke liye max-h aur opacity di hai
    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isVisible ? "max-h-24 opacity-100 mb-6" : "max-h-0 opacity-0 mb-0"}`}>
      
      <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr] gap-1 sm:gap-3 w-full">

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={inputClass}
        />

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className={inputClass}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Sort by Price</option>
          <option value="asc">Low to High</option>
          <option value="desc">High to Low</option>
        </select>

      </div>
    </div>
  );
}

export default ProductFilters;