import { useState, useMemo } from "react";
import { useTheme } from "../ThemeContext";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import productsData from "./Products.json";
import "./ProductList.css";

function ProductList() {
  const { isDark } = useTheme();
  const theme = isDark ? "dark" : "light";

  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("");
  const [sort,     setSort]     = useState("");

 
  const filteredProducts = useMemo(() => {
    let result = [...productsData];

   
    if (search.trim()) {
      result = result.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    
    if (category) {
      result = result.filter((p) => p.category === category);
    }

    
    if (sort === "asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === "desc") {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [search, category, sort]);

  // ── Unique categories for dropdown
  const categories = useMemo(() => {
    return [...new Set(productsData.map((p) => p.category))];
  }, []);

  return (
    <div className={`product-page ${theme}`}>

      {/* Header */}
      <div className={`product-header ${theme}`} style={{ marginBottom: "24px" }}>
        <h1>Products</h1>
        <p className={`product-count ${theme}`}>
          {filteredProducts.length} results found
        </p>
      </div>

      {/* Filters */}
      <ProductFilters
        search={search}       setSearch={setSearch}
        category={category}   setCategory={setCategory}
        sort={sort}           setSort={setSort}
        categories={categories}
      />

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <p className={`no-results ${theme}`}>No products found.</p>
      ) : (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}

export default ProductList;