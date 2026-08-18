import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const progressSchema = z.object({
  bookId: z.string().min(1),
  lastPage: z.number().int().min(1),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const parsed = progressSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const { bookId, lastPage } = parsed.data;

  const progress = await prisma.readingProgress.upsert({
    where: { userId_bookId: { userId: session.user.id, bookId } },
    update: { lastPage },
    create: { userId: session.user.id, bookId, lastPage },
  });

  return NextResponse.json({ progress });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");
  if (!bookId) {
    return NextResponse.json({ error: "bookId is required." }, { status: 400 });
  }

  const progress = await prisma.readingProgress.findUnique({
    where: { userId_bookId: { userId: session.user.id, bookId } },
  });

  return NextResponse.json({ progress });
}
