"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { FaHeart, FaTrash, FaEye, FaShoppingBag, FaMapMarkerAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";

const conditionColors = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Refurbished": "bg-orange-100 text-orange-700",
};

export default function WishlistPage() {
  const { data: session } = useSession();
  const router = useRouter();
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800">My Wishlist</h1>
          <p className="text-gray-400 text-sm mt-1">
            {wishlist.length} saved {wishlist.length === 1 ? "product" : "products"}
          </p>
        </div>
        {wishlist.length > 0 && (
          <Link href="/products">
            <Button
              size="sm"
              variant="bordered"
              className="border-2 border-green-500 text-green-600 font-bold rounded-xl hover:bg-green-50"
            >
              Browse More
            </Button>
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {wishlist.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all flex items-center gap-3"
            >
              {/* Product Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-gray-100">
                <img
                  src={product.images?.[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h3 className="font-bold text-gray-800 text-sm line-clamp-1">
                    {product.title}
                  </h3>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg shrink-0 ${conditionColors[product.condition] || "bg-gray-100 text-gray-700"}`}>
                    {product.condition}
                  </span>
                </div>
                <p className="text-base font-black text-green-600">
                  ৳{product.price?.toLocaleString()}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <MdVerified className="text-green-500" size={12} />
                    <span>{product.sellerInfo?.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FaMapMarkerAlt className="text-green-500" size={10} />
                    <span>{product.sellerInfo?.location || "Bangladesh"}</span>
                  </div>
                </div>
              </div>

              {/* Vertical Divider + Actions */}
              <div className="flex items-center gap-12 shrink-0">
                <div className="w-px h-14 bg-gray-200"></div>
                <div className="flex items-center gap-6">
                  <Link href={`/products/${product._id}`}>
                    <button
                      className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-all"
                      title="View Details"
                    >
                      <FaEye size={13} />
                    </button>
                  </Link>
                  <button
                    onClick={() => {
                      toast.info("Redirecting to product!");
                      router.push(`/products/${product._id}`);
                    }}
                    className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all"
                    title="Place Order"
                  >
                    <FaShoppingBag size={13} />
                  </button>
                  <button
                    onClick={() => handleRemove(product._id)}
                    className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all"
                    title="Remove"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}