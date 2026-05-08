import Stripe from "stripe";
import jwt from "jsonwebtoken";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const JWT_SECRET = process.env.JWT_SECRET;

const PRICE_MAP = {
  Starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    annual:  process.env.STRIPE_PRICE_STARTER_ANNUAL,
  },
  Pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    annual:  process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  Agency: {
    monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY,
    annual:  process.env.STRIPE_PRICE_AGENCY_ANNUAL,
  },
};

export async function POST(req) {
  try {
    const { plan, billing } = await req.json();

    const priceId = PRICE_MAP[plan]?.[billing];
    if (!priceId) {
      return Response.json({ error: "Invalid plan or billing period" }, { status: 400 });
    }

    // Get user ID from session cookie so webhook can update the right user
    let userId = null;
    let userEmail = null;
    const cookieHeader = req.headers.get("cookie") || "";
    const sessionMatch = cookieHeader.match(/rr_session=([^;]+)/);
    if (sessionMatch) {
      try {
        const decoded = jwt.verify(sessionMatch[1], JWT_SECRET);
        userId = decoded.userId;
        userEmail = decoded.email;
      } catch (e) {}
    }

    const baseUrl = process.env.NEXTAUTH_URL || "https://www.replyrightapp.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        trial_period_days: 14,
        metadata: { userId: userId || "", plan, billing },
      },
      customer_email: userEmail || undefined,
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/#pricing`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { plan, billing, userId: userId || "" },
    });

    return Response.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return Response.json({ error: err.message || "Failed to create checkout session" }, { status: 500 });
  }
}
