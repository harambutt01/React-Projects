import { useState, useMemo } from "react";
import { useTheme } from "../ThemeContext";
import useFetch from "../../hooks/useFetch"; 
import ProductCard from "./ProductCard";
import ProductFilters from "./ProductFilters";

// DummyJSON API use kar rahe hain taake Detail page se sync ho jaye
const API_URL = "https://dummyjson.com/products?limit=0";

function ProductList() {
  const { isDark } = useTheme();
  const { data: apiData, loading, error } = useFetch(API_URL);

  // DummyJSON ka data apiData.products mein hota hai
  const productsData = useMemo(() => apiData?.products || [], [apiData]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");

  const filteredProducts = useMemo(() => {
    let result = [...productsData];

    if (search.trim()) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
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
  }, [search, category, sort, productsData]);

  const categories = useMemo(() => {
    return [...new Set(productsData.map((p) => p.category))];
  }, [productsData]);

  return (
    <div className={`p-6 min-h-screen transition-all duration-300 w-full max-w-[1400px] mx-auto pt-24 sm:p-4 ${isDark ? "bg-[#121212]" : "bg-[#f5f5f5]"}`}>
      <div className="w-full mb-6 text-left">
        <h1 className={`m-0 mb-1 text-[2rem] font-bold ${isDark ? "text-white" : "text-black"}`}>Products</h1>
        <p className={`text-[0.85rem] ${isDark ? "text-[#aaa]" : "text-[#666]"}`}>
          {loading ? "Fetching products..." : `${filteredProducts.length} results found`}
        </p>
      </div>

      {!loading && (
        <ProductFilters search={search} setSearch={setSearch} category={category} setCategory={setCategory} sort={sort} setSort={setSort} categories={categories} />
      )}

      {error && <p className="text-red-500 text-center py-10">{error}</p>}

      <div className="grid gap-[30px] w-full mt-8 grid-cols-[repeat(auto-fill,minmax(280px,1fr))] lg:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] sm:grid-cols-1">
        {loading ? (
          Array(8).fill(0).map((_, i) => (
            <div key={i} className={`h-[350px] rounded-xl animate-pulse ${isDark ? "bg-[#1e1e1e]" : "bg-white"}`} />
          ))
        ) : (
          filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
        )}
      </div>
    </div>
  );
}

export default ProductList;