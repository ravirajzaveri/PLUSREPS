"use server";

import {
  IngressAudioEncodingPreset,
  IngressInput,
  IngressClient,
  IngressVideoEncodingPreset,
  RoomServiceClient,
  type CreateIngressOptions,
} from "livekit-server-sdk";

import { TrackSource } from "livekit-server-sdk/dist/proto/livekit_models";

import { db } from "@/lib/db";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!,
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!);

// ✅ Now uses username instead of ID
export const resetIngresses = async (roomName: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName,
  });

  const rooms = await roomService.listRooms([roomName]);

  for (const room of rooms) {
    await roomService.deleteRoom(room.name);
  }

  for (const ingress of ingresses) {
    if (ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId);
    }
  }
};

export const createIngress = async (ingressType: IngressInput) => {
await db.stream.deleteMany({});
  
const self = await getSelf();

  // ✅ Fix: pass username instead of id
  await resetIngresses(self.username);

  const options: CreateIngressOptions = {
    name: self.username,
    roomName: self.username,
    participantName: self.username,
    participantIdentity: self.id,
  };

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.bypassTranscoding = true;
  } else {
    options.video = {
      source: TrackSource.CAMERA,
      preset: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
    };
    options.audio = {
      source: TrackSource.MICROPHONE,
      preset: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
    };
  }

  const ingress = await ingressClient.createIngress(ingressType, options);

  if (!ingress?.url || !ingress?.streamKey) {
    throw new Error("Failed to create ingress");
  }

  await db.stream.upsert({
    where: { userId: self.id },
    update: {
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey,
      roomName: self.username, // ✅ stored for webhook match
      isLive: true,
    },
    create: {
      userId: self.id,
      title: `${self.username}'s stream`,
      ingressId: ingress.ingressId,
      serverUrl: ingress.url,
      streamKey: ingress.streamKey,
      roomName: self.username,
      isLive: true,
    },
  });

  revalidatePath(`/u/${self.username}/keys`);
  return ingress;
};
