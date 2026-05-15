import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";
import Anthropic from "@anthropic-ai/sdk";

export const maxDuration = 60;

const JWT_SECRET = process.env.JWT_SECRET;
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const STAR_MAP = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 };
const PLAN_BACKFILL_LIMITS = { Starter: 20, Pro: 50, Agency: 100 };

async function refreshGoogleToken(refreshToken) {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });
  return res.json();
}

async function generateReply(bizName, stars, reviewText, reviewerName, usedOpenings) {
  const starStrategy =
    stars <= 2
      ? `${stars}-star review. Lead with a sincere, specific apology. Validate their frustration. Offer a concrete next step.`
      : stars === 3
      ? `3-star mixed review. Acknowledge both positives and negatives. Show you heard the criticism.`
      : `${stars}-star review. Express genuine, specific gratitude. Mirror their energy. Make them feel seen.`;

  const avoidSection =
    usedOpenings.length > 0
      ? `\n\nDo NOT start with any variation of these already-used openings:\n${usedOpenings.map((s) => `• "${s}"`).join("\n")}`
      : "";

  const msg = await client.messages.create({
    model: "claude-sonnet-4-5",
    max_tokens: 350,
    messages: [
      {
        role: "user",
        content: `Write a Google review response for "${bizName}".

REVIEWER: ${reviewerName || "Anonymous"} — ${stars} star${stars !== 1 ? "s" : ""}
REVIEW: "${reviewText}"

STRATEGY: ${starStrategy}

RULES:
- 65–115 words. Sound like a real business owner, not a template.
- Reference at least one specific detail from the review.
- BANNED: "We value your feedback", "We appreciate your business", "We strive to", "Thank you for taking the time", "Thank you for your review", "means the world to us"
- Never start with "Thank you for your"
- Max 1 exclamation point${avoidSection}

Output the response text ONLY.`,
      },
    ],
  });
  return msg.content[0].text;
}

export async function POST(req) {
  const sessionToken = req.cookies.get("rr_session")?.value;
  if (!sessionToken) return Response.json({ error: "Not authenticated" }, { status: 401 });

  let userId;
  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET);
    userId = decoded.userId;
  } catch {
    return Response.json({ error: "Invalid session" }, { status: 401 });
  }

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });
  if (user.backfill_done) return Response.json({ skipped: true, responded: 0, total: 0 });

  const plan = user.plan || "Starter";
  const limit = PLAN_BACKFILL_LIMITS[plan] ?? 20;

  if (!user.google_refresh_token) {
    return Response.json({ error: "No Google account connected" }, { status: 400 });
  }

  const tokenData = await refreshGoogleToken(user.google_refresh_token);
  if (!tokenData.access_token) {
    return Response.json({ error: "Failed to refresh Google token" }, { status: 401 });
  }
  const token = tokenData.access_token;
  const authHeader = { Authorization: `Bearer ${token}` };

  const locationId = user.google_location_id;
  if (!locationId) return Response.json({ error: "No location selected" }, { status: 400 });

  const reviewsRes = await fetch(
    `https://mybusiness.googleapis.com/v4/${locationId}/reviews?pageSize=50`,
    { headers: authHeader }
  );
  const reviewsData = await reviewsRes.json();
  const allReviews = reviewsData.reviews || [];

  const unanswered = allReviews.filter((r) => !r.reviewReply && r.comment);
  const toRespond = unanswered.slice(0, limit);

  const bizName = user.google_location_name || "our business";
  let responded = 0;
  const usedOpenings = [];
  const BATCH = 5;

  for (let i = 0; i < toRespond.length; i += BATCH) {
    const batch = toRespond.slice(i, i + BATCH);

    const generated = await Promise.all(
      batch.map(async (review) => {
        try {
          const stars = STAR_MAP[review.starRating] || 5;
          const text = await generateReply(
            bizName,
            stars,
            review.comment,
            review.reviewer?.displayName || "Anonymous",
            usedOpenings
          );
          return { review, text };
        } catch {
          return { review, text: null };
        }
      })
    );

    await Promise.all(
      generated.map(async ({ review, text }) => {
        if (!text) return;
        usedOpenings.push(text.split(/[.!?]/)[0].trim());
        try {
          const res = await fetch(
            `https://mybusiness.googleapis.com/v4/${review.name}/reply`,
            {
              method: "PUT",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ comment: text }),
            }
          );
          if (res.ok) responded++;
        } catch {}
      })
    );
  }

  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1, 1);
  const resetDate = nextMonth.toISOString().split("T")[0];

  await supabase.from("users").update({
    backfill_done: true,
    monthly_reply_count: responded,
    monthly_reset_date: resetDate,
  }).eq("id", userId);

  return Response.json({ responded, total: toRespond.length, plan });
}
