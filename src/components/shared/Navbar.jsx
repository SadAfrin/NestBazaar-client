"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "@heroui/react";
import { FaHome, FaShoppingBag, FaTh, FaThLarge, FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { name: "Home", href: "/", icon: <FaHome size={15} /> },
  { name: "Products", href: "/products", icon: <FaShoppingBag size={15} /> },
  { name: "Categories", href: "/categories", icon: <FaTh size={15} /> },
  { name: "Dashboard", href: "/dashboard", icon: <FaThLarge size={15} /> },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Glassmorphism background */}
        <div className="bg-gradient-to-r from-green-50/80 via-emerald-50/80 to-teal-50/80 backdrop-blur-xl border-b border-green-200/60 shadow-[0_4px_30px_rgba(0,128,0,0.08)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-[70px]">

              {/* Logo */}
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="relative w-9 h-9">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-lg shadow-green-200 group-hover:shadow-green-300 transition-all duration-300 group-hover:scale-105">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-black text-base tracking-tight">NB</span>
                    </div>
                  </div>
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
              </div>

              {/* Right Side */}
              <div className="hidden md:flex items-center gap-2">
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
                    Get Started
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-green-50 hover:text-green-600 transition-all"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen
                  ? <FaTimes size={20} />
                  : <FaBars size={20} />
                }
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
                    : "text-gray-600 hover:bg-green-50 hover:text-green-600"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
            <div className="flex gap-2 pt-2 border-t border-gray-100 mt-1">
              <Link href="/login" className="flex-1">
                <Button variant="ghost" size="sm" className="w-full font-semibold text-gray-600 rounded-xl border border-gray-200">
                  Login
                </Button>
              </Link>
              <Link href="/register" className="flex-1">
                <Button size="sm" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl shadow-md">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}