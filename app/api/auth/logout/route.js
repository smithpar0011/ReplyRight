export async function GET() {
  const headers = new Headers({ Location: "/" });

  const clear = (name, httpOnly = false) => {
    const base = `${name}=; Path=/; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure`;
    return httpOnly ? base + "; HttpOnly" : base;
  };

  headers.append("Set-Cookie", clear("rr_session", true));
  headers.append("Set-Cookie", clear("rr_token", true));
  headers.append("Set-Cookie", clear("rr_refresh", true));
  headers.append("Set-Cookie", clear("rr_user"));
  headers.append("Set-Cookie", clear("rr_plan"));
  headers.append("Set-Cookie", clear("rr_billing"));
  headers.append("Set-Cookie", clear("rr_signup"));

  return new Response(null, { status: 302, headers });
}
