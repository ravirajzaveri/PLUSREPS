import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const followings = await db.follow.findMany({
      where: { followerId: userId },
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
      .sort((a, b) => Number(b.isLive) - Number(a.isLive));

    console.log("Raw stream data:", formatted);

    return new Response(JSON.stringify(formatted), { status: 200 });
  } catch (error) {
    console.error("[FOLLOWING_STREAMS]", error);
    return new Response("Internal error", { status: 500 });
  }
}
