// app/api/razorpay/create-checkout/route.ts
import Razorpay from "razorpay";
import { authSponsor } from "@/lib/auth-sponsor";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const sponsor = await authSponsor();
    const { amountINR } = await req.json();

    const order = await razorpay.orders.create({
      amount: Math.round(amountINR * 100), // Razorpay uses paise
      currency: "INR",
      receipt: `wallet_recharge_${Date.now()}`,
      payment_capture: 1,
    });

    await db.walletTransaction.create({
      data: {
        sponsorId: sponsor.id,
        razorpayOrderId: order.id,
        amountINR,
        status: "PENDING",
      },
    });

    console.log("✅ Razorpay order created:", order.id);
    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    console.error("❌ Razorpay checkout error:", err);
    return NextResponse.json({ error: "Razorpay error" }, { status: 500 });
  }
}
