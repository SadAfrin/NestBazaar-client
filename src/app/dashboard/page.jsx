"use client";

import { useSession } from "@/lib/auth-client";
import BuyerDashboard from "@/components/dashboard/buyer/BuyerOverview";
import SellerDashboard from "@/components/dashboard/seller/SellerOverview";
import AdminDashboard from "@/components/dashboard/admin/AdminOverview";

export default function DashboardPage() {
  const { data: session } = useSession();
  const role = session?.user?.role || "buyer";

  if (role === "admin") return <AdminDashboard />;
  if (role === "seller") return <SellerDashboard />;
  return <BuyerDashboard />;
}