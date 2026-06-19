"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LiveActivityFeed from "@/components/shared/LiveActivityFeed";

export default function RootLayout({ children }) {
  return (
    <div>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <LiveActivityFeed />
    </div>
  );
}