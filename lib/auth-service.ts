import { currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const getSelf = async () => {
  const self = await currentUser();
  console.log("🔍 [auth-service] currentUser():", self?.id);

  if (!self) {
    console.warn("❌ [auth-service] No currentUser, throwing Unauthorized");
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { externalUserId: self.id },
  });

  console.log("🔍 [auth-service] Fetched user from DB:", user?.id);

  if (!user) {
    console.warn("❌ [auth-service] DB user not found");
    throw new Error("Not found");
  }

  return user;
};


export const getSelfByUsername = async (username: string) => {
  const self = await currentUser();

  if (!self) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (self.id !== user.externalUserId) {
    throw new Error("Unauthorized");
  }

  return user;
};
