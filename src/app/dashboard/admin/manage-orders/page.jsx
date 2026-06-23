"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaSearch, FaEye, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const statusColors = {
  "pending": "bg-yellow-100 text-yellow-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-green-100 text-green-700",
  "cancelled": "bg-red-100 text-red-700",
};

const statusOptions = ["pending", "accepted", "processing", "shipped", "delivered", "cancelled"];

export default function AdminManageOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/orders`
      );
      const data = await res.json();
      if (data.success) setOrders(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(o => o._id === selectedOrder._id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ orderStatus: status }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Order status updated to ${status}!`);
        fetchOrders();
        setSelectedOrder(null);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentFilter("");
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      o.buyerInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      o.buyerInfo?.email?.toLowerCase().includes(search.toLowerCase()) ||
      o.sellerInfo?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? o.orderStatus === statusFilter : true;
    const matchPayment = paymentFilter ? o.paymentStatus === paymentFilter : true;
    return matchSearch && matchStatus && matchPayment;
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-800">Manage Orders</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by buyer or seller name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
          />
        </div>

        {/* Order Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* Payment Status Filter */}
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        >
          <option value="">All Payments</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
        </select>

        {/* Reset */}
        {(search || statusFilter || paymentFilter) && (
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl text-sm transition-all"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results count */}
      {(search || statusFilter || paymentFilter) && (
        <p className="text-sm text-gray-400">
          Showing <span className="font-bold text-gray-700">{filteredOrders.length}</span> of {orders.length} orders
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
              <FaClipboardList size={40} className="text-green-400" />
            </div>
            <p className="text-gray-700 font-black text-lg">No Orders Found</p>
            <p className="text-gray-400 text-sm">
              {search || statusFilter || paymentFilter
                ? "Try changing your filters"
                : "No orders yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-3">Buyer</div>
            <div className="col-span-2">Seller</div>
            <div className="col-span-1">Amount</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1 text-right">View</div>
          </div>

          {filteredOrders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-all ${
                index !== filteredOrders.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="col-span-2">
                <p className="font-bold text-gray-800 text-sm">#{order._id?.toString().slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="col-span-3">
                <p className="font-bold text-gray-800 text-sm">{order.buyerInfo?.name}</p>
                <p className="text-xs text-gray-400">{order.buyerInfo?.email}</p>
              </div>
              <div className="col-span-2">
                <p className="font-bold text-gray-800 text-sm">{order.sellerInfo?.name}</p>
                <p className="text-xs text-gray-400">{order.sellerInfo?.email}</p>
              </div>
              <div className="col-span-1">
                <p className="font-black text-green-600 text-sm">৳{order.amount?.toLocaleString()}</p>
              </div>
              <div className="col-span-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${
                  order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="col-span-1">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all"
                >
                  <FaEye size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-gray-800 text-lg">
                Order #{selectedOrder._id?.toString().slice(-6).toUpperCase()}
              </h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600"
              >
                <FaTimes size={14} />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Buyer</span>
                <span className="text-sm font-bold text-gray-800">{selectedOrder.buyerInfo?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Seller</span>
                <span className="text-sm font-bold text-gray-800">{selectedOrder.sellerInfo?.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-black text-green-600">৳{selectedOrder.amount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Payment</span>
                <span className={`text-sm font-bold capitalize ${selectedOrder.paymentStatus === "paid" ? "text-green-600" : "text-yellow-600"}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Current Status</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[selectedOrder.orderStatus]}`}>
                  {selectedOrder.orderStatus}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-bold text-gray-600">Update Status:</p>
              <div className="grid grid-cols-3 gap-2">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedOrder._id, status)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                      selectedOrder.orderStatus === status
                        ? "bg-green-500 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 text-center pt-2">
                Admin can override any order status
              </p>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}