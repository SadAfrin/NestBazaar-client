"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { FaBars, FaTimes } from "react-icons/fa";

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar — desktop */}
      <div className="hidden lg:block w-64 shrink-0">
        <Sidebar />
      </div>

      {/* Sidebar — mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — mobile drawer */}
      <div className={`fixed top-0 left-0 h-full w-64 z-50 lg:hidden transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top Bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-all"
              onClick={() => setSidebarOpen(true)}
            >
              <FaBars size={18} />
            </button>
            <div>
              <h2 className="font-black text-gray-800 text-lg">Dashboard</h2>
              <p className="text-xs text-gray-400 capitalize">{session.user?.role || "buyer"} Account</p>
            </div>
          </div>

          {/* User info */}
          <div className="flex items-center gap-3">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-9 h-9 rounded-full object-cover border-2 border-green-200"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black shadow-md">
                {session.user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="hidden sm:block">
              <p className="text-sm font-black text-gray-700">{session.user?.name}</p>
              <p className="text-xs text-gray-400">{session.user?.email}</p>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>

      </div>
    </div>
  );
}