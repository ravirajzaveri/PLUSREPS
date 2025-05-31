// app/api/ads/viewed/route.ts
import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await getSelf();
    const { adId, streamId, skipped } = await req.json();

    const ad = await db.ad.findUnique({ where: { id: adId },  include: { views: true },  });
    if (!ad || !ad.active) {
      console.warn("⚠️ Invalid or inactive ad:", adId);
      return new Response("Invalid ad", { status: 400 });
    }

    // Calculate cost (per view CPM)
    const costPerView = ad.cpmINR / 1000;

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));

    // Count today's views
    const todayViews = await db.adView.count({
      where: {
        adId,
        viewedAt: { gte: startOfDay },
      },
    });

    const expectedDailySpend = (todayViews + 1) * costPerView;
    const expectedTotalSpend = (ad.views.length + 1) * costPerView;

    const willExceedDaily = expectedDailySpend > ad.dailyBudgetINR;
    const willExceedTotal = expectedTotalSpend > ad.totalBudgetINR;

    if (willExceedDaily || willExceedTotal) {
      // Auto disable
      await db.ad.update({
        where: { id: adId },
        data: { active: false },
      });
      console.warn("🚫 Ad auto-disabled:", adId, "(Budget limit hit)");
      return new Response("Ad budget exceeded", { status: 400 });
    }

    // Proceed with view tracking
    await db.adView.create({
      data: {
        adId,
        viewerId: user.id,
        streamId,
        skipped,
        engaged: !skipped,
      },
    });

    console.log("📼 Ad view OK | Cost: ₹" + costPerView.toFixed(2));
    return new Response("OK");
  } catch (err) {
    console.error("❌ Error logging ad view:", err);
    return new Response("Internal error", { status: 500 });
  }
}

