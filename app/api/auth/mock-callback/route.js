export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.replyrightapp.com";

  const mockUser = JSON.stringify({
    name: "Parker's Coffee Shop",
    email: "parker@coffeeshop.com",
    picture: "",
  });

  const headers = new Headers({
    Location: `${baseUrl}/?signup=payment`,
  });

  // Set mock token
  headers.append(
    "Set-Cookie",
    `rr_token=mock_access_token; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`
  );

  // Set mock user info
  headers.append(
    "Set-Cookie",
    `rr_user=${encodeURIComponent(mockUser)}; Path=/; SameSite=Lax; Max-Age=2592000`
  );

  return new Response(null, { status: 302, headers });
}
