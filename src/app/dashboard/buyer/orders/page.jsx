"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingBag, FaEye, FaTimes, FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const statusColors = {
  "pending": "bg-yellow-100 text-yellow-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-green-100 text-green-700",
  "cancelled": "bg-red-100 text-red-700",
};

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders?email=${session?.user?.email}`
        );
        const data = await res.json();
        if (data.success) setOrders(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.email) fetchOrders();
  }, [session]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-800">My Orders</h1>
        <p className="text-gray-400 text-sm mt-1">Track and manage your orders</p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center shadow-inner">
              <FaShoppingBag size={40} className="text-blue-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-black text-lg">No Orders Yet</p>
              <p className="text-gray-400 text-sm mt-1">Your orders will appear here</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <p className="font-black text-gray-800">Order #{order._id?.slice(-6).toUpperCase()}</p>
                  <p className="text-sm text-gray-400 mt-1">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                    {order.orderStatus}
                  </span>
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${order.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}