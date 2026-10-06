import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { prisma } from "@/app/lib/prisma";

const COOKIE_NAME = "visitor_id";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

async function resolveVisitorId(): Promise<{ id: string; isNew: boolean }> {
  const store = await cookies();
  const existing = store.get(COOKIE_NAME)?.value;
  if (existing) return { id: existing, isNew: false };
  return { id: randomUUID(), isNew: true };
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: articleId } = await params;
  const { id: visitorId } = await resolveVisitorId();

  const [count, existing] = await Promise.all([
    prisma.like.count({ where: { articleId } }),
    prisma.like.findUnique({
      where: { articleId_visitorId: { articleId, visitorId } },
    }),
  ]);

  return NextResponse.json({ count, liked: !!existing });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: articleId } = await params;
  const { id: visitorId, isNew } = await resolveVisitorId();

  const existing = await prisma.like.findUnique({
    where: { articleId_visitorId: { articleId, visitorId } },
  });

  if (existing) {
    await prisma.like.delete({
      where: { articleId_visitorId: { articleId, visitorId } },
    });
  } else {
    await prisma.like.create({ data: { articleId, visitorId } });
  }

  const count = await prisma.like.count({ where: { articleId } });

  const res = NextResponse.json({ count, liked: !existing });

  // Set the visitor cookie on first interaction
  if (isNew) {
    res.cookies.set(COOKIE_NAME, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: ONE_YEAR_SECONDS,
      path: "/",
    });
  }

  return res;
}
