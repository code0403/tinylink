
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Allowed code regex (from problem spec)
const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/;

// Helper to generate random code
function generateCode(length = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { targetUrl, customCode } = body;

    // Validate URL
    try {
      new URL(targetUrl);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL" },
        { status: 400 }
      );
    }

    // If user provided custom code
    if (customCode) {
      if (!CODE_REGEX.test(customCode)) {
        return NextResponse.json(
          { error: "Custom code must match [A-Za-z0-9]{6,8}" },
          { status: 400 }
        );
      }

      // Check duplicate custom code
      const existing = await prisma.link.findUnique({
        where: { code: customCode },
      });

      if (existing) {
        return NextResponse.json(
          { error: "Custom code already exists" },
          { status: 409 }
        );
      }

      const link = await prisma.link.create({
        data: {
          code: customCode,
          targetUrl,
        },
      });

      return NextResponse.json(link, { status: 201 });
    }

    // No custom code → auto-generate
    let code = generateCode(6);

    // Ensure uniqueness
    let exists = await prisma.link.findUnique({ where: { code } });
    while (exists) {
      code = generateCode(6);
      exists = await prisma.link.findUnique({ where: { code } });
    }

    const link = await prisma.link.create({
      data: {
        code,
        targetUrl,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(links);
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
