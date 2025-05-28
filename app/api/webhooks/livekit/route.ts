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
    return new Response("No authorization header", { status: 400 });
  }

  let event;
  try {
    event = receiver.receive(body, authorization);
  } catch (error) {
    console.error("[LIVEKIT_WEBHOOK] Invalid signature:", error);
    return new Response("Invalid signature", { status: 403 });
  }

  const ingressId = event.ingressInfo?.ingressId;

  if (!ingressId) {
    return new Response("No ingress ID", { status: 400 });
  }

  if (event.event === "ingress_started") {
    // Optionally: Generate a thumbnail here using playback URL
    const placeholderThumbnail = "/thumbnails/default.jpg";

    await db.stream.update({
      where: { ingressId },
      data: {
        isLive: true,
        startedAt: new Date(),
        thumbnail: placeholderThumbnail, // Or null if capturing screenshot later
      },
    });
  }

  if (event.event === "ingress_ended") {
    await db.stream.update({
      where: { ingressId },
      data: {
        isLive: false,
      },
    });
  }

  return new Response("ok", { status: 200 });
}
