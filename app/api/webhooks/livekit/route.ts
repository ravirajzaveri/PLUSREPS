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
    return new Response("Invalid signature", { status: 400 });
  }

  const { event: type, room } = event;
  const userId = room?.name;

  if (!userId) return new Response("Missing room name", { status: 400 });

  if (type === "room_started") {
    await db.stream.updateMany({
      where: { userId },
      data: { isLive: true },
    });
  }

  if (type === "room_finished") {
    await db.stream.updateMany({
      where: { userId },
      data: { isLive: false },
    });
  }

  return new Response("OK", { status: 200 });
}
