import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return Response.json({ error: "session_id is required" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return Response.json({
      plan: session.metadata?.plan || "Starter",
      billing: session.metadata?.billing || "monthly",
      status: session.status,
      customer_email: session.customer_email || session.customer_details?.email || "",
      customer_id: session.customer,
      subscription_id: session.subscription,
    });
  } catch (err) {
    console.error("Stripe session error:", err);
    return Response.json({ error: "Failed to retrieve session" }, { status: 500 });
  }
}
