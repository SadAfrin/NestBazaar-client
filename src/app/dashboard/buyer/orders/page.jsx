"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaShoppingBag, FaTruck, FaCheckCircle, FaClock, FaTimesCircle, FaBoxOpen, FaTimes, FaEye } from "react-icons/fa";
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

const statusSteps = ["pending", "accepted", "processing", "shipped", "delivered"];

const stepIcons = {
  "pending": <FaClock size={14} />,
  "accepted": <FaCheckCircle size={14} />,
  "processing": <FaBoxOpen size={14} />,
  "shipped": <FaTruck size={14} />,
  "delivered": <FaCheckCircle size={14} />,
};

export default function MyOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

  const getStepIndex = (status) => statusSteps.indexOf(status);

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
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 animate-pulse border-b border-gray-100">
              <div className="col-span-3 h-4 bg-gray-200 rounded" />
              <div className="col-span-3 h-4 bg-gray-200 rounded" />
              <div className="col-span-2 h-4 bg-gray-200 rounded" />
              <div className="col-span-2 h-4 bg-gray-200 rounded" />
              <div className="col-span-2 h-4 bg-gray-200 rounded" />
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
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-2">Order ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-3">Seller</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1 text-right">View</div>
          </div>

          {/* Table Rows */}
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
              {/* Order ID */}
              <div className="col-span-2">
                <p className="font-bold text-gray-800 text-sm">
                  #{order._id?.toString().slice(-6).toUpperCase()}
                </p>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>

              {/* Seller */}
              <div className="col-span-3 flex items-center gap-1">
                <MdVerified className="text-green-500 shrink-0" size={13} />
                <span className="text-sm text-gray-700 truncate">{order.sellerInfo?.name}</span>
              </div>

              {/* Amount */}
              <div className="col-span-2">
                <p className="font-black text-green-600 text-sm">
                  ৳{order.amount?.toLocaleString()}
                </p>
                <span className={`text-xs font-bold capitalize ${
                  order.paymentStatus === "paid" ? "text-green-500" : "text-yellow-500"
                }`}>
                  {order.paymentStatus}
                </span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-700"}`}>
                  {order.orderStatus}
                </span>
              </div>

              {/* View Button */}
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(order)}
                  className="w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 flex items-center justify-center text-blue-600 transition-all"
                  title="View Details"
                >
                  <FaEye size={13} />
                </button>
              </div>

            </motion.div>
          ))}
        </div>
      )}

      {/* Order Detail Modal with Timeline */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-lg"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-black text-gray-800 text-lg">
                  Order #{selectedOrder._id?.toString().slice(-6).toUpperCase()}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(selectedOrder.createdAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "long", day: "numeric"
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-all"
              >
                <FaTimes size={14} />
              </button>
            </div>

            {/* Order Info */}
            <div className="space-y-2 mb-6">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Seller</span>
                <div className="flex items-center gap-1">
                  <MdVerified className="text-green-500" size={13} />
                  <span className="text-sm font-bold text-gray-800">{selectedOrder.sellerInfo?.name}</span>
                </div>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Amount</span>
                <span className="text-sm font-black text-green-600">
                  ৳{selectedOrder.amount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-500">Payment</span>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize ${
                  selectedOrder.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-500">Transaction</span>
                <span className="text-xs text-gray-500 truncate max-w-[180px]">
                  {selectedOrder.transactionId?.slice(-14)}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Order Progress
              </p>
              <div className="flex items-center justify-between">
                {selectedOrder.orderStatus === "cancelled" ? (
                  <div className="flex flex-col items-center gap-2 w-full">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                      <FaTimesCircle size={18} className="text-red-500" />
                    </div>
                    <p className="text-xs font-bold text-red-500">Order Cancelled</p>
                  </div>
                ) : (
                  statusSteps.map((step, index) => {
                    const currentIndex = getStepIndex(selectedOrder.orderStatus);
                    const isDone = index <= currentIndex;
                    const isActive = index === currentIndex;
                    return (
                      <div key={step} className="flex items-center flex-1">
                        <div className="flex flex-col items-center gap-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            isDone
                              ? "bg-green-500 text-white shadow-md shadow-green-200"
                              : "bg-gray-200 text-gray-400"
                          } ${isActive ? "ring-2 ring-green-300 ring-offset-1" : ""}`}>
                            {stepIcons[step]}
                          </div>
                          <p className={`text-[9px] font-bold capitalize text-center ${
                            isDone ? "text-green-600" : "text-gray-400"
                          }`}>
                            {step}
                          </p>
                        </div>
                        {index < statusSteps.length - 1 && (
                          <div className={`flex-1 h-1 mx-1 rounded-full mb-4 ${
                            index < currentIndex ? "bg-green-400" : "bg-gray-200"
                          }`} />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </motion.div>
        </div>
      )}

    </div>
  );
}