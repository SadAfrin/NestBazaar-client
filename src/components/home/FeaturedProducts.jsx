"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaArrowRight, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

const conditionColors = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Refurbished": "bg-orange-100 text-orange-700",
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`);
        const data = await res.json();
        if (data.success && data.data.length > 0) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">
              Fresh Listings
            </p>
            <h2 className="text-4xl font-black text-gray-900">
              Featured{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Products
              </span>
            </h2>
            <p className="text-gray-500 mt-2">Discover the latest pre-owned products listed by our sellers</p>
          </div>
          <Link href="/products">
            <Button
              variant="bordered"
              className="border-2 border-green-500 text-green-600 font-bold rounded-2xl hover:bg-green-50 transition-all"
              endContent={<FaArrowRight size={12} />}
            >
              View All Products
            </Button>
          </Link>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-3xl overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
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
            <p className="text-gray-400 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -5 }}
                className="group bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-green-100 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
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
                <div className="p-4 space-y-3">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-2 group-hover:text-green-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xl font-black text-green-600">
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

      </div>
    </section>
  );
}