"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCreditCard, FaSearch, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { fetchWithAuth } from "@/lib/fetchWithAuth";

const statusColors = {
  "paid": "bg-green-100 text-green-700",
  "success": "bg-green-100 text-green-700",
  "pending": "bg-yellow-100 text-yellow-700",
  "failed": "bg-red-100 text-red-700",
  "refunded": "bg-purple-100 text-purple-700",
};

const statusIcons = {
  "paid": <FaCheckCircle className="text-green-500" size={13} />,
  "success": <FaCheckCircle className="text-green-500" size={13} />,
  "pending": <FaClock className="text-yellow-500" size={13} />,
  "failed": <FaTimesCircle className="text-red-500" size={13} />,
  "refunded": <FaTimesCircle className="text-purple-500" size={13} />,
};

export default function ManagePaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchPayments = async () => {
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/payments`
      );
      const data = await res.json();
      if (data.success) setPayments(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const totalRevenue = payments
    .filter(p => p.paymentStatus === "paid" || p.paymentStatus === "success")
    .reduce((acc, p) => acc + (p.amount || 0), 0);

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
  };

  const filteredPayments = payments.filter((p) => {
    const matchSearch =
      p.buyerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter ? p.paymentStatus === statusFilter : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-black text-gray-800">Manage Payments</h1>
        <p className="text-gray-400 text-sm mt-1">{payments.length} total transactions</p>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Revenue</p>
          <p className="text-2xl font-black text-green-600">৳{totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Total Transactions</p>
          <p className="text-2xl font-black text-gray-800">{payments.length}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">Successful</p>
          <p className="text-2xl font-black text-gray-800">
            {payments.filter(p => p.paymentStatus === "paid" || p.paymentStatus === "success").length}
          </p>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search by email or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:border-green-400 transition-all shadow-sm"
        >
          <option value="">All Status</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>

        {(search || statusFilter) && (
          <button
            onClick={handleReset}
            className="px-4 py-3 bg-red-50 hover:bg-red-100 text-red-500 font-bold rounded-xl text-sm transition-all"
          >
            Reset
          </button>
        )}
      </div>

      {/* Results count */}
      {(search || statusFilter) && (
        <p className="text-sm text-gray-400">
          Showing <span className="font-bold text-gray-700">{filteredPayments.length}</span> of {payments.length} transactions
        </p>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="grid grid-cols-12 gap-4 px-4 py-4 animate-pulse border-b border-gray-100">
              <div className="col-span-3 h-4 bg-gray-200 rounded" />
              <div className="col-span-3 h-4 bg-gray-200 rounded" />
              <div className="col-span-2 h-4 bg-gray-200 rounded" />
              <div className="col-span-2 h-4 bg-gray-200 rounded" />
              <div className="col-span-2 h-4 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center shadow-inner">
              <FaCreditCard size={40} className="text-green-400" />
            </div>
            <p className="text-gray-700 font-black text-lg">No Transactions Found</p>
            <p className="text-gray-400 text-sm">
              {search || statusFilter ? "Try changing your filters" : "No payments yet"}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            <div className="col-span-3">Transaction ID</div>
            <div className="col-span-3">Buyer Email</div>
            <div className="col-span-2">Amount</div>
            <div className="col-span-2">Date</div>
            <div className="col-span-2">Status</div>
          </div>

          {filteredPayments.map((payment, index) => (
            <motion.div
              key={payment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-gray-50 transition-all ${
                index !== filteredPayments.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="col-span-3">
                <p className="text-xs font-bold text-gray-700 truncate">
                  {payment.transactionId?.slice(-14)}
                </p>
              </div>
              <div className="col-span-3">
                <p className="text-xs text-gray-600 truncate">{payment.buyerEmail}</p>
              </div>
              <div className="col-span-2">
                <p className="font-black text-green-600 text-sm">
                  ৳{payment.amount?.toLocaleString()}
                </p>
              </div>
              <div className="col-span-2">
                <p className="text-xs text-gray-500">
                  {new Date(payment.paymentDate || payment.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric"
                  })}
                </p>
              </div>
              <div className="col-span-2">
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