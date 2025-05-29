import { getSelfFromAuth } from "@/lib/auth-api";
import { db } from "@/lib/db";

export async function GET() {
  try {
    console.log("📡 [API] /api/following-streams using auth()");
    const self = await getSelfFromAuth();

    const followedUsers = await db.follow.findMany({
      where: {
        followerId: self.id,
        following: {
          blocking: {
            none: {
              blockerId: self.id,
            },
          },
        },
      },
      include: {
        following: {
          include: {
            stream: {
              select: {
                isLive: true,
                title: true,
                thumbnail: true,
              },
            },
          },
        },
      },
    });

    console.log("✅ [API] Found:", followedUsers.length);
    return new Response(JSON.stringify(followedUsers), { status: 200 });
  } catch (error) {
    console.error("❌ [API] Error:", error);
    return new Response("Internal error", { status: 500 });
  }
}

