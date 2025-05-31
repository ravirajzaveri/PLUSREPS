// app/api/ads/create/route.ts
import { db } from "@/lib/db";
import { authSponsor } from "@/lib/auth-sponsor"; // helper to get current sponsor
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const sponsor = await authSponsor(); // Authenticated sponsor
    const body = await req.json();

    const {
      title,
      videoUrl,
      durationSeconds,
      type,
      isSkippable,
      cpmINR,
      dailyBudgetINR,
      totalBudgetINR,
      startDate,
      endDate,
      categories,
      targetLocations,
      minInterestMatch,
    } = body;

    if (totalBudgetINR < dailyBudgetINR) {
      return NextResponse.json({ error: "Total budget must be >= daily budget" }, { status: 400 });
    }

    const ad = await db.ad.create({
      data: {
        title,
        videoUrl,
        durationSeconds,
        type,
        isSkippable,
        cpmINR,
        dailyBudgetINR,
        totalBudgetINR,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        categories,
        targetLocations,
        minInterestMatch,
        sponsorId: sponsor.id,
      },
    });

    console.log("✅ New ad created:", ad.id);
    return NextResponse.json({ ad });
  } catch (error) {
    console.error("❌ Error creating ad:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
