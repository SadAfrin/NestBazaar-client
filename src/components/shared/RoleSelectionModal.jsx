"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { FaShoppingBag, FaStore } from "react-icons/fa";
import { toast } from "react-toastify";

export default function RoleSelectionModal({ session, onComplete }) {
  const [role, setRole] = useState("buyer");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Save to our users collection
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: session.user.name,
          email: session.user.email,
          role: role,
          photo: session.user.image || "",
          location: "",
        }),
      });

      // Update role in users collection
      await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/update-role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          role: role,
        }),
      });

      toast.success(`Welcome to NestBazaar as a ${role}!`);
      onComplete();
      window.location.reload();
    } catch (error) {
      console.error("Modal error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white font-black text-sm">NB</span>
          </div>
          <h2 className="text-2xl font-black text-gray-800">One Last Step!</h2>
          <p className="text-gray-400 text-sm mt-2">
            How would you like to use NestBazaar?
          </p>
        </div>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setRole("buyer")}
            className={`flex-1 flex flex-col items-center gap-3 py-6 rounded-2xl border-2 transition-all duration-200 ${
              role === "buyer"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-200 text-gray-500 hover:border-green-300"
            }`}
          >
            <FaShoppingBag size={28} />
            <div>
              <p className="font-black text-sm">I'm a Buyer</p>
              <p className="text-xs opacity-70 mt-0.5">Browse & buy products</p>
            </div>
          </button>
          <button
            onClick={() => setRole("seller")}
            className={`flex-1 flex flex-col items-center gap-3 py-6 rounded-2xl border-2 transition-all duration-200 ${
              role === "seller"
                ? "border-green-500 bg-green-50 text-green-700"
                : "border-gray-200 text-gray-500 hover:border-green-300"
            }`}
          >
            <FaStore size={28} />
            <div>
              <p className="font-black text-sm">I'm a Seller</p>
              <p className="text-xs opacity-70 mt-0.5">List & sell products</p>
            </div>
          </button>
        </div>

        <Button
          onClick={handleSubmit}
          isLoading={loading}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 rounded-xl shadow-lg"
        >
          {loading ? "Saving..." : "Continue to NestBazaar"}
        </Button>
      </motion.div>
    </div>
  );
}