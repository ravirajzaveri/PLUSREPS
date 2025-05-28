import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { db } from "@/lib/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(req: Request) {
  console.log("🎯 Webhook called");

  const body = await req.text();
  const headerPayload = headers();
  const authorization = headerPayload.get("Authorization");

  if (!authorization) {
    return new Response("No authorization header", { status: 400 });
  }

  let event;
  try {
    event = receiver.receive(body, authorization);
    console.log("➡️ Event type:", event.event);
    console.log("➡️ Room name (username):", event.room?.name);
  } catch (error) {
    console.error("[WEBHOOK ERROR] Invalid signature:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const type = event.event;
  const room = event.room;
  const ingress = (type === "ingress_started" || type === "ingress_ended") ? (event as any).ingress : undefined;

  // Use fallback to get username from ingress if missing
  const username = room?.name || ingress?.roomName;

  if (!username) {
    console.warn("❗ Missing username in webhook event");
    return new Response("Missing username", { status: 400 });
  }

  console.log("➡️ Acting on username:", username);

  try {
    if (type === "room_started") {
      console.log(`✅ Marking ${username} as live`);
      await db.stream.updateMany({
        where: { user: { username } },
        data: { isLive: true },
      });
    }

    if (type === "room_finished") {
      console.log(`⛔ Marking ${username} as offline`);
      await db.stream.updateMany({
        where: { user: { username } },
        data: { isLive: false },
      });
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK DB ERROR]", error);
    return new Response("Internal error", { status: 500 });
  }
}
