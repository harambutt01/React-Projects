import { useTheme } from "../ThemeContext";
import "./ProductFilters.css";

function ProductFilters({ search, setSearch, category, setCategory, sort, setSort, categories }) {
  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";

  return (
    <div className="filters-grid">

      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`filter-input ${theme}`}
      />

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className={`filter-input ${theme}`}
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
        className={`filter-input ${theme}`}
      >
        <option value="">Sort by Price</option>
        <option value="asc">Price: Low to High</option>
        <option value="desc">Price: High to Low</option>
      </select>

    </div>
  );
}

export default ProductFilters;