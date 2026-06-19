"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaSearch, FaFilter, FaSort, FaMapMarkerAlt, FaTag, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const categories = ["All", "Electronics", "Furniture", "Vehicles", "Fashion", "Mobile Phones"];
const conditions = ["All", "Like New", "Good", "Refurbished"];
const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price_low" },
  { label: "Price: High to Low", value: "price_high" },
];

const conditionColors = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Refurbished": "bg-orange-100 text-orange-700",
};

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [condition, setCondition] = useState("All");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category !== "All") params.append("category", category);
      if (condition !== "All") params.append("condition", condition);
      if (sort) params.append("sort", sort);
      params.append("page", page);
      params.append("limit", 9);

      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/all?${params}`);
      const data = await res.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, condition, sort, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">

      {/* Page Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-black text-white mb-2"
          >
            All Products
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-green-100"
          >
            {total} products available for you
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Search + Filters */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 mb-8">

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:border-green-400 transition-all"
              />
            </div>
            <Button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl px-6 shadow-md"
            >
              Search
            </Button>
          </form>

          {/* Filters Row */}
          <div className="flex flex-wrap gap-4 items-center">

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <FaFilter size={12} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">Category:</span>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      category === cat
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Condition:</span>
              <div className="flex flex-wrap gap-2">
                {conditions.map((con) => (
                  <button
                    key={con}
                    onClick={() => { setCondition(con); setPage(1); }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      condition === con
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    {con}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 ml-auto">
              <FaSort size={12} className="text-gray-400" />
              <span className="text-xs font-semibold text-gray-500">Sort:</span>
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="text-xs font-semibold text-gray-600 bg-gray-100 border-0 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden animate-pulse">
                <div className="h-52 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                  <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                  <div className="h-8 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🔍</p>
            <p className="text-xl font-black text-gray-700">No products found</p>
            <p className="text-gray-400 mt-2">Try changing your search or filters</p>
            <Button
              onClick={() => { setSearch(""); setCategory("All"); setCondition("All"); setPage(1); }}
              className="mt-4 bg-green-500 text-white font-bold rounded-2xl"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                whileHover={{ y: -5 }}
                className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-100 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className={`absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-lg ${conditionColors[product.condition] || "bg-gray-100 text-gray-700"}`}>
                    {product.condition}
                  </span>
                  <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-600 px-2 py-1 rounded-lg flex items-center gap-1">
                    <FaTag size={10} className="text-green-500" />
                    {product.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-2xl font-black text-green-600">
                    ৳{product.price?.toLocaleString()}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MdVerified className="text-green-500" size={12} />
                      <span>{product.sellerInfo?.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <FaMapMarkerAlt className="text-green-500" size={10} />
                      <span>{product.sellerInfo?.location || "Bangladesh"}</span>
                    </div>
                  </div>
                  <Link href={`/products/${product._id}`} className="block">
                    <Button
                      size="sm"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-md hover:shadow-green-200 transition-all"
                    >
                      View Details
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-green-50 hover:border-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronLeft size={12} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${
                  page === i + 1
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
              className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-green-50 hover:border-green-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}