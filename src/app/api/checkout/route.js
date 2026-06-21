import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const { product, buyerEmail, buyerName, sellerEmail, sellerName } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: buyerEmail,
      line_items: [
        {
          price_data: {
            currency: "bdt",
            product_data: {
              name: product.title,
              images: [product.images?.[0]],
              description: product.description?.slice(0, 100),
            },
            unit_amount: product.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&productId=${product._id}&sellerEmail=${sellerEmail}&sellerName=${sellerName}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL}/products/${product._id}`,
      metadata: {
        productId: product._id,
        buyerEmail,
        buyerName,
        sellerEmail,
        sellerName,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}