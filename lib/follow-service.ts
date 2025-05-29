import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";

export const isFollowingUser = async (id: string) => {
  try {
    const self = await getSelf();
    console.log("🔍 [isFollowingUser] self.id:", self.id);

    const otherUser = await db.user.findUnique({ where: { id } });
    console.log("🔍 [isFollowingUser] otherUser.id:", otherUser?.id);

    if (!otherUser) throw new Error("User not found");
    if (otherUser.id === self.id) return true;

    const existingFollow = await db.follow.findFirst({
      where: { followerId: self.id, followingId: otherUser.id },
    });

    console.log("🔍 [isFollowingUser] Follow exists:", !!existingFollow);
    return !!existingFollow;
  } catch (err) {
    console.warn("⚠️ [isFollowingUser] Error or not following:", err);
    return false;
  }
};

export const followUser = async (id: string) => {
  const self = await getSelf();
  console.log("🔍 [followUser] self.id:", self.id);

  const otherUser = await db.user.findUnique({ where: { id } });
  if (!otherUser) throw new Error("User not found");
  if (otherUser.id === self.id) throw new Error("Cannot follow yourself");

  const existingFollow = await db.follow.findFirst({
    where: { followerId: self.id, followingId: otherUser.id },
  });

  if (existingFollow) throw new Error("Already following");

  const follow = await db.follow.create({
    data: {
      followerId: self.id,
      followingId: otherUser.id,
    },
    include: {
      following: true,
      follower: true,
    },
  });

  console.log("✅ [followUser] Follow created:", follow.id);
  return follow;
};

export const unfollowUser = async (id: string) => {
  const self = await getSelf();
  console.log("🔍 [unfollowUser] self.id:", self.id);

  const otherUser = await db.user.findUnique({ where: { id } });
  if (!otherUser) throw new Error("User not found");
  if (otherUser.id === self.id) throw new Error("Cannot unfollow yourself");

  const existingFollow = await db.follow.findFirst({
    where: { followerId: self.id, followingId: otherUser.id },
  });

  if (!existingFollow) throw new Error("Not following");

  const follow = await db.follow.delete({
    where: { id: existingFollow.id },
    include: { following: true },
  });

  console.log("✅ [unfollowUser] Follow deleted:", follow.id);
  return follow;
};

export const getFollowedUsers = async () => {
  try {
    const self = await getSelf();
    console.log("🔍 [getFollowedUsers] self.id:", self.id);

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

    console.log("✅ [getFollowedUsers] found:", followedUsers.length);
    return followedUsers;
  } catch (err) {
    console.warn("⚠️ [getFollowedUsers] Error or unauthorized:", err);
    return [];
  }
};
