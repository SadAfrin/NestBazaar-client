import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ],
  categories: [
    { name: "Electronics", href: "/categories/electronics" },
    { name: "Furniture", href: "/categories/furniture" },
    { name: "Fashion", href: "/categories/fashion" },
    { name: "Vehicles", href: "/categories/vehicles" },
    { name: "Mobile Phones", href: "/categories/mobile-phones" },
  ],
};

const socialLinks = [
  { icon: <FaFacebookF size={14} />, href: "#", label: "Facebook" },
  { icon: <FaXTwitter size={14} />, href: "#", label: "Twitter" },
  { icon: <FaInstagram size={14} />, href: "#", label: "Instagram" },
  { icon: <FaLinkedinIn size={14} />, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-300">

      {/* Top Wave */}
      <div className="w-full overflow-hidden leading-none">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="fill-emerald-50">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,0 L0,0 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-base">NB</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-black text-white tracking-tight">NestBazaar</span>
                <span className="text-[9px] text-green-400 font-medium tracking-widest uppercase">Marketplace</span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Your trusted second-hand marketplace. Buy and sell pre-owned products safely, sustainably, and efficiently.
            </p>
            <div className="flex gap-2 pt-1">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg bg-green-500/20 hover:bg-green-500 flex items-center justify-center text-green-400 hover:text-white transition-all duration-200 hover:scale-110"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-green-400 transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-green-500 group-hover:w-2 transition-all duration-200"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white font-bold text-sm uppercase tracking-widest">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MdLocationOn size={18} className="text-green-400 mt-0.5 shrink-0" />
                <span>Dhaka, Bangladesh</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <MdPhone size={18} className="text-green-400 shrink-0" />
                <span>+880 1700 000000</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <MdEmail size={18} className="text-green-400 shrink-0" />
                <span>support@nestbazaar.com</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} NestBazaar. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Made with 💚 for sustainable shopping
          </p>
        </div>
      </div>

    </footer>
  );
}