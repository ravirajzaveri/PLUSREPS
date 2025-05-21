import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get('file') as File | null;
  const buffer = file ? Buffer.from(await file.arrayBuffer()) : null;

  const filename = file ? `${Date.now()}-${file.name}` : null;

  if (buffer && filename) {
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);
    await writeFile(filepath, buffer);
  }

  await prisma.betaStreamer.create({
    data: {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      socialLink: formData.get('socialLink') as string,
      category: formData.get('category') as string,
      bio: formData.get('bio') as string,
      clipUrl: filename ? `/uploads/${filename}` : null,
    },
  });

  return NextResponse.json({ success: true });
}
