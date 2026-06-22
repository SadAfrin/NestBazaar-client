"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import Link from "next/link";
import { FaEdit, FaTrash, FaPlus, FaBoxOpen, FaTag, FaSearch } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const conditionColors = {
  "Like New": "bg-green-100 text-green-700",
  "Good": "bg-blue-100 text-blue-700",
  "Refurbished": "bg-orange-100 text-orange-700",
};

const statusColors = {
  "available": "bg-green-100 text-green-700",
  "sold": "bg-gray-100 text-gray-700",
  "pending": "bg-yellow-100 text-yellow-700",
};

export default function MyProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/seller?email=${session?.user?.email}`
      );
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.email) fetchProducts();
  }, [session]);

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setDeleteLoading(productId);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${productId}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error("Failed to delete product!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">My Products</h1>
          <p className="text-gray-400 text-sm mt-1">{products.length} products listed</p>
        </div>
        <Link href="/dashboard/seller/add-product">
          <Button
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl shadow-md"
            startContent={<FaPlus size={12} />}
          >
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Search your products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
              <FaBoxOpen size={40} className="text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-black text-lg">No Products Yet</p>
              <p className="text-gray-400 text-sm mt-1">Start listing products to sell</p>
            </div>
            <Link href="/dashboard/seller/add-product">
              <Button className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl shadow-md">
                Add First Product
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-5">Product</div>
            <div className="col-span-2">Category</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-all ${
                index !== filteredProducts.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="col-span-5 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-800 text-sm line-clamp-1">{product.title}</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${conditionColors[product.condition] || "bg-gray-100 text-gray-700"}`}>
                    {product.condition}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <FaTag size={10} className="text-green-500" />
                  <span>{product.category}</span>
                </div>
              </div>

              <div className="col-span-2">
                <p className="font-black text-green-600 text-sm">৳{product.price?.toLocaleString()}</p>
              </div>

              <div className="col-span-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[product.status] || "bg-gray-100 text-gray-700"}`}>
                  {product.status}
                </span>
              </div>

              <div className="col-span-2 flex items-center justify-end gap-2">
                <Link href={`/dashboard/seller/edit-product/${product._id.toString()}`}>
                  <button className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all">
                    <FaEdit size={13} />
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(product._id)}
                  disabled={deleteLoading === product._id}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all disabled:opacity-50"
                >
                  {deleteLoading === product._id ? (
                    <div className="w-3 h-3 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FaTrash size={13} />
                  )}
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}