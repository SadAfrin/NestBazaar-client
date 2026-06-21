"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingBag, FaBoxOpen, FaClock, FaTruck, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Link from "next/link";
import { Button } from "@heroui/react";

const statusColors = {
  "pending": "bg-yellow-100 text-yellow-700",
  "accepted": "bg-blue-100 text-blue-700",
  "processing": "bg-purple-100 text-purple-700",
  "shipped": "bg-indigo-100 text-indigo-700",
  "delivered": "bg-green-100 text-green-700",
  "cancelled": "bg-red-100 text-red-700",
};

const statusIcons = {
  "pending": <FaClock size={14} className="text-yellow-500" />,
  "accepted": <FaCheckCircle size={14} className="text-blue-500" />,
  "processing": <FaBoxOpen size={14} className="text-purple-500" />,
  "shipped": <FaTruck size={14} className="text-indigo-500" />,
  "delivered": <FaCheckCircle size={14} className="text-green-500" />,
  "cancelled": <FaTimesCircle size={14} className="text-red-500" />,
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

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">My Orders</h1>
        <p className="text-gray-400 text-sm mt-1">
          {orders.length} total {orders.length === 1 ? "order" : "orders"}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
              <div className="h-4 bg-gray-200 rounded w-1/4" />
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
              <p className="text-gray-400 text-sm mt-1">Start shopping to see your orders here</p>
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
          {orders.map((order, index) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
            >
              {/* Order Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-black text-gray-800">
                    Order #{order._id?.toString().slice(-6).toUpperCase()}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric"
                    })}
                  </p>
                </div>
                <span className={`text-xs font-bold px-3 py-1.5 rounded-xl capitalize flex items-center gap-1.5 ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                  {statusIcons[order.orderStatus]}
                  {order.orderStatus}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-gray-100 mb-4" />

              {/* Order Details */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Amount</span>
                  <span className="text-sm font-black text-green-600">
                    ৳{order.amount?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Payment</span>
                  <span className={`text-xs font-bold capitalize px-2 py-0.5 rounded-lg ${
                    order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Seller</span>
                  <div className="flex items-center gap-1">
                    <MdVerified className="text-green-500" size={12} />
                    <span className="text-xs font-bold text-gray-700">
                      {order.sellerInfo?.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Transaction ID</span>
                  <span className="text-xs text-gray-500 truncate max-w-[140px]">
                    {order.transactionId?.slice(-12)}
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