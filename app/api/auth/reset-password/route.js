import bcrypt from "bcryptjs";
import supabase from "../../../lib/supabase";

export async function POST(req) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return Response.json({ error: "Token and new password are required" }, { status: 400 });
    }
    if (newPassword.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Find user by reset token
    const { data: user } = await supabase
      .from("users")
      .select("id, reset_token_expires")
      .eq("reset_token", token)
      .single();

    if (!user) {
      return Response.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    // Check expiry
    if (new Date(user.reset_token_expires) < new Date()) {
      return Response.json({ error: "Reset link has expired. Please request a new one." }, { status: 400 });
    }

    // Hash new password and update
    const password_hash = await bcrypt.hash(newPassword, 12);

    await supabase
      .from("users")
      .update({
        password_hash,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    return Response.json({ success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
