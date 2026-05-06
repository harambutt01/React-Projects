import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      
      {/* --- HERO SECTION --- */}
      <section className="relative bg-blue-900 text-white py-20 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold mb-4">Elevate Your Style with Automation</h1>
          <p className="text-xl mb-8">Discover the latest trends in tech and fashion, delivered with speed.</p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition">
            Shop Now
          </button>
        </div>
      </section>

      {/* --- PRODUCT CATEGORIES SECTION --- */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        
        {/* New Arrivals */}
        <CategorySection title="New Arrivals" badgeColor="bg-green-100 text-green-800" />

        {/* Best Sellers */}
        <div className="mt-16">
          <CategorySection title="Best Sellers" badgeColor="bg-blue-100 text-blue-800" />
        </div>

        {/* Clearance Sale */}
        <div className="mt-16">
          <CategorySection title="Clearance Product" badgeColor="bg-red-100 text-red-800" />
        </div>

      </section>
    </div>
  );
};

// Reusable Category Component for clean code (Senior's Preference)
const CategorySection = ({ title, badgeColor }) => {
  return (
    <div>
      <div className="flex items-center justify-between mb-8 border-b pb-4">
        <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
        <span className={`px-4 py-1 rounded-full text-sm font-medium ${badgeColor}`}>
          Explore All
        </span>
      </div>
      
      {/* Placeholder Grid for Products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition border border-gray-100">
            <div className="h-48 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-400">
              Product Image
            </div>
            <h3 className="font-semibold text-lg">Modern Product Name</h3>
            <p className="text-gray-600">$99.00</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;