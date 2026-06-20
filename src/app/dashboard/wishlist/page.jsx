"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@heroui/react";
import { FaHeart, FaTrash, FaEye, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";

const conditionColors = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Refurbished": "bg-orange-100 text-orange-700",
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist?email=${session?.user?.email}`
      );
      const data = await res.json();
      if (data.success) setWishlist(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) fetchWishlist();
  }, [session]);

  const handleRemove = async (productId) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/wishlist`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session?.user?.email,
          productId,
        }),
      });
      toast.success("Removed from wishlist!");
      fetchWishlist();
    } catch (error) {
      toast.error("Failed to remove from wishlist!");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">My Wishlist</h1>
        <p className="text-gray-400 text-sm mt-1">
          {wishlist.length} saved {wishlist.length === 1 ? "product" : "products"}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-50 to-pink-100 flex items-center justify-center shadow-inner">
              <FaHeart size={40} className="text-pink-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-black text-lg">Wishlist is Empty</p>
              <p className="text-gray-400 text-sm mt-1">Save products you love for later</p>
            </div>
            <Link href="/products">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-md">
                Browse Products
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlist.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
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
                <button
                  onClick={() => handleRemove(product._id)}
                  className="absolute top-3 right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-all shadow-md"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-bold text-gray-800 text-sm line-clamp-2">
                  {product.title}
                </h3>
                <p className="text-xl font-black text-green-600">
                  ৳{product.price?.toLocaleString()}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <MdVerified className="text-green-500" size={12} />
                    <span>{product.sellerInfo?.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaMapMarkerAlt className="text-green-500" size={10} />
                    <span>{product.sellerInfo?.location || "Bangladesh"}</span>
                  </div>
                </div>
                <Link href={`/products/${product._id}`}>
                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl"
                    startContent={<FaEye size={12} />}
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
  );
}