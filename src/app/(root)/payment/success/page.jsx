import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import PaymentSuccessClient from "@/components/payment/PaymentSuccessClient";

export default async function PaymentSuccessPage({ searchParams }) {
  const { session_id, productId, sellerEmail, sellerName } = await searchParams;

  if (!session_id) redirect("/");

  const session = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ["line_items", "payment_intent"],
  });

  if (session.status === "open") redirect("/");

  if (session.status === "complete") {
    return (
      <PaymentSuccessClient
        session={session}
        productId={productId}
        sellerEmail={sellerEmail}
        sellerName={sellerName}
      />
    );
  }
}