import { getFollowedUsers } from "@/lib/follow-service";

export async function GET() {
  try {
    const data = await getFollowedUsers();

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error("[FOLLOWING_STREAMS]", error);
    return new Response("Internal error", { status: 500 });
  }
}
