// app/api/razorpay/webhook/route.ts
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const rawBody = await req.text();
  const sig = req.headers.get("x-razorpay-signature") || "";

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (sig !== expected) {
    console.error("❌ Invalid Razorpay signature");
    return new Response("Invalid signature", { status: 400 });
  }

  const body = JSON.parse(rawBody);

  if (
    body.event === "payment.captured" &&
    body.payload.payment.entity.order_id
  ) {
    const payment = body.payload.payment.entity;
    const orderId = payment.order_id;

    const tx = await db.walletTransaction.findUnique({
      where: { razorpayOrderId: orderId },
    });

    if (!tx || tx.status !== "PENDING") {
      console.warn("⚠️ Transaction not found or already processed");
      return new Response("Ignored", { status: 200 });
    }

    await db.$transaction([
      db.walletTransaction.update({
        where: { razorpayOrderId: orderId },
        data: {
          razorpayPaymentId: payment.id,
          status: "SUCCESS",
        },
      }),
      db.sponsor.update({
        where: { id: tx.sponsorId },
        data: {
          walletBalanceINR: { increment: tx.amountINR },
        },
      }),
    ]);

    console.log("✅ Wallet recharge successful for:", tx.sponsorId);
  }

  return new Response("OK", { status: 200 });
}
