import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const getSelfFromAuth = async () => {
  const { userId } = auth();
  console.log("🔐 [auth-api] userId from auth():", userId);

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { externalUserId: userId },
  });

  console.log("🔐 [auth-api] Found DB user:", user?.id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
