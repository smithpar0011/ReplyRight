import Stripe from "stripe";
import supabase from "../../../lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature error:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const { plan, billing, userId } = session.metadata || {};
      const email = session.customer_email || session.customer_details?.email;
      if (plan && (userId || email)) {
        const update = { plan, billing: billing || "monthly", stripe_customer_id: session.customer };
        const { error } = userId
          ? await supabase.from("users").update(update).eq("id", userId)
          : await supabase.from("users").update(update).eq("email", email);
        if (error) console.error("Supabase plan update error:", error);
        else console.log("Plan updated:", plan, "for", userId || email);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object;
      const { userId, plan, billing } = sub.metadata || {};
      if ((sub.status === "active" || sub.status === "trialing") && userId && plan) {
        await supabase.from("users").update({ plan, billing: billing || "monthly" }).eq("id", userId);
      } else if ((sub.status === "past_due" || sub.status === "unpaid") && userId) {
        await supabase.from("users").update({ plan: null }).eq("id", userId);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object;
      const { userId } = sub.metadata || {};
      const customerId = sub.customer;
      if (userId) {
        await supabase.from("users").update({ plan: null, billing: null }).eq("id", userId);
      } else if (customerId) {
        await supabase.from("users").update({ plan: null, billing: null }).eq("stripe_customer_id", customerId);
      }
      break;
    }
    default:
      break;
  }

  return new Response("ok", { status: 200 });
}
