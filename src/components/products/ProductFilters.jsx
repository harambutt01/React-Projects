import { useTheme } from "../ThemeContext";

function ProductFilters({ search, setSearch, category, setCategory, sort, setSort, categories }) {
  const { isDark } = useTheme();

  // Padding aur font-size ko mobile ke liye thoda chota kiya hai taake text fit aa jaye
  const inputClass = `py-2 px-2 sm:px-3 rounded-lg text-[11px] sm:text-[0.85rem] outline-none w-full box-border transition-all duration-200 
    ${isDark 
      ? "border border-[#444] bg-[#1e1e1e] text-[#e0e0e0] focus:border-white" 
      : "border border-[#ddd] bg-white text-[#111] focus:border-black"
    }`;

  return (
    /* 
       1. Mobile (default): grid-cols-[1fr_1fr_1fr] - Teeno ko barabar jagah di hai taake dropdowns na pichken.
       2. Tablet/Desktop (sm): grid-cols-[2fr_1fr_1fr] - Wapis aapka purana layout.
       3. Gap: Mobile par 'gap-1' rakha hai taake screen space bache.
    */
    <div className="grid grid-cols-[1fr_1fr_1fr] sm:grid-cols-[2fr_1fr_1fr] gap-1 sm:gap-3 mb-6 w-full">

      {/* Search - Placeholder ko chota kiya mobile ke liye */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={inputClass}
      />

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={inputClass}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={inputClass}
      >
        <option value="">Sort by Price</option>
        <option value="asc">Low to High</option>
        <option value="desc">High to Low</option>
      </select>

    </div>
  );
}

export default ProductFilters;