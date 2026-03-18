async function refreshAccessToken(refreshToken) {
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

export async function GET(req) {
  let token = req.cookies.get("rr_token")?.value;
  const refresh = req.cookies.get("rr_refresh")?.value;

  if (!token && !refresh) {
    return Response.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Try to refresh if no access token
  let newToken = null;
  if (!token && refresh) {
    const refreshed = await refreshAccessToken(refresh);
    if (refreshed.access_token) {
      token = refreshed.access_token;
      newToken = refreshed.access_token;
    } else {
      return Response.json({ error: "Session expired" }, { status: 401 });
    }
  }

  const authHeader = { Authorization: `Bearer ${token}` };

  // 1. List accounts
  const accountsRes = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    { headers: authHeader }
  );
  const accountsData = await accountsRes.json();
  console.log("Accounts API response:", JSON.stringify(accountsData));

  if (!accountsData.accounts?.length) {
    return Response.json({ error: "No Google Business accounts found. API response: " + JSON.stringify(accountsData) }, { status: 404 });
  }

  // 2. List locations for each account
  const locationsData = await Promise.all(
    accountsData.accounts.map(async (account) => {
      const locRes = await fetch(
        `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title,storefrontAddress`,
        { headers: authHeader }
      );
      const locData = await locRes.json();
      return { account, locations: locData.locations || [] };
    })
  );

  // 3. Fetch reviews for each location
  const results = await Promise.all(
    locationsData.flatMap(({ account, locations }) =>
      locations.map(async (loc) => {
        // location.name is like "locations/123" — combine with account for reviews API
        const accountId = account.name.split("/")[1];
        const locationId = loc.name.split("/")[1];
        const reviewParent = `accounts/${accountId}/locations/${locationId}`;

        const reviewsRes = await fetch(
          `https://mybusiness.googleapis.com/v4/${reviewParent}/reviews?pageSize=50`,
          { headers: authHeader }
        );
        const reviewsData = await reviewsRes.json();

        return {
          locationName: loc.title || loc.name,
          locationPath: reviewParent,
          reviews: (reviewsData.reviews || []).map((r) => ({
            name: r.name,
            reviewer: r.reviewer?.displayName || "Anonymous",
            starRating: r.starRating, // ONE, TWO, THREE, FOUR, FIVE
            comment: r.comment || "",
            createTime: r.createTime,
            reply: r.reviewReply?.comment || null,
          })),
        };
      })
    )
  );

  const response = Response.json({ locations: results });

  // Set new token cookie if refreshed
  if (newToken) {
    response.headers.set(
      "Set-Cookie",
      `rr_token=${newToken}; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`
    );
  }

  return response;
}
