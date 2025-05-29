import { getFollowedUsers } from "@/lib/follow-service";

export async function GET() {
  try {
    console.log("📡 [API] /api/following-streams called");
    const data = await getFollowedUsers();
    console.log("📦 [API] Returned data length:", data.length);

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("❌ [API] Error in /following-streams:", error);
    return new Response("Internal error", { status: 500 });
  }
}
