// app/api/ads/playable/route.ts
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { streamId } = await req.json();
    const user = await getSelf();

    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { location: true, interests: true },
    });

    const recentViews = await db.adView.findMany({
      where: {
        viewerId: user.id,
        streamId,
      },
      select: { adId: true },
    });
    const seenAdIds = recentViews.map((v) => v.adId);

    const today = new Date();

    const candidateAds = await db.ad.findMany({
      where: {
        active: true,
        startDate: { lte: today },
        endDate: { gte: today },
        totalBudgetINR: { gt: 0 },
        NOT: { id: { in: seenAdIds } },
        targetLocations: {
          has: userData?.location || "IN", // fallback to IN
        },
      },
    });

    const scored = candidateAds.map((ad) => {
      const matchCount =
        ad.categories.filter((cat) => userData?.interests.includes(cat)).length || 0;
      const meetsMin = matchCount >= ad.minInterestMatch;
      return meetsMin ? { ad, score: matchCount * ad.cpmINR } : null;
    }).filter(Boolean) as { ad: any, score: number }[];

    const bestAd = scored.sort((a, b) => b.score - a.score)[0]?.ad;

    if (!bestAd) {
      return NextResponse.json({ ad: null });
    }

    console.log("🎯 Selected ad:", bestAd.title);
    return NextResponse.json({ ad: bestAd });
  } catch (err) {
    console.error("❌ Failed to select ad:", err);
    return NextResponse.json({ error: "Ad selection error" }, { status: 500 });
  }
}
