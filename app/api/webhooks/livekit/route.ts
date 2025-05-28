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
    console.log("➡️ Room name:", event.room?.name);
  } catch (error) {
    console.error("[WEBHOOK ERROR] Invalid signature:", error);
    return new Response("Invalid signature", { status: 400 });
  }

  const { event: type, room } = event;
  const userId = room?.name;

  if (!userId) {
    console.warn("❗ Missing room name in webhook event");
    return new Response("Missing room name", { status: 400 });
  }

  try {
    if (type === "room_started") {
      console.log(`✅ Marking ${userId} as live`);
      await db.stream.updateMany({
        where: { userId },
        data: { isLive: true },
      });
    }

    if (type === "room_finished") {
      console.log(`⛔ Marking ${userId} as offline`);
      await db.stream.updateMany({
        where: { userId },
        data: { isLive: false },
      });
    }
// TEMP DEBUG: ensure field exists
/*const streams = await db.stream.findMany({
  select: { id: true, roomName: true },
});
console.log("🔧 Stream records (checking roomName field):", streams);
*/
    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK DB ERROR]", error);
    return new Response("Internal error", { status: 500 });
  }
}
