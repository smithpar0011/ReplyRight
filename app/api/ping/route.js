import supabase from "../../lib/supabase";

export async function GET() {
  try {
    const { count } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true });

    return Response.json({ status: "ok", users: count, timestamp: new Date().toISOString() });
  } catch (err) {
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
}
