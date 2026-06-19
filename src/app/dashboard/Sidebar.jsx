"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";

// Buyer links
import {
  FaHome,
  FaShoppingBag,
  FaHeart,
  FaCreditCard,
  FaUser,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

// Seller links
import {
  FaPlus,
  FaBoxOpen,
  FaClipboardList,
  FaChartBar,
} from "react-icons/fa";

// Admin links
import {
  FaUsers,
  FaShieldAlt,
  FaTachometerAlt,
} from "react-icons/fa";

const buyerLinks = [
  { name: "Overview", href: "/dashboard", icon: <FaHome size={16} /> },
  { name: "My Orders", href: "/dashboard/orders", icon: <FaShoppingBag size={16} /> },
  { name: "Wishlist", href: "/dashboard/wishlist", icon: <FaHeart size={16} /> },
  { name: "Payment History", href: "/dashboard/payments", icon: <FaCreditCard size={16} /> },
  { name: "My Profile", href: "/dashboard/profile", icon: <FaUser size={16} /> },
  { name: "Settings", href: "/dashboard/settings", icon: <FaCog size={16} /> },
];

const sellerLinks = [
  { name: "Overview", href: "/dashboard", icon: <FaHome size={16} /> },
  { name: "Add Product", href: "/dashboard/add-product", icon: <FaPlus size={16} /> },
  { name: "My Products", href: "/dashboard/my-products", icon: <FaBoxOpen size={16} /> },
  { name: "Manage Orders", href: "/dashboard/manage-orders", icon: <FaClipboardList size={16} /> },
  { name: "Sales Analytics", href: "/dashboard/analytics", icon: <FaChartBar size={16} /> },
  { name: "My Profile", href: "/dashboard/profile", icon: <FaUser size={16} /> },
  { name: "Settings", href: "/dashboard/settings", icon: <FaCog size={16} /> },
];

const adminLinks = [
  { name: "Overview", href: "/dashboard", icon: <FaTachometerAlt size={16} /> },
  { name: "Manage Users", href: "/dashboard/manage-users", icon: <FaUsers size={16} /> },
  { name: "Manage Products", href: "/dashboard/manage-products", icon: <FaBoxOpen size={16} /> },
  { name: "Manage Orders", href: "/dashboard/manage-orders", icon: <FaClipboardList size={16} /> },
  { name: "Platform Analytics", href: "/dashboard/analytics", icon: <FaChartBar size={16} /> },
  { name: "Settings", href: "/dashboard/settings", icon: <FaShieldAlt size={16} /> },
];

export default function Sidebar({ onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  const role = session?.user?.role || "buyer";

  const links =
    role === "admin"
      ? adminLinks
      : role === "seller"
      ? sellerLinks
      : buyerLinks;

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully!");
          router.push("/login");
          router.refresh();
        },
      },
    });
  };

  return (
    <div className="h-full bg-white border-r border-gray-100 flex flex-col shadow-sm">

      {/* Logo */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-base">N</span>
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-base font-black bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
              NestBazaar
            </span>
            <span className="text-[9px] text-gray-400 font-medium tracking-widest uppercase">
              Marketplace
            </span>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600">
            <FaTimes size={16} />
          </button>
        )}
      </div>

      {/* User Info */}
      <div className="p-4 mx-3 mt-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
        <div className="flex items-center gap-3">
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-green-200"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white font-black shadow-md">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-black text-gray-800 truncate">{session?.user?.name}</p>
            <span className="text-xs font-bold text-green-600 capitalize bg-green-100 px-2 py-0.5 rounded-full">
              {role}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">
          Navigation
        </p>
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            onClick={onClose}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
              pathname === link.href
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-200"
                : "text-gray-600 hover:bg-green-50 hover:text-green-600"
            }`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
        >
          <FaSignOutAlt size={16} />
          Logout
        </button>
      </div>

    </div>
  );
}