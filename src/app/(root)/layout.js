"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import LiveActivityFeed from "@/components/shared/LiveActivityFeed";
import RoleSelectionModal from "@/components/shared/RoleSelectionModal";
import { useSession } from "@/lib/auth-client";

export default function RootLayout({ children }) {
  const { data: session } = useSession();
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (!session?.user) return;

    const syncUser = async () => {
      try {
        // Check if user exists in our users collection
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/check?email=${session.user.email}`
        );
        const data = await res.json();

        if (!data.exists) {
          // User not in our collection → save them + show role modal
          setShowRoleModal(true);
        }
      } catch (error) {
        console.error("User sync error:", error);
      }
    };

    syncUser();
  }, [session]);

  return (
    <div>
      <Navbar />
      <main className="pt-16">
        {children}
      </main>
      <Footer />
      <LiveActivityFeed />
      {showRoleModal && (
        <RoleSelectionModal
          session={session}
          onComplete={() => setShowRoleModal(false)}
        />
      )}
    </div>
  );
}