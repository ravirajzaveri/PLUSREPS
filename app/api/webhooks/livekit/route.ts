import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { db } from "@/lib/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    console.error("[LIVEKIT_WEBHOOK] Missing authorization header");
    return new Response("No authorization header", { status: 400 });
  }

  let event;
  try {
    event = receiver.receive(body, authorization);
  } catch (error) {
    console.error("[LIVEKIT_WEBHOOK] Invalid signature:", error);
    return new Response("Invalid signature", { status: 403 });
  }

  console.log("[LIVEKIT_WEBHOOK] Event received:", event.event);
  const ingressId = event.ingressInfo?.ingressId;
  console.log("[LIVEKIT_WEBHOOK] ingressId:", ingressId);

  if (!ingressId) {
    console.error("[LIVEKIT_WEBHOOK] No ingress ID in event");
    return new Response("No ingress ID", { status: 400 });
  }

  if (event.event === "ingress_started") {
    const placeholderThumbnail = "/thumbnails/default.jpg";

    const stream = await db.stream.findFirst({
      where: { ingressId },
    });

    console.log("[LIVEKIT_WEBHOOK] Found stream for ingress_started:", stream);

    if (!stream) {
      console.error("[LIVEKIT_WEBHOOK] No stream found with ingressId:", ingressId);
      return new Response("Stream not found", { status: 404 });
    }

    await db.stream.update({
      where: { ingressId },
      data: {
        isLive: true,
        startedAt: new Date(),
        thumbnail: placeholderThumbnail,
      },
    });

    console.log("[LIVEKIT_WEBHOOK] Stream marked as live");
  }

  if (event.event === "ingress_ended") {
    const stream = await db.stream.findFirst({
      where: { ingressId },
    });

    console.log("[LIVEKIT_WEBHOOK] Found stream for ingress_ended:", stream);

    if (!stream) {
      console.error("[LIVEKIT_WEBHOOK] No stream found with ingressId:", ingressId);
      return new Response("Stream not found", { status: 404 });
    }

    await db.stream.update({
      where: { ingressId },
      data: {
        isLive: false,
      },
    });

    console.log("[LIVEKIT_WEBHOOK] Stream marked as offline");
  }

  return new Response("ok", { status: 200 });
}
