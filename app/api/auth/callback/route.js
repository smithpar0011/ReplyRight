import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const state = searchParams.get("state") || "";
  const baseUrl = process.env.NEXTAUTH_URL || new URL(req.url).origin;

  if (error || !code) {
    const detail = encodeURIComponent(error || "no_code");
    return Response.redirect(`${baseUrl}/signin?error=1&detail=${detail}`);
  }

  // Exchange code for tokens
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: `${baseUrl}/api/auth/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokens = await tokenRes.json();

  if (tokens.error) {
    console.error("Token exchange error:", JSON.stringify(tokens));
    const detail = encodeURIComponent(tokens.error_description || tokens.error || "unknown");
    return Response.redirect(`${baseUrl}/signin?error=1&detail=${detail}`);
  }

  // Fetch user profile info
  let userInfo = {};
  try {
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    userInfo = await profileRes.json();
  } catch (e) {
    console.error("Failed to fetch user profile:", e);
  }

  const isSignup = state === "signup";
  const isAdmin = state === "admin";
  const ADMIN_EMAIL = "admin@replyrightapp.com";
  const headers = new Headers();
  const cookieOpts = "HttpOnly; Path=/; SameSite=Lax; Secure; Domain=.replyrightapp.com";

  // Store access token (1 hour)
  headers.append("Set-Cookie", `rr_token=${tokens.access_token}; ${cookieOpts}; Max-Age=3600`);

  // Store refresh token (30 days)
  if (tokens.refresh_token) {
    headers.append("Set-Cookie", `rr_refresh=${tokens.refresh_token}; ${cookieOpts}; Max-Age=2592000`);
  }

  // Store user info readable by client
  const userPayload = JSON.stringify({
    name: userInfo.name || "",
    email: userInfo.email || "",
    picture: userInfo.picture || "",
  });
  headers.append(
    "Set-Cookie",
    `rr_user=${encodeURIComponent(userPayload)}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`
  );

  // Read plan selection from rr_signup cookie (browser sends it on this redirect)
  let signupPlan = null;
  let signupBilling = null;
  const incomingCookies = req.headers.get("cookie") || "";
  const signupCookieMatch = incomingCookies.match(/rr_signup=([^;]+)/);
  if (signupCookieMatch) {
    try {
      const signupData = JSON.parse(decodeURIComponent(signupCookieMatch[1]));
      if (signupData.plan) {
        signupPlan = signupData.plan;
        signupBilling = signupData.billing || "monthly";
      }
    } catch {}
  }

  // Determine where to send the user based on their saved progress
  function getResumeRedirect(user) {
    // Completed signup — restore plan cookies and go to dashboard
    if (user.plan) {
      headers.append("Set-Cookie", `rr_plan=${user.plan}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`);
      headers.append("Set-Cookie", `rr_billing=${user.billing || "monthly"}; Path=/; SameSite=Lax; Secure; Max-Age=2592000`);
      return `${baseUrl}/dashboard`;
    }

    // Determine best plan to restore (prefer cookie, fall back to DB)
    const plan = signupPlan || user.signup_plan;
    const billing = signupBilling || user.signup_billing || "monthly";

    if (plan) {
      // Restore rr_signup cookie so setup/payment pages show correct plan
      const restored = encodeURIComponent(JSON.stringify({ plan, billing }));
      headers.append("Set-Cookie", `rr_signup=${restored}; Path=/; SameSite=Lax; Secure; Max-Age=604800`);
    }

    // Location selected but payment not done — resume at payment
    if (user.google_location_id && plan) {
      return `${baseUrl}/payment`;
    }

    // Otherwise send to setup (pick location, or pick plan if none saved)
    return `${baseUrl}/setup`;
  }

  // ADMIN flow
  if (isAdmin) {
    if (userInfo.email !== ADMIN_EMAIL) {
      headers.set("Location", `${baseUrl}/admin-login?error=not_admin`);
      return new Response(null, { status: 302, headers });
    }
    // Find or create admin user
    let adminUser = null;
    try {
      const { data } = await supabase.from("users").select("*").eq("google_email", userInfo.email).single();
      adminUser = data;
    } catch {}
    if (!adminUser) {
      try {
        const { data } = await supabase.from("users").insert({
          email: userInfo.email,
          name: userInfo.name || "Admin",
          google_email: userInfo.email,
          google_refresh_token: tokens.refresh_token || "",
        }).select().single();
        adminUser = data;
      } catch {}
    } else {
      await supabase.from("users").update({
        google_refresh_token: tokens.refresh_token || adminUser.google_refresh_token || "",
      }).eq("id", adminUser.id);
    }
    if (adminUser) {
      // Use userInfo.email (the verified Google email) — adminUser.email may differ
      const sessionToken = jwt.sign(
        { userId: adminUser.id, email: userInfo.email },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      headers.append("Set-Cookie", `rr_session=${sessionToken}; ${cookieOpts}; Max-Age=2592000`);
    }
    headers.set("Location", `${baseUrl}/admin-dashboard`);
    return new Response(null, { status: 302, headers });
  }

  if (isSignup) {
    // Find or create user from Google account
    let user = null;

    // Check by google_email first
    try {
      const { data } = await supabase.from("users").select("*").eq("google_email", userInfo.email).single();
      user = data;
    } catch (e) {}

    // Fallback: check by email
    if (!user && userInfo.email) {
      try {
        const { data } = await supabase.from("users").select("*").eq("email", userInfo.email).single();
        user = data;
      } catch (e) {}
    }

    if (user) {
      // Update existing user's Google tokens + save plan progress if present
      const updateData = {
        google_email: userInfo.email || "",
        google_refresh_token: tokens.refresh_token || user.google_refresh_token || "",
      };
      if (signupPlan) {
        updateData.signup_plan = signupPlan;
        updateData.signup_billing = signupBilling || "monthly";
      }
      await supabase.from("users").update(updateData).eq("id", user.id);
      user = { ...user, ...updateData };
    } else {
      // Create new user from Google
      try {
        const insertData = {
          email: userInfo.email || "",
          name: userInfo.name || "",
          google_email: userInfo.email || "",
          google_refresh_token: tokens.refresh_token || "",
        };
        if (signupPlan) {
          insertData.signup_plan = signupPlan;
          insertData.signup_billing = signupBilling || "monthly";
        }
        const { data } = await supabase.from("users").insert(insertData).select().single();
        user = data;
      } catch (e) {
        console.error("Failed to create user from Google:", e);
      }
    }

    // Create session for the user
    if (user) {
      const sessionToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      headers.append("Set-Cookie", `rr_session=${sessionToken}; ${cookieOpts}; Max-Age=2592000`);
      headers.set("Location", getResumeRedirect(user));
    } else {
      headers.set("Location", `${baseUrl}/setup`);
    }
  } else {
    // SIGN-IN flow: look up user by google_email or email
    let user = null;
    try {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("google_email", userInfo.email)
        .single();
      user = data;
    } catch (e) {}

    // Fallback: look up by email field
    if (!user && userInfo.email) {
      try {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("email", userInfo.email)
          .single();
        user = data;
      } catch (e) {}
    }

    if (!user) {
      // No account found — redirect to signin with message
      headers.set("Location", `${baseUrl}/signin?error=no_account`);
    } else {
      // Update Google tokens
      const updateData = {
        google_refresh_token: tokens.refresh_token || user.google_refresh_token || "",
      };
      if (signupPlan && !user.plan) {
        updateData.signup_plan = signupPlan;
        updateData.signup_billing = signupBilling || "monthly";
        user = { ...user, ...updateData };
      }
      await supabase.from("users").update(updateData).eq("id", user.id);

      // Generate session token
      const sessionToken = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "30d" }
      );
      headers.append(
        "Set-Cookie",
        `rr_session=${sessionToken}; ${cookieOpts}; Max-Age=2592000`
      );
      headers.set("Location", getResumeRedirect(user));
    }
  }

  return new Response(null, { status: 302, headers });
}
