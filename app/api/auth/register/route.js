import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import supabase from "../../../lib/supabase";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (existing) {
      return Response.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Insert user
    const { data: user, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase().trim(),
        password_hash,
        name: name || "",
      })
      .select("id, email, name")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return Response.json({ error: "Failed to create account" }, { status: 500 });
    }

    // Create JWT session token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    const headers = new Headers();
    headers.append("Content-Type", "application/json");
    headers.append(
      "Set-Cookie",
      `rr_session=${token}; Path=/; SameSite=Lax; HttpOnly; Secure; Max-Age=2592000`
    );

    return new Response(
      JSON.stringify({ success: true, user: { id: user.id, email: user.email, name: user.name } }),
      { status: 200, headers }
    );
  } catch (err) {
    console.error("Register error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
