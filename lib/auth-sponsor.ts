// lib/auth-sponsor.ts
import { currentUser } from "@clerk/nextjs/server";
import { db } from "./db";

export async function authSponsor() {
  const user = await currentUser();

  if (!user || !user.emailAddresses[0]?.emailAddress) {
    throw new Error("Unauthorized");
  }

  const sponsor = await db.sponsor.findUnique({
    where: { email: user.emailAddresses[0].emailAddress },
  });

  if (!sponsor) {
    throw new Error("No sponsor account found");
  }

  return sponsor;
}
