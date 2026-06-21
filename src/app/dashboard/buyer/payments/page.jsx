"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCreditCard, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";

const statusColors = {
  "success": "bg-green-100 text-green-700",
  "pending": "bg-yellow-100 text-yellow-700",
  "failed": "bg-red-100 text-red-700",
};

const statusIcons = {
  "success": <FaCheckCircle className="text-green-500" size={13} />,
  "pending": <FaClock className="text-yellow-500" size={13} />,
  "failed": <FaTimesCircle className="text-red-500" size={13} />,
};

export default function PaymentHistoryPage() {
  const { data: session } = useSession();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payments?email=${session?.user?.email}`
        );
        const data = await res.json();
        if (data.success) setPayments(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.email) fetchPayments();
  }, [session]);

  const totalSpent = payments
    .filter(p => p.paymentStatus === "success")
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-800">Payment History</h1>
        <p className="text-gray-400 text-sm mt-1">
          {payments.length} total {payments.length === 1 ? "transaction" : "transactions"}
        </p>
      </div>

      {/* Summary Card */}
      {payments.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Spent</p>
            <p className="text-2xl font-black text-green-600">৳{totalSpent.toLocaleString()}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Transactions</p>
            <p className="text-2xl font-black text-gray-800">{payments.length}</p>
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Successful</p>
            <p className="text-2xl font-black text-gray-800">
              {payments.filter(p => p.paymentStatus === "success").length}
            </p>
          </div>
        </div>
      )}

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
      ) : payments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
              <FaCreditCard size={40} className="text-green-400" />
            </div>
            <div className="text-center">
              <p className="text-gray-700 font-black text-lg">No Payments Yet</p>
              <p className="text-gray-400 text-sm mt-1">Your payment history will appear here</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">

          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-3">Transaction ID</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Method</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-3">Status</div>
          </div>

          {payments.map((payment, index) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-all ${
                index !== payments.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              {/* Transaction ID */}
              <div className="col-span-3">
                <p className="text-xs font-bold text-gray-700 truncate">
                  {payment.transactionId?.slice(-14)}
                </p>
              </div>

              {/* Date */}
              <div className="col-span-2">
                <p className="text-xs text-gray-500">
                  {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })}
                </p>
              </div>

              {/* Method */}
              <div className="col-span-2">
                <span className="text-xs font-bold text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded-lg">
                  {payment.paymentMethod || "stripe"}
                </span>
              </div>

              {/* Amount */}
              <div className="col-span-2">
                <p className="font-black text-green-600 text-sm">
                  ৳{payment.amount?.toLocaleString()}
                </p>
              </div>

              {/* Status */}
              <div className="col-span-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-lg capitalize flex items-center gap-1.5 w-fit ${statusColors[payment.paymentStatus] || "bg-gray-100 text-gray-700"}`}>
                  {statusIcons[payment.paymentStatus]}
                  {payment.paymentStatus}
                </span>
              </div>

            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}