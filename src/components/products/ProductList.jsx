import { useState, useMemo } from "react";
import { useTheme } from "../ThemeContext";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";
import productsData from "./Products.json";

function ProductList() {
  const { isDark } = useTheme();

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

  const categories = useMemo(() => {
    return [...new Set(productsData.map((p) => p.category))];
  }, []);

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 w-full max-w-[1400px] mx-auto
      md:mt-16 sm:p-4
      ${isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"}`}>

      {/* Header */}
      <div className="w-full mb-6 text-left">
        <h1 className={`m-0 mb-1 text-[2rem] 
          ${isDark ? "text-white" : "text-black"}`}>
          Products
        </h1>
        <p className={`text-[0.85rem]
          ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
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
        <p className={`text-center text-[0.95rem] col-span-full
          ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
          No products found.
        </p>
      ) : (
        <div className="grid gap-[30px] w-full
          grid-cols-[repeat(auto-fill,minmax(280px,1fr))]
          lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]
          md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]
          sm:grid-cols-1">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

    </div>
  );
}

export default ProductList;