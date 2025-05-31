// app/api/ads/viewed/route.ts
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getSelf();
    const { adId, streamId, skipped } = await req.json();

    await db.adView.create({
      data: {
        adId,
        viewerId: user.id,
        streamId,
        skipped,
        engaged: !skipped,
      },
    });

    console.log("📼 Ad view logged:", adId, "| Skipped:", skipped);
    return new Response("OK");
  } catch (err) {
    console.error("❌ Error logging ad view:", err);
    return new Response("Internal error", { status: 500 });
  }
}
