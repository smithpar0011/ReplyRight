export async function GET() {
  const headers = new Headers({ Location: "/" });
  const cookieOpts = "HttpOnly; Path=/; SameSite=Lax; Max-Age=0";
  headers.append("Set-Cookie", `rr_token=; ${cookieOpts}`);
  headers.append("Set-Cookie", `rr_refresh=; ${cookieOpts}`);
  return new Response(null, { status: 302, headers });
}
