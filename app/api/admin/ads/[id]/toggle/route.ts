// app/api/admin/ads/[id]/toggle/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await db.ad.update({
      where: { id: params.id },
      data: { active: { set: undefined } }, // auto toggle
    });

    console.log("✅ Toggled ad:", ad.id, "Now:", ad.active);
    return NextResponse.json({ active: ad.active });
  } catch (err) {
    console.error("❌ Toggle failed:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
