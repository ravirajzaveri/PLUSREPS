import { getFollowedUsersFromAPI } from "@/lib/follow-service";

export async function GET() {
  try {
    console.log("📡 [API] /api/following-streams (auth-safe) hit");
    const data = await getFollowedUsersFromAPI();
    console.log("📦 [API] Returning:", data.length);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("❌ [API] Error:", error);
    return new Response("Internal error", { status: 500 });
  }
}
