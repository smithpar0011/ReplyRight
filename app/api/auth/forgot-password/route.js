import crypto from "crypto";
import { Resend } from "resend";
import supabase from "../../../lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Always return success (don't reveal if email exists)
    const { data: user } = await supabase
      .from("users")
      .select("id, email, name")
      .eq("email", email.toLowerCase().trim())
      .single();

    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

      await supabase
        .from("users")
        .update({ reset_token: resetToken, reset_token_expires: expires })
        .eq("id", user.id);

      const baseUrl = process.env.NEXTAUTH_URL || "https://www.replyrightapp.com";
      const resetLink = `${baseUrl}/reset-password?token=${resetToken}`;

      await resend.emails.send({
        from: "ReplyRight <noreply@replyrightapp.com>",
        to: user.email,
        subject: "Reset your ReplyRight password",
        html: `
          <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 2rem;">
            <h2 style="color: #0f1f38; margin-bottom: 1rem;">Reset your password</h2>
            <p style="color: #4a5568; line-height: 1.6;">
              Hi${user.name ? ` ${user.name}` : ""},<br><br>
              We received a request to reset your ReplyRight password. Click the button below to create a new password.
            </p>
            <a href="${resetLink}" style="display: inline-block; background: #0f1f38; color: white; padding: 12px 28px; border-radius: 100px; text-decoration: none; font-weight: 600; margin: 1.5rem 0;">
              Reset Password
            </a>
            <p style="color: #8896a7; font-size: 0.85rem; line-height: 1.6;">
              This link expires in 1 hour. If you didn't request this, you can safely ignore this email.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 2rem 0;" />
            <p style="color: #a0aec0; font-size: 0.75rem;">ReplyRight · AI-powered review responses</p>
          </div>
        `,
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Forgot password error:", err);
    return Response.json({ error: "Something went wrong" }, { status: 500 });
  }
}
