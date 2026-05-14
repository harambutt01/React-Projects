import { useState, useMemo } from "react";
import { useTheme } from "../ThemeContext";
import useFetch from "../../hooks/useFetch";
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

// Aapki local backend API ka URL
const API_URL = "http://localhost:4000/api/products?page=1&limit=100";

function ProductList() {
  const { isDark } = useTheme();
  const { data: apiData, loading, error } = useFetch(API_URL);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  // API response handle kar rahe hain (agar array direct hai ya 'products' object ke andar hai)
  const productsData = useMemo(() => {
    if (Array.isArray(apiData)) return apiData;
    return apiData?.products || [];
  }, [apiData]);

  // Categories nikalne ke liye database ke 'category_name' ya 'category' field ko use karein
  const categories = useMemo(() => {
    return [...new Set(productsData.map((p) => p.category_name || p.category))].filter(Boolean);
  }, [productsData]);

  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    // Search mapping
    if (search.trim()) {
      result = result.filter((p) =>
        (p.name || p.title).toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category mapping
    if (category) {
      result = result.filter((p) => (p.category_name || p.category) === category);
    }

    // Price sorting
    if (sort === "asc") result.sort((a, b) => a.price - b.price);
    else if (sort === "desc") result.sort((a, b) => b.price - a.price);

    return result;
  }, [search, category, sort, productsData]);

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 w-full max-w-[1400px] mx-auto pt-[80px] sm:pt-[75px] sm:p-4 ${isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"}`}>

      <div className="w-full mb-6 text-left">
        <h1 className={`m-0 mb-1 text-[2rem] font-bold ${isDark ? "text-white" : "text-black"}`}>
          Products
        </h1>
        <p className={`text-[0.85rem] ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
          {loading ? "Fetching products..." : `${filteredProducts.length} results found`}
        </p>
      </div>

      {!loading && (
        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          sort={sort}
          onSortChange={setSort}
          categories={categories}
        />
      )}

      {error && <p className="text-red-500 text-center py-10">Error: {error}</p>}

      <div className="grid gap-[30px] w-full mt-8 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:grid-cols-1">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className={`h-[350px] rounded-xl animate-pulse ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`} />
          ))
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;