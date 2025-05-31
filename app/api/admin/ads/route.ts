// app/api/admin/ads/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const ads = await db.ad.findMany({
      include: { sponsor: true },
    });

    const formatted = ads.map((ad) => ({
      id: ad.id,
      title: ad.title,
      type: ad.type,
      cpmINR: ad.cpmINR,
      dailyBudgetINR: ad.dailyBudgetINR,
      totalBudgetINR: ad.totalBudgetINR,
      active: ad.active,
      sponsorName: ad.sponsor.name,
    }));

    return NextResponse.json(formatted);
  } catch (err) {
    console.error("❌ Failed to load admin ads:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
