"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { Button } from "@heroui/react";
import {
  FaHome,
  FaShoppingBag,
  FaTh,
  FaThLarge,
  FaBars,
  FaTimes,
  FaUser,
  FaCog,
  FaShoppingCart,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

const navLinks = [
  { name: "Home", href: "/", icon: <FaHome size={14} /> },
  { name: "Products", href: "/products", icon: <FaShoppingBag size={14} /> },
  { name: "Categories", href: "/categories", icon: <FaTh size={14} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userRole, setUserRole] = useState("buyer");

  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/role?email=${session.user.email}`
        );
        const data = await res.json();
        if (data.success) setUserRole(data.role);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRole();
  }, [session]);

  const ordersHref =
    userRole === "admin"
      ? "/dashboard/admin/manage-orders"
      : userRole === "seller"
      ? "/dashboard/seller/manage-orders"
      : "/dashboard/buyer/orders";

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          setDropdownOpen(false);
          toast.success("Logged out successfully!");
          router.push("/login");
          router.refresh();
        },
        onError: () => {
          toast.error("Logout failed. Please try again.");
        },
      },
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-teal-50/80 backdrop-blur-xl border-b border-green-200/60 shadow-[0_4px_30px_rgba(0,128,0,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[70px]">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-all duration-300 group-hover:scale-105 flex items-center justify-center">
                <span className="text-white font-black text-base">NB</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black bg-gradient-to-r from-green-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent tracking-tight">
                  NestBazaar
                </span>
                <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">
                  Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1 bg-gray-50/80 rounded-2xl px-2 py-1.5 border border-gray-100">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    pathname === link.href
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200"
                      : "text-gray-500 hover:text-green-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}

              {/* Dashboard - only when logged in */}
              {session && (
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    pathname.startsWith("/dashboard")
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md shadow-green-200"
                      : "text-gray-500 hover:text-green-600 hover:bg-white hover:shadow-sm"
                  }`}
                >
                  <FaThLarge size={14} />
                  Dashboard
                </Link>
              )}
            </div>

            {/* Right Side */}
            <div className="hidden md:flex items-center gap-2">
              {session ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 transition-all duration-200"
                  >
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name}
                        className="w-8 h-8 rounded-full object-cover shadow-md border-2 border-green-200"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-700">
                      Hi, {session.user?.name?.split(" ")[0]}
                    </span>
                    <FaChevronDown
                      size={10}
                      className={`text-gray-400 transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-white/90 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-xl shadow-gray-100 py-2 z-50">
                      <Link
                        href="/dashboard/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
                      >
                        <FaUser size={13} />
                        My Profile
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
                      >
                        <FaCog size={13} />
                        Settings
                      </Link>
                      <Link
                        href={ordersHref}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
                      >
                        <FaShoppingCart size={13} />
                        Orders
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-all"
                        >
                          <FaSignOutAlt size={13} />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 font-semibold hover:text-green-600 hover:bg-green-50 rounded-xl px-5"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl px-5 shadow-lg shadow-green-200 hover:shadow-green-300 hover:scale-[1.02] transition-all duration-200"
                    >
                      Register
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-green-50/90 backdrop-blur-xl border-b border-green-200/60 shadow-xl px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                pathname === link.href
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-green-100 hover:text-green-600"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {/* Dashboard mobile */}
          {session && (
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                pathname.startsWith("/dashboard")
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                  : "text-gray-600 hover:bg-green-100 hover:text-green-600"
              }`}
            >
              <FaThLarge size={14} />
              Dashboard
            </Link>
          )}

          <div className="border-t border-gray-200 pt-2 mt-1">
            {session ? (
              <div className="flex flex-col gap-2">
                {/* User info */}
                <div className="flex items-center gap-3 px-4 py-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-green-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-bold shadow-md">
                      {session.user?.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-bold text-gray-700">Hi, {session.user?.name?.split(" ")[0]}</p>
                    <p className="text-xs text-gray-400">{session.user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-green-100 hover:text-green-600 transition-all"
                >
                  <FaUser size={13} /> My Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-green-100 hover:text-green-600 transition-all"
                >
                  <FaCog size={13} /> Settings
                </Link>
                <Link
                  href={ordersHref}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-600 hover:bg-green-100 hover:text-green-600 transition-all"
                >
                  <FaShoppingCart size={13} /> Orders
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
                >
                  <FaSignOutAlt size={14} /> Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button variant="ghost" className="w-full font-semibold text-gray-600 rounded-xl border border-gray-200">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}