"use client";

import { useSession } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import BuyerOverview from "@/components/dashboard/buyer/BuyerOverview";
import SellerOverview from "@/components/dashboard/seller/SellerOverview";
import AdminOverview from "@/components/dashboard/admin/AdminOverview";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!session?.user?.email) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/role?email=${session.user.email}`);
        const data = await res.json();
        if (data.success) {
          setRole(data.role);
        } else {
          setRole(session?.user?.role || "buyer");
        }
      } catch {
        setRole(session?.user?.role || "buyer");
      }
    };
    fetchRole();
  }, [session]);

  if (!role) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
    </div>
  );

  if (role === "admin") return <AdminOverview />;
  if (role === "seller") return <SellerOverview />;
  return <BuyerOverview />;
}