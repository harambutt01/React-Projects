import { useTheme } from "../ThemeContext";

function ProductFilters({ search, setSearch, category, setCategory, sort, setSort, categories }) {
  const { isDark } = useTheme();

  const inputClass = `py-2 px-3 rounded-lg text-[0.85rem] outline-none w-full box-border transition-all duration-200 focus:border-[#4f6ef7]
    ${isDark 
      ? "border border-[#444] bg-[#1e1e1e] text-[#e0e0e0]" 
      : "border border-[#ddd] bg-white text-[#111]"
    }`;

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] gap-3 mb-6">

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
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
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={inputClass}
      >
        <option value="">Sort by Price</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>

    </div>
  );
}

export default ProductFilters;