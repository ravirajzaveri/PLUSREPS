import { getSelf } from "@/lib/auth-service";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = auth();
  console.log("🧪 [FOLLOWING_STREAMS] userId:", userId);
  console.log("🔍 DB followings raw:", followings);

  try {
    const self = await getSelf();

    const followings = await db.follow.findMany({
      where: { followerId: self.id },
      include: {
        following: {
          include: { stream: true },
        },
      },
    });

    const formatted = followings
      .map(f => ({
        id: f.following.id,
        username: f.following.username,
        imageUrl: f.following.imageUrl,
        isLive: f.following.stream?.isLive ?? false,
        title: f.following.stream?.title ?? "Offline",
        thumbnail: f.following.stream?.thumbnail ?? null,
      }))
      .sort((a, b) => Number(b.isLive) - Number(a.isLive)); // live first

    console.log("Raw stream data:", formatted); // ✅ this should be after .sort

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (error) {
    console.error("[FOLLOWING_STREAMS]", error);
    return new Response("Internal error", { status: 500 });
  }
}
