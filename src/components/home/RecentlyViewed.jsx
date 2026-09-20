"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/shared/ProductCard";
import { getRecentlyViewedIds } from "@/lib/recentlyViewed";

export default function RecentlyViewed({ excludeId } = {}) {
  const [products, setProducts] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const ids = getRecentlyViewedIds().filter((id) => id !== String(excludeId || ""));
    if (ids.length === 0) {
      setProducts([]);
      setReady(true);
      return;
    }

    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/by-ids?ids=${ids.join(",")}`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Failed to fetch recently viewed products:", error);
        setProducts([]);
      } finally {
        setReady(true);
      }
    };

    fetchProducts();
  }, [excludeId]);

  if (!ready || products.length === 0) return null;

  return (
    <section className="py-20 bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
        >
          <div>
            <p className="text-sm font-semibold text-green-600 uppercase tracking-widest mb-2">
              Continue Browsing
            </p>
            <h2 className="text-4xl font-black text-foreground">
              Recently{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                Viewed
              </span>
            </h2>
            <p className="text-gray-500 mt-2">Pick up where you left off — your latest product views</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product._id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
