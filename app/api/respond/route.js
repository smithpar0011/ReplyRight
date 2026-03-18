export async function POST(req) {
  const token = req.cookies.get("rr_token")?.value;
  if (!token) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { reviewName, comment } = await req.json();
  if (!reviewName || !comment?.trim()) {
    return Response.json({ error: "reviewName and comment are required" }, { status: 400 });
  }

  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/${reviewName}/reply`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ comment }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    return Response.json(
      { error: err.error?.message || "Failed to post response" },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}
