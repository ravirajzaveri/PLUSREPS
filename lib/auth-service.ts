import { auth } from "@clerk/nextjs/server"; // ✅ WORKS in app/api routes
import { db } from "@/lib/db";

export const getSelf = async () => {
  const { userId } = auth(); // ✅ works in both RSC & API routes

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { externalUserId: userId },
  });

  if (!user) {
    throw new Error("Not found");
  }

  return user;
};

export const getSelfByUsername = async (username: string) => {
  const { userId } = auth(); // ✅ same fix here

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.externalUserId !== userId) {
    throw new Error("Unauthorized");
  }

  return user;
};

