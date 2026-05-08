import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;

// In-memory rate limit store: ip -> { count, firstAttempt }
// Works per serverless instance — good enough to stop basic brute force
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req) {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

function checkRateLimit(ip) {
  const now = Date.now();
  const record = loginAttempts.get(ip);

  if (!record) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  // Reset window if expired
  if (now - record.firstAttempt > WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    const minutesLeft = Math.ceil((WINDOW_MS - (now - record.firstAttempt)) / 60000);
    return { allowed: false, minutesLeft };
  }

  record.count++;
  return { allowed: true };
}

function resetRateLimit(ip) {
  loginAttempts.delete(ip);
}

export async function POST(req) {
  const ip = getClientIp(req);
  const { allowed, minutesLeft } = checkRateLimit(ip);

  if (!allowed) {
    return Response.json(
      { error: `Too many login attempts. Try again in ${minutesLeft} minute${minutesLeft !== 1 ? "s" : ""}.` },
      { status: 429 }
    );
  }

  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Find user
    const { data: user, error } = await supabase
      .from("users")
      .select("id, email, name, password_hash, plan, billing")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (!user || error) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Verify password
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return Response.json({ error: "Invalid email or password" }, { status: 401 });
    }

    // Success — clear rate limit for this IP
    resetRateLimit(ip);

    // Create JWT session token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const userPayload = JSON.stringify({ name: user.name || '', email: user.email || '', picture: '' });
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Set-Cookie', `rr_session=${token}; Path=/; SameSite=Lax; HttpOnly; Secure; Max-Age=2592000`);
    headers.append('Set-Cookie', `rr_user=${encodeURIComponent(userPayload)}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`);
    if (user.plan) headers.append('Set-Cookie', `rr_plan=${encodeURIComponent(user.plan)}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`);
    if (user.billing) headers.append('Set-Cookie', `rr_billing=${encodeURIComponent(user.billing)}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`);

    return new Response(
      JSON.stringify({ success: true, user: { id: user.id, email: user.email, name: user.name, plan: user.plan, billing: user.billing } }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Login error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
