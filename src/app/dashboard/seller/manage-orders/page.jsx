"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaEye, FaCheck, FaTimes, FaTruck, FaBoxOpen } from "react-icons/fa";
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

export default function ManageOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/seller?email=${session?.user?.email}`
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
    if (session?.user?.email) fetchOrders();
  }, [session]);

  useEffect(() => {
    if (!session?.user?.email) return;
    const interval = setInterval(() => {
      fetchOrders();
    }, 30000);
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    if (selectedOrder) {
      const updated = orders.find(o => o._id === selectedOrder._id);
      if (updated) setSelectedOrder(updated);
    }
  }, [orders]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ orderStatus: newStatus }),
        }
      );
      const data = await res.json();
      if (data.success) {
        toast.success(`Order marked as ${newStatus}!`);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        toast.error("Failed to update order!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-800">Manage Orders</h1>
        <p className="text-gray-400 text-sm mt-1">{orders.length} total orders</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
              <FaClipboardList size={40} className="text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-black text-lg">No Orders Yet</p>
              <p className="text-gray-400 text-sm mt-1">Orders from buyers will appear here</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-3">Order ID</div>
            <div className="col-span-3">Buyer</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-all ${
                index !== orders.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="col-span-3">
                <p className="font-bold text-gray-800 text-sm">#{order._id?.toString().slice(-6).toUpperCase()}</p>
                <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="col-span-3">
                <p className="font-bold text-gray-800 text-sm">{order.buyerInfo?.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{order.buyerInfo?.email}</p>
              </div>
              <div className="col-span-2">
                <p className="font-black text-green-600 text-sm">৳{order.amount?.toLocaleString()}</p>
                <p className={`text-xs font-bold mt-0.5 ${order.paymentStatus === "paid" ? "text-green-500" : "text-yellow-500"}`}>
                  {order.paymentStatus}
                </p>
              </div>
              <div className="col-span-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                  {order.orderStatus}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end">
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
                <span className="text-sm text-gray-500">Email</span>
                <span className="text-sm font-bold text-gray-800">{selectedOrder.buyerInfo?.email}</span>
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

            <div className="space-y-3">
              <p className="text-sm font-bold text-gray-600">Update Order Status:</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedOrder.orderStatus === "pending" && (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, "accepted")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-xl transition-all"
                    >
                      <FaCheck size={12} /> Accept Order
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder._id, "cancelled")}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-all"
                    >
                      <FaTimes size={12} /> Reject Order
                    </button>
                  </>
                )}
                {selectedOrder.orderStatus === "accepted" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, "processing")}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-bold rounded-xl transition-all col-span-2"
                  >
                    <FaBoxOpen size={12} /> Mark as Processing
                  </button>
                )}
                {selectedOrder.orderStatus === "processing" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, "shipped")}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-bold rounded-xl transition-all col-span-2"
                  >
                    <FaTruck size={12} /> Mark as Shipped
                  </button>
                )}
                {selectedOrder.orderStatus === "shipped" && (
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder._id, "delivered")}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all col-span-2"
                  >
                    <FaCheck size={12} /> Mark as Delivered
                  </button>
                )}
                {(selectedOrder.orderStatus === "delivered" || selectedOrder.orderStatus === "cancelled") && (
                  <div className="col-span-2 text-center py-3 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-400 font-bold">
                      Order is {selectedOrder.orderStatus}. No further actions needed.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}