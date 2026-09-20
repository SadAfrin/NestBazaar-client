"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaBoxOpen, FaSearch, FaTrash, FaCheck, FaTimes, FaTag, FaSync, FaInfoCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
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
  "rejected": "bg-red-100 text-red-700",
};

const riskColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
  Unknown: "bg-gray-100 text-gray-700",
};

function RiskBadge({ product, openReasonId, setOpenReasonId }) {
  const level = product.riskLevel || "Unknown";
  const reason = product.riskReason || "Not analyzed yet";
  const isOpen = openReasonId === product._id;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpenReasonId(isOpen ? null : product._id)}
        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${riskColors[level] || riskColors.Unknown}`}
        title={reason}
        aria-label={`${level} risk. ${reason}`}
      >
        {level}
        <FaInfoCircle size={10} className="opacity-70" />
      </button>
      {isOpen && (
        <div className="absolute z-30 top-full mt-1 w-56 max-w-[calc(100vw-2rem)] p-3 bg-card border border-gray-200 rounded-xl shadow-lg text-xs text-foreground leading-relaxed break-words right-0 sm:right-auto sm:left-0">
          {reason}
        </div>
      )}
    </div>
  );
}

export default function ManageProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [conditionFilter, setConditionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openReasonId, setOpenReasonId] = useState(null);
  const [analyzingId, setAnalyzingId] = useState(null);

  const fetchProducts = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/products`
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
    fetchProducts();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/products/status`,
        {
          method: "PATCH",
          body: JSON.stringify({ id, status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Product ${status} successfully!`);
        fetchProducts();
      } else {
        toast.error("Failed to update product!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${id}`,
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
    }
  };

  const handleReanalyze = async (id) => {
    setAnalyzingId(id);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/products/${id}/analyze-risk`,
        { method: "POST" }
      );
      const data = await res.json();
      if (data.success && data.data) {
        setProducts((prev) =>
          prev.map((p) =>
            p._id === id
              ? { ...p, riskLevel: data.data.riskLevel, riskReason: data.data.riskReason }
              : p
          )
        );
        toast.success("Risk analysis updated!");
      } else {
        toast.error(data.message || "Failed to re-analyze product!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setAnalyzingId(null);
    }
  };

  const handleReset = () => {
    setSearch("");
    setCategoryFilter("");
    setConditionFilter("");
    setStatusFilter("");
  };

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = categoryFilter ? p.category === categoryFilter : true;
    const matchCondition = conditionFilter ? p.condition === conditionFilter : true;
    const matchStatus = statusFilter ? p.status === statusFilter : true;
    return matchSearch && matchCategory && matchCondition && matchStatus;
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-foreground">Manage Products</h1>
        <p className="text-gray-400 text-sm mt-1">{products.length} total products</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-card border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-3 bg-card border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Furniture">Furniture</option>
          <option value="Vehicles">Vehicles</option>
          <option value="Fashion">Fashion</option>
          <option value="Mobile Phones">Mobile Phones</option>
          <option value="Other">Other</option>
        </select>

        <select
          value={conditionFilter}
          onChange={(e) => setConditionFilter(e.target.value)}
          className="px-4 py-3 bg-card border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        >
          <option value="">All Conditions</option>
          <option value="Like New">Like New</option>
          <option value="Good">Good</option>
          <option value="Refurbished">Refurbished</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-card border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        >
          <option value="">All Status</option>
          <option value="available">Available</option>
          <option value="rejected">Rejected</option>
          <option value="sold">Sold</option>
        </select>

        {(search || categoryFilter || conditionFilter || statusFilter) && (
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl text-sm transition-all"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results count */}
      {(search || categoryFilter || conditionFilter || statusFilter) && (
        <p className="text-sm text-gray-400">
          Showing <span className="font-bold text-gray-700">{filteredProducts.length}</span> of {products.length} products
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-card rounded-2xl p-4 animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-card border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
              <FaBoxOpen size={40} className="text-green-400" />
            </div>
            <p className="text-gray-700 font-black text-lg">No Products Found</p>
            <p className="text-gray-400 text-sm">
              {search || categoryFilter || conditionFilter || statusFilter
                ? "Try changing your filters"
                : "No products listed yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-0">
          <div className="grid grid-cols-12 gap-3 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-6 sm:col-span-4 lg:col-span-3">Product</div>
            <div className="hidden lg:block lg:col-span-1">Category</div>
            <div className="hidden sm:block sm:col-span-3 lg:col-span-2">Price</div>
            <div className="col-span-3 sm:col-span-2">Risk</div>
            <div className="hidden lg:block lg:col-span-1">Status</div>
            <div className="col-span-3 text-right">Actions</div>
          </div>

          {filteredProducts.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-3 px-4 py-4 items-center hover:bg-gray-50 transition-all ${
                index !== filteredProducts.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="col-span-6 sm:col-span-4 lg:col-span-3 flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shrink-0">
                  <img
                    src={product.images?.[0]}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-foreground text-sm line-clamp-1">{product.title}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MdVerified className="text-green-500" size={12} />
                    <p className="text-xs text-gray-400 truncate">
                      {product.sellerInfo?.name}
                      <span className="lg:hidden capitalize"> · {product.status}</span>
                    </p>
                  </div>
                  <p className="sm:hidden font-black text-green-600 text-xs mt-0.5">
                    ৳{product.price?.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="hidden lg:flex lg:col-span-1 items-center gap-1 text-xs text-gray-500 min-w-0">
                <FaTag size={10} className="text-green-500" />
                <span>{product.category}</span>
              </div>

              <div className="hidden sm:block sm:col-span-3 lg:col-span-2">
                <p className="font-black text-green-600 text-sm">
                  ৳{product.price?.toLocaleString()}
                </p>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${conditionColors[product.condition] || "bg-gray-100 text-gray-700"}`}>
                  {product.condition}
                </span>
              </div>

              <div className="col-span-3 sm:col-span-2">
                <RiskBadge
                  product={product}
                  openReasonId={openReasonId}
                  setOpenReasonId={setOpenReasonId}
                />
              </div>

              <div className="hidden lg:block lg:col-span-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[product.status] || "bg-gray-100 text-gray-700"}`}>
                  {product.status}
                </span>
              </div>

              <div className="col-span-3 flex items-center justify-end gap-1 sm:gap-2">
                <button
                  onClick={() => handleReanalyze(product._id)}
                  disabled={analyzingId === product._id}
                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all disabled:opacity-50"
                  title="Re-analyze risk"
                >
                  <FaSync size={12} className={analyzingId === product._id ? "animate-spin" : ""} />
                </button>
                {product.status !== "available" && (
                  <button
                    onClick={() => handleUpdateStatus(product._id, "available")}
                    className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center text-green-600 transition-all"
                    title="Approve"
                  >
                    <FaCheck size={13} />
                  </button>
                )}
                {product.status !== "rejected" && (
                  <button
                    onClick={() => handleUpdateStatus(product._id, "rejected")}
                    className="w-8 h-8 rounded-lg bg-yellow-50 hover:bg-yellow-100 flex items-center justify-center text-yellow-600 transition-all"
                    title="Reject"
                  >
                    <FaTimes size={13} />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(product._id)}
                  className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 transition-all"
                  title="Delete"
                >
                  <FaTrash size={13} />
                </button>
              </div>

            </motion.div>
          ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
