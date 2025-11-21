
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


// GET /:code → redirect
export async function GET(request: Request, context: { params: Promise<{ code: string }> }) {
    try {
        const { params } = context;
        const resolvedParams = await params; // ✅ unwrap the Promise
        const { code } = resolvedParams;

        console.log("resolvedParams:", resolvedParams);
        console.log("code:", code);

        // const { code } = params;

        // 1. First we will find link by code
        const link = await prisma.link.findUnique({
            where: { code },
        });

        if (!link) {
            return new Response("Not found", { status: 404 });
        }

        // 2. Record click
        await prisma.click.create({
            data: {
                linkId: link.id,
            },
        });

        // Update click stats
        await prisma.link.update({
            // where: { code },
             where: { id: link.id },
            data: {
                // totalClicks: link.totalClicks + 1,
                totalClicks: { increment: 1 },
                lastClicked: new Date(),
            },
        });

        return NextResponse.redirect(link.targetUrl, { status: 302 });
    } catch (error) {
        console.error(error);
        return new Response("Server error", { status: 500 });
    }
}
